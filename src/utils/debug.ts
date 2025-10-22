// src/utils/debug.ts
/**
 * Deprecated shim. Use: `import { createLogger } from '@utils/logger'`
 * Maintains old API: createLogger().{debug,error,note,warn,start,stop}
 */
import { createLogger as _create, type Logger } from './logger.ts';

let warned = false;
function deprecateOnce(): void {
  if (warned) return;
  warned = true;
  const w = _create({ level: 'warn', slug: 'logger' });
  w.warn('debug.ts is deprecated. Switch to @utils/logger and createLogger().');
}

function call(
  fn: (msg: unknown, ...rest: unknown[]) => void,
  args: unknown[],
): void {
  if (args.length === 0) return; // nothing to log
  const [msg, ...rest] = args as [unknown, ...unknown[]];
  fn(msg, ...rest);
}

/**
 * Old factory: returns an object with the legacy methods.
 * - note -> info
 * - start -> unmute
 * - stop  -> mute
 */
export function createLogger(): {
  debug: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  note: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  start: () => void;
  stop: () => void;
} {
  deprecateOnce();
  const core: Logger = _create({
    level: (process.env.LOG_LEVEL as any) ?? 'info',
    slug: 'dnb',
  });

  return {
    debug: (...a: unknown[]) => call(core.debug, a),
    error: (...a: unknown[]) => call(core.error, a),
    note: (...a: unknown[]) => call(core.info, a), // deprecated -> info
    start: () => core.unmute(), // deprecated -> unmute
    stop: () => core.mute(), // deprecated -> mute
    warn: (...a: unknown[]) => call(core.warn, a),
  };
}

/** Default global logger (legacy behavior) */
export const log = createLogger();
