const colors = {
  labelDebug: '\x1b[35m',
  labelError: '\x1b[31m',
  labelNote: '\x1b[32m',
  labelWarn: '\x1b[33m',
  reset: '\x1b[0m',
  timestamp: '\x1b[36m',
  type: '\x1b[2m',
};

const LOG_LEVELS = (process.env.LOG_LEVEL ?? 'debug|note|warn')
  .split('|')
  .map((v) => v.trim().toLowerCase());

const warnedLevels = new Set<string>();

function formatPrefix(label: string): string {
  const time = new Date().toTimeString().slice(0, 8);
  return `${colors.timestamp}${time}${colors.reset} ${label}[dnb]${colors.reset}`;
}

/**
 * Creates an isolated logger instance that can be muted or resumed per import.
 */
export function createLogger() {
  let muted = false;

  function shouldLog(level: string): boolean {
    if (muted) return false;
    if (level === 'error') return true;
    const enabled = LOG_LEVELS.includes(level);
    if (!enabled && !warnedLevels.has(level)) {
      warnedLevels.add(level);
      const msg = `${formatPrefix(colors.labelWarn)} ${colors.type}(info)${colors.reset} log level '${level}' disabled by LOG_LEVEL`;
      console.log(msg);
    }
    return enabled;
  }

  function print(labelColor: string, level: string, ...args: unknown[]): void {
    if (!shouldLog(level)) return;
    const prefix = formatPrefix(labelColor);
    for (const arg of args) {
      const type = typeof arg;
      const value =
        type === 'object' ? JSON.stringify(arg, null, 2) : String(arg);
      const line =
        typeof arg === 'string'
          ? `${prefix} ${arg}`
          : `${prefix} ${colors.type}(${type})${colors.reset} ${value}`;
      console.log(line);
    }
  }

  return {
    debug: (...args: unknown[]) => print(colors.labelDebug, 'debug', ...args),
    error: (...args: unknown[]) => print(colors.labelError, 'error', ...args),
    note: (...args: unknown[]) => print(colors.labelNote, 'note', ...args),
    warn: (...args: unknown[]) => print(colors.labelWarn, 'warn', ...args),
    stop: () => {
      muted = true;
    },
    start: () => {
      muted = false;
    },
  };
}

// default global logger
export const log = createLogger();
