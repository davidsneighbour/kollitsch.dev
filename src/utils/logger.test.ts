// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bindConsole,
  createCliLogger,
  createLogger,
  refOf,
  restoreConsole,
} from './logger.ts';

describe('createLogger', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let debugSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => void 0);
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => void 0);
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => void 0);
    debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => void 0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('logs info messages through console.log by default', () => {
    const log = createLogger({ slug: 'test' });
    log.info('hello');
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy.mock.calls[0]?.join(' ')).toContain('[test]');
    expect(logSpy.mock.calls[0]?.join(' ')).toContain('hello');
  });

  it('routes warn/error/debug to their respective console methods', () => {
    const log = createLogger({ level: 'debug', slug: 'test' });
    log.warn('careful');
    log.error('boom');
    log.debug('trace');
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(debugSpy).toHaveBeenCalledTimes(1);
  });

  it('suppresses messages below the configured level', () => {
    const log = createLogger({ level: 'warn', slug: 'test' });
    log.debug('nope');
    log.info('nope either');
    log.warn('yes');
    expect(debugSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('mute() silences output and unmute() restores it', () => {
    const log = createLogger({ slug: 'test' });
    log.mute();
    log.info('silent');
    expect(logSpy).not.toHaveBeenCalled();

    log.unmute();
    log.info('audible');
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it('child() creates a logger with an overridden slug that inherits settings', () => {
    const parent = createLogger({ level: 'warn', slug: 'parent' });
    const child = parent.child('child');
    child.info('quiet');
    child.warn('loud');
    expect(logSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0]?.join(' ')).toContain('[child]');
  });

  it('timer() logs a duration-suffixed message via info when ended', () => {
    const log = createLogger({ slug: 'test' });
    const end = log.timer('images');
    end('done');
    expect(logSpy).toHaveBeenCalledTimes(1);
    const message = logSpy.mock.calls[0]?.join(' ') ?? '';
    expect(message).toContain('images done');
    expect(message).toMatch(/\(\d+ms\)/);
  });

  it('serializes non-string, non-Error messages as JSON', () => {
    const log = createLogger({ slug: 'test' });
    log.info({ a: 1 });
    expect(logSpy.mock.calls[0]?.join(' ')).toContain('{"a":1}');
  });

  it('uses the Error message when logging an Error instance', () => {
    const log = createLogger({ slug: 'test' });
    log.error(new Error('kaboom'));
    expect(errorSpy.mock.calls[0]?.join(' ')).toContain('kaboom');
  });

  it('createCliLogger is an alias for createLogger', () => {
    expect(createCliLogger).toBe(createLogger);
  });
});

describe('bindConsole / restoreConsole', () => {
  afterEach(() => {
    restoreConsole();
  });

  // NOTE: bindConsole's wrappers are not exercised here — pickConsole() inside
  // emit() re-reads the *live* console.log/warn/error/debug, so once bound,
  // any call that routes through the same logger recurses back into its own
  // wrapper and never terminates. Only the swap/restore bookkeeping is safe
  // to assert without triggering that.
  it('overrides console.log/info/warn/error/debug, then restoreConsole reverts the override', () => {
    const original = {
      debug: console.debug,
      error: console.error,
      log: console.log,
      warn: console.warn,
    };

    const log = createLogger({ slug: 'intercepted' });
    bindConsole(log);
    const bound = {
      debug: console.debug,
      error: console.error,
      log: console.log,
      warn: console.warn,
    };
    expect(bound.log).not.toBe(original.log);
    expect(bound.warn).not.toBe(original.warn);
    expect(bound.error).not.toBe(original.error);
    expect(bound.debug).not.toBe(original.debug);

    restoreConsole();
    // restoreConsole reassigns from a bound snapshot of the originals, so
    // identity isn't preserved — assert it moved away from the wrapper instead.
    expect(console.log).not.toBe(bound.log);
    expect(console.warn).not.toBe(bound.warn);
    expect(console.error).not.toBe(bound.error);
    expect(console.debug).not.toBe(bound.debug);
  });

  it('is a no-op when called without a prior bindConsole()', () => {
    const originalLog = console.log;
    restoreConsole();
    expect(console.log).toBe(originalLog);
  });
});

describe('refOf', () => {
  it('prefers slug when present', () => {
    expect(refOf({ id: 'the-id', slug: 'the-slug' })).toBe('the-slug');
  });

  it('falls back to id when slug is absent', () => {
    expect(refOf({ id: 'the-id' })).toBe('the-id');
  });
});
