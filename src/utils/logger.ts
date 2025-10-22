/**
 * Astro-like CLI logger for Node and browser.
 * - Format: "HH:mm:ss [slug] message (duration)"
 * - Levels: debug, info, warn, error
 * - Per-instance mute/unmute, child() scoping
 * - Optional console interception
 * - Strict TypeScript, ESM, no dependencies
 *
 * Examples:
 *   import { createLogger } from '@utils/logger';
 *   const log = createLogger({ slug: 'build', level: process.env.LOG_LEVEL as LogLevel });
 *   log.info('Starting…');
 *   const end = log.timer('images'); // returns a function that logs duration on end()
 *   // ... work ...
 *   end('done'); // -> "... [build] done (123ms)"
 *
 *   // Replace global console temporarily
 *   import { bindConsole, restoreConsole } from '@utils/logger';
 *   bindConsole(log);
 *   console.log('hi');  // goes through logger.info
 *   restoreConsole();
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export type AnsiColor =
  | 'reset'
  | 'dim'
  | 'gray'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white';

type BrowserCssColor =
  | 'inherit'
  | 'gray'
  | 'red'
  | 'green'
  | 'goldenrod'
  | 'dodgerblue'
  | 'magenta'
  | 'teal'
  | 'white';

export interface PartColors {
  time?: AnsiColor;
  slug?: AnsiColor;
  message?: AnsiColor;
}

export interface LevelColors {
  debug?: PartColors;
  info?: PartColors;
  warn?: PartColors;
  error?: PartColors;
}

export interface LoggerOptions {
  /** Label shown as [slug] */
  slug: string;
  /** Minimum level to print; defaults to env LOG_LEVEL or 'info' */
  level?: LogLevel;
  /** Override default colors */
  colors?: LevelColors;
  /** Force no colors (useful in CI) */
  noColor?: boolean;
}

export interface Logger {
  /** Low-level logging with explicit level */
  log: (level: LogLevel, msg: unknown, ...args: unknown[]) => void;
  /** Debug level */
  debug: (msg: unknown, ...args: unknown[]) => void;
  /** Info level */
  info: (msg: unknown, ...args: unknown[]) => void;
  /** Warn level */
  warn: (msg: unknown, ...args: unknown[]) => void;
  /** Error level */
  error: (msg: unknown, ...args: unknown[]) => void;
  /** Mute further output for this instance */
  mute: () => void;
  /** Resume output for this instance */
  unmute: () => void;
  /** Create a child logger that inherits settings and overrides slug */
  child: (slug: string) => Logger;
  /**
   * Start a timer for duration logging.
   * @returns end(message?) -> logs level 'info' with "(123ms)" appended.
   */
  timer: (label?: string) => (message?: string) => void;
}

/** ANSI map for Node terminals */
const ANSI: Record<AnsiColor, string> = {
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  gray: '\x1b[90m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  white: '\x1b[37m',
  yellow: '\x1b[33m',
};

/** Browser CSS fallback for %c */
const CSS: Record<AnsiColor, BrowserCssColor> = {
  blue: 'dodgerblue',
  cyan: 'teal',
  dim: 'inherit',
  gray: 'gray',
  green: 'green',
  magenta: 'magenta',
  red: 'red',
  reset: 'inherit',
  white: 'white',
  yellow: 'goldenrod',
};

/** Default per-level colors approximating Astro vibe */
const DEFAULT_LEVEL_COLORS: Required<LevelColors> = {
  debug: { message: 'gray', slug: 'cyan', time: 'gray' },
  error: { message: 'white', slug: 'red', time: 'red' },
  info: { message: 'white', slug: 'magenta', time: 'gray' },
  warn: { message: 'white', slug: 'yellow', time: 'yellow' },
};

const ORDER: Record<LogLevel, number> = {
  debug: 10,
  error: 40,
  info: 20,
  warn: 30,
};

/** Format current time as HH:mm:ss */
function nowHHMMSS(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** Parse desired level from options or env */
function resolveLevel(opt?: LogLevel): LogLevel {
  const env = (typeof process !== 'undefined' && process.env?.LOG_LEVEL) || '';
  const val = (opt ?? env ?? 'info').toLowerCase();
  if (val === 'debug' || val === 'info' || val === 'warn' || val === 'error')
    return val;
  return 'info';
}

/** Merge default colors with overrides */
function mergeColors(overrides?: LevelColors): Required<LevelColors> {
  const base = structuredClone(DEFAULT_LEVEL_COLORS);
  if (!overrides) return base;
  for (const level of Object.keys(overrides) as (keyof LevelColors)[]) {
    const o = overrides[level];
    if (!o) continue;
    base[level] = { ...base[level], ...o };
  }
  return base;
}

/** Choose console method by level */
function pickConsole(level: LogLevel): (...data: unknown[]) => void {
  return level === 'error'
    ? console.error
    : level === 'warn'
      ? console.warn
      : level === 'debug'
        ? console.debug
        : console.log;
}

/** Colorize a segment for Node ANSI or browser %c */
function paint(
  text: string,
  color: AnsiColor,
  useAnsi: boolean,
  noColor: boolean,
): { text: string; style?: string } {
  if (noColor) return { text };
  if (useAnsi) return { text: `${ANSI[color] ?? ''}${text}${ANSI.reset}` };
  return { style: `color:${CSS[color] ?? 'inherit'}`, text };
}

/** Format duration in ms with suffix */
function fmtMs(ms: number): string {
  return `${ms | 0}ms`;
}

/**
 * Create a unified logger instance.
 * @param {LoggerOptions} options
 * @returns {Logger}
 */
export function createLogger(options: LoggerOptions): Logger {
  let muted = false;
  const minLevel = resolveLevel(options.level);
  const colors = mergeColors(options.colors);

  const isNode =
    typeof process !== 'undefined' && typeof window === 'undefined';
  const useAnsi = isNode && Boolean(process.stdout && process.stdout.isTTY);
  const noColor = Boolean(options.noColor || (isNode && process.env?.NO_COLOR));

  function should(level: LogLevel): boolean {
    if (muted) return false;
    return ORDER[level] >= ORDER[minLevel];
  }

  function emit(level: LogLevel, msg: unknown, ...args: unknown[]): void {
    try {
      if (!should(level)) return;

      const c = colors[level] ?? colors.info;
      const timeSeg = paint(nowHHMMSS(), c.time ?? 'gray', useAnsi, noColor);
      const slugSeg = paint(
        `[${options.slug}]`,
        c.slug ?? 'magenta',
        useAnsi,
        noColor,
      );

      let messageStr: string;
      if (typeof msg === 'string') messageStr = msg;
      else if (msg instanceof Error) messageStr = msg.message;
      else {
        try {
          messageStr = JSON.stringify(msg);
        } catch {
          messageStr = String(msg);
        }
      }
      const msgSeg = paint(messageStr, c.message ?? 'white', useAnsi, noColor);

      if (useAnsi) {
        pickConsole(level)(
          `${timeSeg.text} ${slugSeg.text} ${msgSeg.text}`,
          ...args,
        );
        return;
      }

      // Browser: style with %c
      const fmt = '%c%s %c%s %c%s';
      pickConsole(level)(
        fmt,
        timeSeg.style ?? '',
        timeSeg.text,
        slugSeg.style ?? '',
        slugSeg.text,
        msgSeg.style ?? '',
        msgSeg.text,
        ...args,
      );
    } catch (e) {
      console.error('Logger emit failed:', e);
    }
  }

  const api: Logger = {
    child: (slug: string): Logger => createLogger({ ...options, slug }),
    debug: (m: unknown, ...a: unknown[]) => emit('debug', m, ...a),
    error: (m: unknown, ...a: unknown[]) => emit('error', m, ...a),
    info: (m: unknown, ...a: unknown[]) => emit('info', m, ...a),
    log: emit,
    mute: () => {
      muted = true;
    },
    timer: (label?: string) => {
      const start = performance.now ? performance.now() : Date.now();
      return (message?: string) => {
        const end = performance.now ? performance.now() : Date.now();
        const dur = fmtMs(end - start);
        const suffix = label ? `${label} ` : '';
        api.info(`${suffix}${message ?? 'done'} (${dur})`);
      };
    },
    unmute: () => {
      muted = false;
    },
    warn: (m: unknown, ...a: unknown[]) => emit('warn', m, ...a),
  };

  return api;
}

/**
 * Console interception: route console.* through a logger.
 * Returns a restore function too, but it is also exported separately.
 */
type ConsoleSnapshot = {
  log: typeof console.log;
  info: typeof console.info;
  warn: typeof console.warn;
  error: typeof console.error;
  debug: typeof console.debug;
};

let CONSOLE_SNAPSHOT: ConsoleSnapshot | null = null;

/**
 * Bind global console methods to a given logger.
 * - console.log/info -> logger.info
 * - console.warn     -> logger.warn
 * - console.error    -> logger.error
 * - console.debug    -> logger.debug
 * Safe to call multiple times; uses the first snapshot for restore.
 * @param {Logger} logger
 */
export function bindConsole(logger: Logger): void {
  if (!CONSOLE_SNAPSHOT) {
    CONSOLE_SNAPSHOT = {
      debug: console.debug.bind(console),
      error: console.error.bind(console),
      info: console.info.bind(console),
      log: console.log.bind(console),
      warn: console.warn.bind(console),
    };
  }
  console.log = ((...a: unknown[]) =>
    logger.info('%o', ...a)) as typeof console.log;
  console.info = ((...a: unknown[]) =>
    logger.info('%o', ...a)) as typeof console.info;
  console.warn = ((...a: unknown[]) =>
    logger.warn('%o', ...a)) as typeof console.warn;
  console.error = ((...a: unknown[]) =>
    logger.error('%o', ...a)) as typeof console.error;
  console.debug = ((...a: unknown[]) =>
    logger.debug('%o', ...a)) as typeof console.debug;
}

/**
 * Restore the original console methods if they were intercepted.
 */
export function restoreConsole(): void {
  if (!CONSOLE_SNAPSHOT) return;
  console.log = CONSOLE_SNAPSHOT.log;
  console.info = CONSOLE_SNAPSHOT.info;
  console.warn = CONSOLE_SNAPSHOT.warn;
  console.error = CONSOLE_SNAPSHOT.error;
  console.debug = CONSOLE_SNAPSHOT.debug;
  CONSOLE_SNAPSHOT = null;
}

/**
 * Convenience helper for post references, preserved from the older logger.
 */
export function refOf(entry: { id: string; slug?: string }): string {
  return entry.slug ?? entry.id;
}

/** Alias for compatibility with prior imports that used createCliLogger name. */
export const createCliLogger = createLogger;
