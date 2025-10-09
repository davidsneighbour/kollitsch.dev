/**
 * @deprecated
 *
 * Deprecated shim. Use: `import { createLogger } from '@utils/logger'`
 * Maintains old API: createLogger().{debug,error,note,warn,start,stop}
 */

import { createLogger as _create, type Logger } from './logger.js';

let warned = false;
function deprecateOnce(): void {
  if (warned) return;
  warned = true;
  // Print a short, plain warning without stack noise
  const log = _create({ slug: 'logger', level: 'warn' });
  log.warn('debug.ts is deprecated. Switch to @utils/logger and createLogger().');
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
  const core: Logger = _create({ slug: 'dnb', level: (process.env.LOG_LEVEL as any) ?? 'info' });

  return {
    debug: (...a: unknown[]) => core.debug(...a),
    error: (...a: unknown[]) => core.error(...a),
    note: (...a: unknown[]) => core.info(...a),   // deprecated -> info
    warn: (...a: unknown[]) => core.warn(...a),
    start: () => core.unmute(),  // deprecated -> unmute
    stop: () => core.mute(),    // deprecated -> mute
  };
}

/** Default global logger (legacy behavior) */
export const log = createLogger();
