// @vitest-environment node
/**
 * Lifecycle and progressive-enhancement tests for the Mesh gimmick
 * (`Mesh.astro`, `mesh-bootstrap.ts`, `mesh-renderer.ts`).
 *
 * These tests do not check particle positions, physics values, or canvas
 * output. They protect the contract that the mesh stays an optional
 * gimmick: nothing loads before the first trigger crossing, hidden or
 * backgrounded meshes do no per-frame work, and view-transition cleanup
 * leaves no listeners, observers, timers, or animation frames behind.
 * Refs #2045, #2046.
 */
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest';
import {
  MeshActivation,
  type MeshRenderer,
  type MeshRendererLoader,
  shouldShowMesh,
  startMeshLifecycle,
} from './mesh-bootstrap';
import { createMeshRenderer } from './mesh-renderer';

// ---------- Fakes ----------

/** EventTarget that counts its active listeners. */
class TrackingTarget extends EventTarget {
  private readonly active = new Set<string>();
  private readonly ids = new WeakMap<object, number>();
  private nextId = 0;

  private key(type: string, listener: unknown): string {
    if (typeof listener !== 'object' && typeof listener !== 'function') {
      return `${type}:none`;
    }
    const target = listener as object;
    let id = this.ids.get(target);
    if (id === undefined) {
      this.nextId += 1;
      id = this.nextId;
      this.ids.set(target, id);
    }
    return `${type}:${id}`;
  }

  public override addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean,
  ): void {
    if (listener) this.active.add(this.key(type, listener));
    super.addEventListener(type, listener, options);
  }

  public override removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void {
    if (listener) this.active.delete(this.key(type, listener));
    super.removeEventListener(type, listener, options);
  }

  public listenerCount(type?: string): number {
    if (!type) return this.active.size;
    return [...this.active].filter((key) => key.startsWith(`${type}:`)).length;
  }
}

class FakeMediaQueryList extends TrackingTarget {
  public readonly media: string;
  public matches: boolean;

  public constructor(media: string, matches: boolean) {
    super();
    this.media = media;
    this.matches = matches;
  }
}

class FakeIntersectionObserver {
  public static instances: FakeIntersectionObserver[] = [];
  public readonly callback: IntersectionObserverCallback;
  public observed: unknown[] = [];
  public disconnected = false;

  public constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    FakeIntersectionObserver.instances.push(this);
  }

  public observe(target: unknown): void {
    this.observed.push(target);
  }

  public disconnect(): void {
    this.disconnected = true;
  }

  /** Report the sentinel's position relative to the viewport. */
  public report(isIntersecting: boolean, top: number): void {
    const entry = {
      boundingClientRect: { top },
      isIntersecting,
    } as IntersectionObserverEntry;
    this.callback([entry], this as unknown as IntersectionObserver);
  }
}

class FakeCanvasElement {
  public width = 0;
  public height = 0;
  public readonly context: ReturnType<typeof createDrawingContext>;
  public getContextCalls = 0;

  public constructor() {
    this.context = createDrawingContext();
  }

  public getContext(): unknown {
    this.getContextCalls += 1;
    return this.context;
  }

  public getBoundingClientRect(): { width: number; height: number } {
    return { height: 400, width: 800 };
  }
}

function createDrawingContext() {
  const record = {
    arcs: [] as string[],
    clearRect: 0,
    fillStyles: [] as string[],
  };
  const noop = (): void => undefined;
  return {
    arc: (x: number, y: number): void => {
      record.arcs.push(`${x.toFixed(3)}:${y.toFixed(3)}`);
    },
    beginPath: noop,
    clearRect: (): void => {
      record.clearRect += 1;
      record.arcs = [];
    },
    fill: noop,
    set fillStyle(value: string) {
      record.fillStyles.push(value);
    },
    lineTo: noop,
    lineWidth: 0,
    moveTo: noop,
    record,
    restore: noop,
    save: noop,
    setTransform: noop,
    stroke: noop,
    strokeStyle: '',
    translate: noop,
  };
}

/** 1x1 probe canvas used by the renderer to turn a CSS colour into RGB. */
function createProbeCanvas() {
  let lastFill = '#000000';
  return {
    getContext: () => ({
      fillRect: (): void => undefined,
      set fillStyle(value: string) {
        lastFill = value;
      },
      getImageData: () => {
        const hex = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(
          lastFill,
        );
        const rgb = hex
          ? [hex[1], hex[2], hex[3]].map((part) =>
              Number.parseInt(part ?? '0', 16),
            )
          : [0, 0, 0];
        return { data: [...rgb, 255] };
      },
    }),
    height: 0,
    width: 0,
  };
}

interface FakeRoot {
  canvas: FakeCanvasElement;
  classes: Set<string>;
  element: HTMLElement;
  setConnected: (connected: boolean) => void;
}

function createRoot(): FakeRoot {
  const canvas = new FakeCanvasElement();
  const classes = new Set<string>();
  let connected = true;
  const element = {
    classList: {
      add: (name: string) => classes.add(name),
      contains: (name: string) => classes.has(name),
      remove: (name: string) => classes.delete(name),
    },
    dataset: {},
    getBoundingClientRect: () => ({ left: 0, top: 0 }),
    get isConnected() {
      return connected;
    },
    querySelector: (selector: string) =>
      selector === 'canvas' ? canvas : null,
  } as unknown as HTMLElement;
  return {
    canvas,
    classes,
    element,
    setConnected: (value) => {
      connected = value;
    },
  };
}

interface Environment {
  document: TrackingTarget & {
    hidden: boolean;
    readyState: DocumentReadyState;
  };
  window: TrackingTarget;
  queries: Map<string, FakeMediaQueryList>;
  frames: Map<number, FrameRequestCallback>;
  roots: FakeRoot[];
  theme: { colour: string };
  lenis: {
    velocity: number;
    on: ReturnType<typeof vi.fn>;
    unsubscribe: ReturnType<typeof vi.fn>;
  };
  kdev: { lenis: unknown };
  requestAnimationFrame: ReturnType<typeof vi.fn>;
  cancelAnimationFrame: ReturnType<typeof vi.fn>;
  runFrames: () => void;
}

function setupEnvironment(
  options: { reducedMotion?: boolean } = {},
): Environment {
  const queries = new Map<string, FakeMediaQueryList>();
  const frames = new Map<number, FrameRequestCallback>();
  let nextFrame = 0;
  const roots: FakeRoot[] = [];
  const theme = { colour: '#336699' };
  const trigger = { sentinel: true };

  const unsubscribe = vi.fn();
  const lenis = {
    on: vi.fn(() => unsubscribe),
    unsubscribe,
    velocity: 0,
  };
  const kdev: { lenis: unknown } = { lenis };

  const requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    nextFrame += 1;
    frames.set(nextFrame, callback);
    return nextFrame;
  });
  const cancelAnimationFrame = vi.fn((id: number) => {
    frames.delete(id);
  });

  const win = Object.assign(new TrackingTarget(), {
    cancelAnimationFrame,
    clearInterval: (id: ReturnType<typeof setInterval>) => clearInterval(id),
    clearTimeout: (id: ReturnType<typeof setTimeout>) => clearTimeout(id),
    devicePixelRatio: 1,
    kdev,
    matchMedia: (media: string) => {
      let query = queries.get(media);
      if (!query) {
        const matches =
          media === '(prefers-reduced-motion: reduce)'
            ? (options.reducedMotion ?? false)
            : media === '(pointer: fine)' || media.startsWith('(min-width');
        query = new FakeMediaQueryList(media, matches);
        queries.set(media, query);
      }
      return query;
    },
    requestAnimationFrame,
    setInterval: (handler: () => void, ms: number) => setInterval(handler, ms),
    setTimeout: (handler: () => void, ms: number) => setTimeout(handler, ms),
  });

  const doc = Object.assign(new TrackingTarget(), {
    createElement: () => createProbeCanvas(),
    documentElement: {},
    elementFromPoint: () => null,
    hidden: false,
    querySelector: (selector: string) =>
      selector === '[data-mesh-trigger]' ? trigger : null,
    querySelectorAll: (selector: string) =>
      selector === '[data-mesh]' ? roots.map((root) => root.element) : [],
    readyState: 'complete' as DocumentReadyState,
  });

  vi.stubGlobal('window', win);
  vi.stubGlobal('document', doc);
  vi.stubGlobal('HTMLCanvasElement', FakeCanvasElement);
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  vi.stubGlobal('getComputedStyle', () => ({
    getPropertyValue: () => theme.colour,
  }));

  return {
    cancelAnimationFrame,
    document: doc,
    frames,
    kdev,
    lenis,
    queries,
    requestAnimationFrame,
    roots,
    runFrames: () => {
      const pending = [...frames.entries()];
      frames.clear();
      for (const [, callback] of pending) callback(performance.now() + 16);
    },
    theme,
    window: win,
  };
}

type MockedRenderer = {
  [Key in keyof MeshRenderer]: Mock<MeshRenderer[Key]>;
};

function createFakeRenderer(): MockedRenderer {
  return {
    destroy: vi.fn<MeshRenderer['destroy']>(),
    hide: vi.fn<MeshRenderer['hide']>(),
    show: vi.fn<MeshRenderer['show']>(),
  };
}

function createLoader(renderer = createFakeRenderer()) {
  const factory = vi.fn((_root: HTMLElement) => renderer);
  const loader = vi.fn<MeshRendererLoader>(() => Promise.resolve(factory));
  return { factory, loader, renderer };
}

/** Let pending promise callbacks (the dynamic import) settle. */
async function settle(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

function lastObserver(): FakeIntersectionObserver {
  const observer = FakeIntersectionObserver.instances.at(-1);
  if (!observer) throw new Error('No IntersectionObserver was created.');
  return observer;
}

beforeEach(() => {
  FakeIntersectionObserver.instances = [];
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

// ---------- Bootstrap ----------

describe('shouldShowMesh', () => {
  it('shows only when the sentinel has scrolled above the viewport', () => {
    const rect = (top: number) => ({ top }) as DOMRectReadOnly;
    expect(
      shouldShowMesh({ boundingClientRect: rect(10), isIntersecting: true }),
    ).toBe(false);
    expect(
      shouldShowMesh({ boundingClientRect: rect(-1), isIntersecting: false }),
    ).toBe(true);
    expect(
      shouldShowMesh({ boundingClientRect: rect(900), isIntersecting: false }),
    ).toBe(false);
  });
});

describe('Mesh bootstrap', () => {
  it('observes the sentinel without loading the renderer before first activation', () => {
    const env = setupEnvironment();
    env.roots.push(createRoot());
    const { loader } = createLoader();

    const stop = startMeshLifecycle(loader);

    expect(FakeIntersectionObserver.instances).toHaveLength(1);
    expect(loader).not.toHaveBeenCalled();
    // No renderer listeners exist yet: only the lifecycle listeners.
    expect(env.window.listenerCount()).toBe(0);
    expect(env.document.listenerCount('visibilitychange')).toBe(0);
    expect(env.document.listenerCount('theme-changed')).toBe(0);
    stop();
  });

  it('stays inactive while the sentinel is visible or below the viewport', async () => {
    setupEnvironment();
    const root = createRoot();
    const { loader } = createLoader();
    const activation = new MeshActivation(root.element, {} as Element, loader);
    activation.mount();

    lastObserver().report(true, 40);
    lastObserver().report(false, 900);
    await settle();

    expect(loader).not.toHaveBeenCalled();
    activation.destroy();
  });

  it('activates once the sentinel crosses above the viewport, then hides on return', async () => {
    setupEnvironment();
    const root = createRoot();
    const { factory, loader, renderer } = createLoader();
    const activation = new MeshActivation(root.element, {} as Element, loader);
    activation.mount();

    lastObserver().report(false, -10);
    await settle();
    expect(loader).toHaveBeenCalledTimes(1);
    expect(factory).toHaveBeenCalledWith(root.element);
    expect(renderer.show).toHaveBeenCalledTimes(1);

    lastObserver().report(true, 20);
    expect(renderer.hide).toHaveBeenCalledTimes(1);
    activation.destroy();
  });

  it('creates the renderer only once and reuses it across hide/show cycles', async () => {
    setupEnvironment();
    const { factory, loader, renderer } = createLoader();
    const activation = new MeshActivation(
      createRoot().element,
      {} as Element,
      loader,
    );
    activation.mount();
    const observer = lastObserver();

    observer.report(false, -10);
    await settle();
    observer.report(true, 20);
    observer.report(false, -10);
    observer.report(true, 20);
    observer.report(false, -10);
    await settle();

    expect(loader).toHaveBeenCalledTimes(1);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(renderer.show).toHaveBeenCalledTimes(3);
    expect(renderer.hide).toHaveBeenCalledTimes(2);
    activation.destroy();
  });

  it('does not show a renderer that finished loading after the user scrolled back up', async () => {
    setupEnvironment();
    const { factory, loader, renderer } = createLoader();
    const activation = new MeshActivation(
      createRoot().element,
      {} as Element,
      loader,
    );
    activation.mount();

    lastObserver().report(false, -10);
    lastObserver().report(true, 20);
    await settle();

    expect(factory).toHaveBeenCalledTimes(1);
    expect(renderer.show).not.toHaveBeenCalled();
    activation.destroy();
  });

  it('never creates a renderer when destroyed while the module is still loading', async () => {
    setupEnvironment();
    const { factory, loader } = createLoader();
    const activation = new MeshActivation(
      createRoot().element,
      {} as Element,
      loader,
    );
    activation.mount();

    lastObserver().report(false, -10);
    activation.destroy();
    await settle();

    expect(loader).toHaveBeenCalledTimes(1);
    expect(factory).not.toHaveBeenCalled();
  });

  it('keeps the page working when the renderer fails to load, and retries on the next crossing', async () => {
    setupEnvironment();
    const error = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const { factory } = createLoader();
    const loader = vi
      .fn<MeshRendererLoader>()
      .mockRejectedValueOnce(new Error('offline'))
      .mockResolvedValue(factory);
    const activation = new MeshActivation(
      createRoot().element,
      {} as Element,
      loader,
    );
    activation.mount();

    lastObserver().report(false, -10);
    await settle();
    expect(error).toHaveBeenCalledTimes(1);
    expect(factory).not.toHaveBeenCalled();

    lastObserver().report(true, 20);
    lastObserver().report(false, -10);
    await settle();
    expect(loader).toHaveBeenCalledTimes(2);
    expect(factory).toHaveBeenCalledTimes(1);
    activation.destroy();
  });

  it('destroys the renderer and disconnects the observer on astro:before-swap', async () => {
    const env = setupEnvironment();
    env.roots.push(createRoot());
    const { loader, renderer } = createLoader();
    const stop = startMeshLifecycle(loader);
    const observer = lastObserver();

    observer.report(false, -10);
    await settle();
    env.document.dispatchEvent(new Event('astro:before-swap'));

    expect(observer.disconnected).toBe(true);
    expect(renderer.destroy).toHaveBeenCalledTimes(1);

    // A late observer callback after the swap must not revive anything.
    observer.report(false, -10);
    await settle();
    expect(renderer.show).toHaveBeenCalledTimes(1);
    stop();
  });

  it('reinitialises after astro:page-load without duplicate observers', async () => {
    const env = setupEnvironment();
    const first = createRoot();
    env.roots.push(first);
    const { loader } = createLoader();
    const stop = startMeshLifecycle(loader);

    // Astro fires astro:page-load on the initial load too.
    env.document.dispatchEvent(new Event('astro:page-load'));
    expect(FakeIntersectionObserver.instances).toHaveLength(1);

    // View transition: old body swapped out, new root rendered.
    env.document.dispatchEvent(new Event('astro:before-swap'));
    first.setConnected(false);
    env.roots.splice(0, env.roots.length, createRoot());
    env.document.dispatchEvent(new Event('astro:page-load'));
    env.document.dispatchEvent(new Event('astro:page-load'));

    const live = FakeIntersectionObserver.instances.filter(
      (observer) => !observer.disconnected,
    );
    expect(live).toHaveLength(1);
    expect(loader).not.toHaveBeenCalled();

    stop();
    expect(
      FakeIntersectionObserver.instances.every(
        (observer) => observer.disconnected,
      ),
    ).toBe(true);
  });
});

// ---------- Renderer ----------

describe('Mesh renderer', () => {
  it('creates the canvas context once and reuses the particle field across hide/show', () => {
    const env = setupEnvironment({ reducedMotion: true });
    const root = createRoot();
    const renderer = createMeshRenderer(root.element);

    expect(root.canvas.getContextCalls).toBe(0);

    renderer.show();
    const firstField = [...root.canvas.context.record.arcs];
    renderer.hide();
    renderer.show();

    expect(root.canvas.getContextCalls).toBe(1);
    expect(firstField.length).toBeGreaterThan(0);
    expect(root.canvas.context.record.arcs).toEqual(firstField);
    expect(root.classes.has('is-visible')).toBe(true);
    renderer.destroy();
    expect(env.frames.size).toBe(0);
  });

  it('runs the animation loop while shown and stops it when hidden', () => {
    const env = setupEnvironment();
    const root = createRoot();
    const renderer = createMeshRenderer(root.element);

    renderer.show();
    expect(env.frames.size).toBe(1);
    env.runFrames();
    expect(env.frames.size).toBe(1);

    renderer.hide();
    expect(env.frames.size).toBe(0);
    expect(root.classes.has('is-visible')).toBe(false);

    env.runFrames();
    expect(env.requestAnimationFrame).toHaveBeenCalledTimes(2);
    renderer.destroy();
  });

  it('pauses while the document is hidden and resumes only when the mesh is shown', () => {
    const env = setupEnvironment();
    const renderer = createMeshRenderer(createRoot().element);

    renderer.show();
    env.document.hidden = true;
    env.document.dispatchEvent(new Event('visibilitychange'));
    expect(env.frames.size).toBe(0);

    env.document.hidden = false;
    env.document.dispatchEvent(new Event('visibilitychange'));
    expect(env.frames.size).toBe(1);

    renderer.hide();
    env.document.hidden = true;
    env.document.dispatchEvent(new Event('visibilitychange'));
    env.document.hidden = false;
    env.document.dispatchEvent(new Event('visibilitychange'));
    expect(env.frames.size).toBe(0);
    renderer.destroy();
  });

  it('draws a static frame and never starts a loop under prefers-reduced-motion', () => {
    const env = setupEnvironment({ reducedMotion: true });
    const root = createRoot();
    const renderer = createMeshRenderer(root.element);

    renderer.show();

    expect(env.requestAnimationFrame).not.toHaveBeenCalled();
    expect(root.canvas.context.record.clearRect).toBeGreaterThan(0);
    renderer.destroy();
  });

  it('redraws in the new colour after a theme change', () => {
    const env = setupEnvironment({ reducedMotion: true });
    const root = createRoot();
    const renderer = createMeshRenderer(root.element);

    renderer.show();
    const drawsBefore = root.canvas.context.record.clearRect;
    env.theme.colour = '#ff0000';
    env.document.dispatchEvent(new Event('theme-changed'));

    expect(root.canvas.context.record.clearRect).toBe(drawsBefore + 1);
    expect(
      root.canvas.context.record.fillStyles.some((style) =>
        style.startsWith('rgba(255,0,0,'),
      ),
    ).toBe(true);
    renderer.destroy();
  });

  it('removes every listener, frame, timer, and subscription on destroy', () => {
    vi.useFakeTimers();
    const env = setupEnvironment();
    env.kdev.lenis = undefined;
    const renderer = createMeshRenderer(createRoot().element);

    expect(env.window.listenerCount()).toBeGreaterThan(0);
    expect(env.document.listenerCount()).toBeGreaterThan(0);

    renderer.show();
    renderer.destroy();

    expect(env.frames.size).toBe(0);
    expect(env.window.listenerCount()).toBe(0);
    expect(env.document.listenerCount()).toBe(0);
    for (const query of env.queries.values()) {
      expect(query.listenerCount()).toBe(0);
    }

    // Lenis arriving after destroy must not be subscribed by a stale poll.
    env.kdev.lenis = env.lenis;
    vi.advanceTimersByTime(10_000);
    expect(env.lenis.on).not.toHaveBeenCalled();
  });

  it('unsubscribes from Lenis on destroy', () => {
    const env = setupEnvironment();
    const renderer = createMeshRenderer(createRoot().element);

    renderer.show();
    expect(env.lenis.on).toHaveBeenCalledTimes(1);
    renderer.destroy();
    expect(env.lenis.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
