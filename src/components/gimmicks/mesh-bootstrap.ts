/**
 * Minimal, always-loaded part of the Mesh gimmick.
 *
 * Before the activation sentinel (`[data-mesh-trigger]`) scrolls above the
 * viewport for the first time, this module does one thing: it observes
 * the sentinel. It creates no canvas context, no particle state, no
 * animation loop, and no renderer listeners, and it does not load the
 * renderer module. The first crossing loads the renderer with a dynamic
 * `import()`; every later crossing reuses the same renderer instance.
 *
 * See `documentation/components/gimmicks/mesh.md` and the gimmick rules in
 * `.agents/instructions/src-gimmicks.instructions.md`.
 */

/** What the bootstrap needs from a loaded renderer. */
export interface MeshRenderer {
  /** Fade the mesh in and start (or resume) rendering. */
  show(): void;
  /** Fade the mesh out and stop all per-frame work. */
  hide(): void;
  /** Remove every listener, observer, timer, and animation frame. */
  destroy(): void;
}

export type MeshRendererFactory = (root: HTMLElement) => MeshRenderer;

/** Loads the renderer module. Called at most once per successful load. */
export type MeshRendererLoader = () => Promise<MeshRendererFactory>;

export const MESH_ROOT_SELECTOR = '[data-mesh]';
export const MESH_TRIGGER_SELECTOR = '[data-mesh-trigger]';

/**
 * Whether the mesh should show for an observer entry: only when the
 * sentinel is not intersecting and its top edge is above the viewport (the
 * hero has scrolled away). A sentinel below the viewport hides it too.
 */
export function shouldShowMesh(
  entry: Pick<
    IntersectionObserverEntry,
    'isIntersecting' | 'boundingClientRect'
  >,
): boolean {
  return !entry.isIntersecting && entry.boundingClientRect.top < 0;
}

export class MeshActivation {
  private readonly root: HTMLElement;
  private readonly trigger: Element;
  private readonly loadRenderer: MeshRendererLoader;
  private observer: IntersectionObserver | null = null;
  private renderer: MeshRenderer | null = null;
  private loading: Promise<void> | null = null;
  private wantVisible = false;
  private destroyed = false;

  public constructor(
    root: HTMLElement,
    trigger: Element,
    loadRenderer: MeshRendererLoader,
  ) {
    this.root = root;
    this.trigger = trigger;
    this.loadRenderer = loadRenderer;
  }

  public mount(): void {
    if (this.observer || this.destroyed) return;
    this.observer = new IntersectionObserver(this.handleTrigger, {
      threshold: 0,
    });
    this.observer.observe(this.trigger);
  }

  public destroy(): void {
    this.destroyed = true;
    this.wantVisible = false;
    this.observer?.disconnect();
    this.observer = null;
    this.renderer?.destroy();
    this.renderer = null;
  }

  private readonly handleTrigger = (
    entries: IntersectionObserverEntry[],
  ): void => {
    const entry = entries.at(-1);
    if (!entry) return;
    this.setVisible(shouldShowMesh(entry));
  };

  private setVisible(visible: boolean): void {
    if (this.destroyed) return;
    this.wantVisible = visible;

    if (this.renderer) {
      if (visible) this.renderer.show();
      else this.renderer.hide();
      return;
    }

    if (visible) this.activate();
  }

  private activate(): void {
    if (this.loading) return;

    this.loading = this.loadRenderer()
      .then((createRenderer) => {
        if (this.destroyed) return;
        this.renderer = createRenderer(this.root);
        if (this.wantVisible) this.renderer.show();
      })
      .catch((error: unknown) => {
        // A gimmick failure must never affect the page. The mesh stays
        // hidden; the next crossing tries again.
        this.loading = null;
        console.error('Failed to load the Mesh renderer.', error);
      });
  }
}

const activations = new Map<HTMLElement, MeshActivation>();

/**
 * Create one activation per `[data-mesh]` root. Roots that already have an
 * activation keep it, so a repeated call (initial load plus
 * `astro:page-load`) never creates duplicate observers. Activations for
 * roots that left the document are destroyed.
 */
export function initialiseMeshes(loadRenderer: MeshRendererLoader): void {
  for (const [root, activation] of activations) {
    if (!root.isConnected) {
      activation.destroy();
      activations.delete(root);
    }
  }

  const trigger = document.querySelector(MESH_TRIGGER_SELECTOR);
  if (!trigger) return;

  for (const root of document.querySelectorAll<HTMLElement>(
    MESH_ROOT_SELECTOR,
  )) {
    if (activations.has(root)) continue;
    const activation = new MeshActivation(root, trigger, loadRenderer);
    activation.mount();
    activations.set(root, activation);
  }
}

/** Destroy every activation and its renderer (before a view transition swap). */
export function destroyMeshes(): void {
  for (const activation of activations.values()) activation.destroy();
  activations.clear();
}

/**
 * Wire the Astro view-transition lifecycle and initialise the current page.
 * Returns a function that removes the lifecycle listeners and destroys all
 * activations (used by tests).
 */
export function startMeshLifecycle(
  loadRenderer: MeshRendererLoader,
): () => void {
  const initialise = (): void => initialiseMeshes(loadRenderer);

  document.addEventListener('astro:before-swap', destroyMeshes);
  document.addEventListener('astro:page-load', initialise);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true });
  } else {
    initialise();
  }

  return () => {
    document.removeEventListener('astro:before-swap', destroyMeshes);
    document.removeEventListener('astro:page-load', initialise);
    document.removeEventListener('DOMContentLoaded', initialise);
    destroyMeshes();
  };
}
