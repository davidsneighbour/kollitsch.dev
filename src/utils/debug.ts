import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const colors = {
  labelDebug: '\x1b[35m',
  labelNote: '\x1b[32m',
  labelWarn: '\x1b[33m',
  labelError: '\x1b[31m',
  reset: '\x1b[0m',
  timestamp: '\x1b[36m',
  type: '\x1b[2m',
};


const LOG_LEVELS = (process.env.LOG_LEVEL ?? 'debug|note|warn')
  .split('|')
  .map((v) => v.trim().toLowerCase());

const warnedLevels = new Set<string>();

let logFileStream: fs.WriteStream | null = null;
let logFileInitialized = false;

function setupLogFile() {
  if (logFileInitialized) return;
  logFileInitialized = true;

  const fileBase = process.env.LOG_FILE;
  if (!fileBase) return;

  const logsDir = path.resolve('logs');
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const ip =
    Object.values(os.networkInterfaces())
      .flat()
      .find((iface) => iface && iface.family === 'IPv4' && !iface.internal)
      ?.address?.replace(/\./g, '-') || 'unknown';

  const filename = `${fileBase}-${date}-${ip}.log`;
  const fullPath = path.join(logsDir, filename);

  fs.mkdirSync(logsDir, { recursive: true });
  logFileStream = fs.createWriteStream(fullPath, { flags: 'a' });
  console.log('LOG_FILE:', process.env.LOG_FILE);
  console.log('Resolved log path:', fullPath);
}

function writeToFile(raw: string) {
  if (!logFileInitialized) {
    setupLogFile();
    if (!logFileStream) {
      console.warn('logFileStream not initialized after setupLogFile()');
    }
  }

  if (logFileStream) {
    logFileStream.write(raw + '\n');
  } else {
    console.warn('logFileStream is null — skipping file write');
  }
}

function formatPrefix(label: string): string {
  const time = new Date().toTimeString().slice(0, 8);
  return `${colors.timestamp}${time}${colors.reset} ${label}[dnb]${colors.reset}`;
}

function shouldLog(level: string): boolean {
  if (level === 'error') return true;
  const enabled = LOG_LEVELS.includes(level);
  if (!enabled && !warnedLevels.has(level)) {
    warnedLevels.add(level);
    const msg = `${formatPrefix(colors.labelWarn)} ${colors.type}(info)${colors.reset} log level '${level}' disabled by LOG_LEVEL`;
    console.log(msg);
    writeToFile(stripAnsi(msg));
  }
  return enabled;
}

function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

function print(labelColor: string, level: string, ...args: unknown[]): void {
  if (!shouldLog(level)) return;
  const prefix = formatPrefix(labelColor);
  for (const arg of args) {
    const type = typeof arg;
    const value = type === 'object' ? JSON.stringify(arg, null, 2) : String(arg);
    const line =
      typeof arg === 'string'
        ? `${prefix} ${arg}`
        : `${prefix} ${colors.type}(${type})${colors.reset} ${value}`;
    console.log(line);
    writeToFile(stripAnsi(line));
  }
}

/**
 * Logger utility with console + file output and level filtering.
 *
 * .env options:
 *   LOG_LEVEL=debug|note|warn
 *   LOG_FILE=astro-logging
 */
export const log = {
  debug: (...args: unknown[]) => print(colors.labelDebug, 'debug', ...args),
  note: (...args: unknown[]) => print(colors.labelNote, 'note', ...args),
  warn: (...args: unknown[]) => print(colors.labelWarn, 'warn', ...args),
  error: (...args: unknown[]) => print(colors.labelError, 'error', ...args),
};
