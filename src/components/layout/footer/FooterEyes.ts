/** Bound pupil travel to an ellipse, in the portrait's 400-pixel coordinates. */
export function pupilOffset(dx: number, dy: number): { x: number; y: number } {
  const divisor = Math.max(1, Math.hypot(dx / 8, dy / 4.5));
  return { x: dx / divisor, y: dy / divisor };
}

/** Enhance the existing link without changing its keyboard or touch behaviour. */
export function initFooterEyes(): () => void {
  const portrait = document.querySelector<HTMLElement>('[data-footer-eyes]');
  if (!portrait)
    return () => {
      /* No portrait to clean up. */
    };
  const pupils = [
    ...portrait.querySelectorAll<HTMLElement>('[data-footer-pupil]'),
  ];
  const controller = new AbortController();
  const { signal } = controller;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let point: { x: number; y: number } | null = null;
  let visible = false;
  let frame = 0;
  const render = (): void => {
    frame = 0;
    const active = visible && !motion.matches && !document.hidden;
    portrait.toggleAttribute('data-eyes-active', active);
    const box = portrait.getBoundingClientRect();
    if (!box.width) return;
    const scale = box.width / 400;
    for (const pupil of pupils) {
      const x = Number(pupil.dataset['x']);
      const y = Number(pupil.dataset['y']);
      const offset =
        active && point
          ? pupilOffset(
              (point.x - box.left) / scale - x,
              (point.y - box.top) / scale - y,
            )
          : { x: 0, y: 0 };
      pupil.style.transform = `translate(-50%, -50%) translate(${offset.x * scale}px, ${offset.y * scale}px)`;
    }
  };
  const schedule = (): void => {
    if (!frame) frame = requestAnimationFrame(render);
  };
  const reset = (): void => {
    point = null;
    schedule();
  };
  const track = (event: PointerEvent): void => {
    if (
      !visible ||
      motion.matches ||
      (event.pointerType === 'touch' && !event.buttons)
    )
      return;
    point = { x: event.clientX, y: event.clientY };
    schedule();
  };
  document.addEventListener('pointermove', track, { passive: true, signal });
  document.addEventListener('pointerdown', track, { passive: true, signal });
  document.addEventListener(
    'pointerup',
    (event) => {
      if (event.pointerType !== 'mouse') reset();
    },
    { signal },
  );
  document.addEventListener('pointercancel', reset, { signal });
  document.documentElement.addEventListener('pointerleave', reset, { signal });
  window.addEventListener('blur', reset, { signal });
  window.addEventListener('scroll', schedule, {
    capture: true,
    passive: true,
    signal,
  });
  document.addEventListener('visibilitychange', reset, { signal });
  motion.addEventListener('change', reset, { signal });
  const resize = new ResizeObserver(schedule);
  resize.observe(portrait);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    reset();
  });
  intersection.observe(portrait);
  return () => {
    controller.abort();
    resize.disconnect();
    intersection.disconnect();
    cancelAnimationFrame(frame);
    portrait.removeAttribute('data-eyes-active');
  };
}
