/** Pause footer updates outside a pre-entry margin and while the tab is hidden. */
export function startFooterTicker(
  targets: Element[],
  tick: (nearby: ReadonlySet<Element>, animate: boolean) => void,
): () => void {
  const nearby = new Set<Element>();
  let timer: number | undefined;
  const pause = (): void => {
    window.clearTimeout(timer);
    timer = undefined;
  };
  const schedule = (): void => {
    timer = window.setTimeout(
      () => {
        timer = undefined;
        if (document.hidden || nearby.size === 0) return;
        tick(nearby, true);
        schedule();
      },
      1000 - (Date.now() % 1000),
    );
  };
  const resume = (): void => {
    pause();
    if (document.hidden || nearby.size === 0) return;
    // Catch up before entering the viewport, without rolling stale digits.
    tick(nearby, false);
    schedule();
  };
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) nearby.add(entry.target);
        else nearby.delete(entry.target);
      }
      resume();
    },
    { rootMargin: '256px 0px' },
  );
  for (const target of targets) observer.observe(target);
  document.addEventListener('visibilitychange', resume);
  return () => {
    pause();
    observer.disconnect();
    document.removeEventListener('visibilitychange', resume);
  };
}
