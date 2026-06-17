// @ts-nocheck - chokidar/ignore are transitive deps without declared types here
import { execSync } from 'node:child_process';
import { spawn } from 'node:child_process';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import process from 'node:process';
import { watch } from 'chokidar';
import ignore from 'ignore';

const ROOT = path.resolve(import.meta.dirname, '..', '..');

// The dev server always binds to this port. Anything already on it is killed
// before startup and after each managed restart to prevent port cascades.
const DEV_PORT = 4321;

// Files and directories to watch that Astro/Vite does not normally pick up.
// Patterns are relative to the project root.
const EXTRA_WATCH_PATTERNS = [
  'astro.config.ts',
  'tsconfig.json',
  'tailwind.config.*',
  'postcss.config.*',
  'biome.json',
  'package.json',
  '.env',
  '.env.*',
  'src/data/**/*',
  'src/config/**/*',
  'src/scripts/build/**/*',
  // New files anywhere in src/ (covers additions Vite misses)
  'src/**/*.ts',
  'src/**/*.astro',
  'src/**/*.css',
];

// Directories where chokidar will track newly added files.
// (Vite sometimes misses new file additions even in watched directories.)
const NEW_FILE_WATCH_DIRS = ['src'];

// Directories/patterns chokidar should always ignore on top of .gitignore.
const ALWAYS_IGNORED = [
  '**/node_modules/**',
  '**/.astro/**',
  '**/dist/**',
  '**/.wireit/**',
  '**/coverage/**',
  '**/reports/**',
  '**/public/og_image/**',
  '**/src/content/_generated/**',
  '**/.git/**',
];

// ─── Crash-loop circuit breaker ──────────────────────────────────────────────

// If the server crashes this many times within the window, stop and alert.
const CRASH_LOOP_MAX = 5;
const CRASH_LOOP_WINDOW_MS = 15_000;
const recentCrashTimes: number[] = [];

function recordCrash(): void {
  const now = Date.now();
  recentCrashTimes.push(now);
  // Evict timestamps outside the window
  while (recentCrashTimes.length > 0 && recentCrashTimes[0] < now - CRASH_LOOP_WINDOW_MS) {
    recentCrashTimes.shift();
  }
}

function isInCrashLoop(): boolean {
  return recentCrashTimes.length >= CRASH_LOOP_MAX;
}

// ─── Desktop notifications ────────────────────────────────────────────────────

function notify(title: string, body: string): void {
  try {
    execSync(`notify-send -u critical -t 0 ${JSON.stringify(title)} ${JSON.stringify(body)}`, {
      stdio: 'ignore',
    });
  } catch {
    // notify-send unavailable; the console message is the fallback
  }
}

// ─── Port utilities ──────────────────────────────────────────────────────────

function isPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => server.close(() => resolve(true)));
    server.listen(port, '0.0.0.0');
  });
}

function killPortOccupant(port: number): void {
  // Try lsof first (available on Linux and macOS), fall back to fuser (Linux).
  try {
    const raw = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const pids = raw.split('\n').map(Number).filter(Boolean);
    for (const pid of pids) {
      try { process.kill(pid, 'SIGKILL'); } catch { /* already gone */ }
    }
  } catch {
    try {
      execSync(`fuser -k ${port}/tcp`, { stdio: 'ignore' });
    } catch { /* nothing on that port */ }
  }
}

async function waitForPortFree(port: number, timeoutMs = 8000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await isPortFree(port)) return;
    await new Promise((r) => setTimeout(r, 150));
  }
  // Log and proceed rather than throwing — Astro will report its own error.
  console.warn(`\x1b[33m[webserver]\x1b[0m Port ${port} still occupied after ${timeoutMs}ms, starting anyway...`);
}

async function claimPort(port: number): Promise<void> {
  if (await isPortFree(port)) return;
  console.log(`\x1b[36m[webserver]\x1b[0m Port ${port} occupied — killing occupant...`);
  killPortOccupant(port);
  await waitForPortFree(port);
}

// ─── Gitignore ───────────────────────────────────────────────────────────────

function loadGitignore(): ReturnType<typeof ignore> {
  const ig = ignore();
  const gitignorePath = path.join(ROOT, '.gitignore');
  if (existsSync(gitignorePath)) {
    ig.add(readFileSync(gitignorePath, 'utf-8'));
  }
  return ig;
}

function isIgnored(filePath: string, ig: ReturnType<typeof ignore>): boolean {
  const rel = path.relative(ROOT, filePath);
  if (rel.startsWith('..')) return false;
  try {
    return ig.ignores(rel);
  } catch {
    return false;
  }
}

// ─── Server lifecycle ────────────────────────────────────────────────────────

let serverProcess: ReturnType<typeof spawn> | null = null;
let restartTimer: ReturnType<typeof setTimeout> | null = null;
let isRestarting = false;

// Known fatal stderr patterns that should not trigger a restart.
const FATAL_PATTERNS: Array<{ pattern: RegExp; hint: string }> = [
  {
    pattern: /ENOSPC.*file watcher|System limit for number of file watchers/i,
    hint: 'Increase the inotify limit:\n  echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf\n  sudo sysctl -p',
  },
];

function startServer(): void {
  if (serverProcess) return;

  let fatalReason: string | null = null;

  console.log('\x1b[36m[webserver]\x1b[0m Starting Astro dev server...');

  // Capture stderr so we can detect fatal errors; pipe it through so output
  // still appears in the terminal.
  serverProcess = spawn('npx', ['astro', 'dev', '--port', String(DEV_PORT)], {
    cwd: ROOT,
    stdio: ['inherit', 'inherit', 'pipe'],
    shell: false,
    env: { ...process.env },
  });

  serverProcess.stderr.on('data', (chunk: Buffer) => {
    process.stderr.write(chunk);
    const text = chunk.toString();
    for (const { pattern, hint } of FATAL_PATTERNS) {
      if (pattern.test(text) && !fatalReason) {
        fatalReason = hint;
      }
    }
  });

  serverProcess.on('error', (err) => {
    console.error('\x1b[31m[webserver]\x1b[0m Server process error:', err.message);
  });

  serverProcess.on('exit', (code, signal) => {
    serverProcess = null;
    if (isRestarting) return;
    if (signal === 'SIGTERM' || signal === 'SIGINT') return;

    if (fatalReason) {
      const msg = `\x1b[31m[webserver]\x1b[0m Fatal error — not restarting.\n${fatalReason}`;
      console.error(msg);
      notify('[webserver] Fatal error — dev server stopped', fatalReason);
      process.exit(1);
    }

    recordCrash();

    if (isInCrashLoop()) {
      const msg = `Crashed ${CRASH_LOOP_MAX} times in ${CRASH_LOOP_WINDOW_MS / 1000}s. Giving up. Restart manually with: npm run dev:watch`;
      console.error(`\x1b[31m[webserver]\x1b[0m Crash loop detected — ${msg}`);
      notify('[webserver] Crash loop — dev server stopped', msg);
      process.exit(1);
    }

    console.log(`\x1b[33m[webserver]\x1b[0m Server exited (code ${code}, signal ${signal}), restarting...`);
    claimPort(DEV_PORT).then(startServer);
  });
}

function scheduleRestart(reason: string): void {
  if (restartTimer) clearTimeout(restartTimer);
  restartTimer = setTimeout(() => doRestart(reason), 500);
}

function doRestart(reason: string): void {
  isRestarting = true;
  console.log(`\x1b[36m[webserver]\x1b[0m Restarting: ${reason}`);

  const doStart = () => {
    claimPort(DEV_PORT).then(() => {
      isRestarting = false;
      startServer();
    });
  };

  if (serverProcess) {
    serverProcess.once('exit', doStart);
    serverProcess.kill('SIGTERM');
    // Force-kill after 5s if it doesn't exit cleanly
    setTimeout(() => {
      if (serverProcess) serverProcess.kill('SIGKILL');
    }, 5000);
  } else {
    doStart();
  }
}

function relativeLabel(filePath: string): string {
  return path.relative(ROOT, filePath);
}

// ─── RESTART file poller ─────────────────────────────────────────────────────

const RESTART_FILE = path.join(ROOT, 'RESTART');
const RESTART_POLL_INTERVAL_MS = 2000;

function startRestartFilePoller(): void {
  setInterval(() => {
    if (existsSync(RESTART_FILE)) {
      try {
        rmSync(RESTART_FILE);
      } catch {
        // ignore — another process may have removed it first
      }
      scheduleRestart('RESTART file detected');
    }
  }, RESTART_POLL_INTERVAL_MS);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const ig = loadGitignore();

  await claimPort(DEV_PORT);
  startServer();
  startRestartFilePoller();

  const watcher = watch(EXTRA_WATCH_PATTERNS, {
    cwd: ROOT,
    persistent: true,
    ignoreInitial: true,
    ignored: ALWAYS_IGNORED,
    ignorePermissionErrors: true,
    awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 50 },
  });

  // Also watch project root for newly added source directories
  const newFileWatcher = watch(NEW_FILE_WATCH_DIRS, {
    cwd: ROOT,
    persistent: true,
    ignoreInitial: true,
    ignored: ALWAYS_IGNORED,
    depth: 10,
    ignorePermissionErrors: true,
  });

  const onChange = (eventLabel: string) => (filePath: string) => {
    const abs = path.isAbsolute(filePath) ? filePath : path.join(ROOT, filePath);
    if (isIgnored(abs, ig)) return;
    scheduleRestart(`${eventLabel} ${relativeLabel(abs)}`);
  };

  // Config/data/script changes always trigger restart
  watcher
    .on('change', onChange('changed'))
    .on('add', onChange('added'))
    .on('unlink', onChange('removed'));

  // New file additions anywhere in watched source dirs trigger restart
  newFileWatcher.on('add', (filePath) => {
    const abs = path.isAbsolute(filePath) ? filePath : path.join(ROOT, filePath);
    if (isIgnored(abs, ig)) return;
    // Only care about non-content additions (content is already watched by Astro)
    const rel = path.relative(ROOT, abs);
    const isContent = rel.startsWith('src/content/blog/') || rel.startsWith('src/content/tags/');
    if (!isContent) {
      scheduleRestart(`new file: ${relativeLabel(abs)}`);
    }
  });

  const shutdown = (signal: string) => {
    console.log(`\x1b[36m[webserver]\x1b[0m ${signal} received, shutting down...`);
    isRestarting = true;
    watcher.close();
    newFileWatcher.close();
    if (serverProcess) {
      serverProcess.kill('SIGTERM');
      serverProcess.once('exit', () => process.exit(0));
      setTimeout(() => process.exit(0), 3000);
    } else {
      process.exit(0);
    }
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  console.log('\x1b[36m[webserver]\x1b[0m Watching for config/data/script changes outside normal Vite scope...');
}

main();
