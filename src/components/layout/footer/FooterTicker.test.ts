// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { startFooterTicker } from './footer-ticker';

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('footer ticker lifecycle', () => {
  it('refreshes before entry, pauses away and hidden, and cleans up', () => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    const document = Object.assign(new EventTarget(), { hidden: false });
    vi.stubGlobal('document', document);
    vi.stubGlobal('window', { clearTimeout, setTimeout });
    let notify: IntersectionObserverCallback = () => {
      // No active instance before initialisation.
    };
    const disconnect = vi.fn();
    let options: IntersectionObserverInit | undefined;
    class Observer {
      constructor(
        callback: IntersectionObserverCallback,
        init: IntersectionObserverInit,
      ) {
        notify = callback;
        options = init;
      }
      observe = vi.fn();
      disconnect = disconnect;
    }
    vi.stubGlobal('IntersectionObserver', Observer);
    const target = {} as Element;
    const tick = vi.fn();
    const cleanup = startFooterTicker([target], tick);
    const intersect = (isIntersecting: boolean): void =>
      notify(
        [{ isIntersecting, target } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    expect(options?.rootMargin).toBe('256px 0px');
    vi.advanceTimersByTime(2000);
    expect(tick).not.toHaveBeenCalled();
    intersect(true);
    expect(tick).toHaveBeenLastCalledWith(new Set([target]), false);
    vi.advanceTimersByTime(1000);
    expect(tick).toHaveBeenLastCalledWith(new Set([target]), true);
    intersect(false);
    tick.mockClear();
    vi.advanceTimersByTime(5000);
    expect(tick).not.toHaveBeenCalled();
    intersect(true);
    expect(tick).toHaveBeenLastCalledWith(new Set([target]), false);
    document.hidden = true;
    document.dispatchEvent(new Event('visibilitychange'));
    tick.mockClear();
    vi.advanceTimersByTime(5000);
    expect(tick).not.toHaveBeenCalled();
    document.hidden = false;
    document.dispatchEvent(new Event('visibilitychange'));
    expect(tick).toHaveBeenLastCalledWith(new Set([target]), false);
    cleanup();
    tick.mockClear();
    document.dispatchEvent(new Event('visibilitychange'));
    vi.advanceTimersByTime(5000);
    expect(tick).not.toHaveBeenCalled();
    expect(disconnect).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
  });
});
