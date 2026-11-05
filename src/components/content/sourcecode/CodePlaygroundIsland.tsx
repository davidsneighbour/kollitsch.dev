/**
 * Interactive shell of the code playground.
 *
 * Server-rendered and hydrated with `client:visible`. It owns the example's
 * files and control state, renders the sandboxed preview and the controls,
 * and loads the Sandpack editor (`PlaygroundEditor.tsx`) only after the reader
 * asks for it.
 */
import { Button } from '@components/shared/elements/button.tsx';
import {
  applyControlChange,
  buildPreviewDocument,
  decodeSettings,
  encodeSettings,
  HOST_MESSAGE_SOURCE,
  type PlaygroundDescriptor,
  type PlaygroundState,
  type PlaygroundValue,
  parseStateText,
  readHashParams,
  readPreviewMessage,
  serialiseState,
  updateHash,
} from '@utils/code-playground.pure.ts';
import { cn } from '@utils/shadcn-utils';
import {
  type ComponentType,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { PlaygroundControls } from './PlaygroundControls.tsx';
import type { PlaygroundEditorProps } from './PlaygroundEditor.tsx';

export interface CodePlaygroundIslandProps {
  descriptor: PlaygroundDescriptor;
  /** Static source fallback rendered by Astro; hidden while editing. */
  children?: ReactNode;
}

type ViewMode = 'split' | 'code' | 'preview';

interface PlaygroundModel {
  files: Record<string, string>;
  /** Last state that passed validation; drives controls and the preview. */
  validState: PlaygroundState;
  validStateText: string;
  stateError: string | null;
  /**
   * Increases on every change that starts outside the editor (controls and
   * resets). The editor copies host files into Sandpack only when it changes,
   * so its own edits are never echoed back while the reader types.
   */
  externalRevision: number;
}

type PlaygroundAction =
  | { type: 'file'; path: string; code: string }
  | { type: 'control'; id: string; value: PlaygroundValue }
  | { type: 'reset-file'; path: string }
  | { type: 'reset-all' }
  | { type: 'apply-state'; state: PlaygroundState };

const VIEW_MODES: ReadonlyArray<{ mode: ViewMode; label: string }> = [
  { label: 'Split', mode: 'split' },
  { label: 'Code', mode: 'code' },
  { label: 'Preview', mode: 'preview' },
];

const SPLIT_MIN = 25;
const SPLIT_MAX = 75;
const SPLIT_DEFAULT = 50;
const PREVIEW_DEBOUNCE_MS = 200;
const URL_DEBOUNCE_MS = 400;

function initialModel(descriptor: PlaygroundDescriptor): PlaygroundModel {
  const files = Object.fromEntries(
    descriptor.files.map((file) => [file.path, file.code]),
  );
  const stateText = files[descriptor.stateFile] ?? '{}';
  const parsed = parseStateText(descriptor.controls, stateText);
  return {
    externalRevision: 0,
    files,
    stateError: parsed.ok ? null : parsed.error,
    validState: parsed.ok ? parsed.value : {},
    validStateText: stateText,
  };
}

function createReducer(descriptor: PlaygroundDescriptor) {
  const authored = initialModel(descriptor);

  const withFile = (
    model: PlaygroundModel,
    path: string,
    code: string,
  ): PlaygroundModel => {
    if (model.files[path] === code) return model;
    const files = { ...model.files, [path]: code };
    if (path !== descriptor.stateFile) return { ...model, files };
    const parsed = parseStateText(descriptor.controls, code);
    return parsed.ok
      ? {
          ...model,
          files,
          stateError: null,
          validState: parsed.value,
          validStateText: code,
        }
      : { ...model, files, stateError: parsed.error };
  };

  const external = (model: PlaygroundModel): PlaygroundModel => ({
    ...model,
    externalRevision: model.externalRevision + 1,
  });

  return (
    model: PlaygroundModel,
    action: PlaygroundAction,
  ): PlaygroundModel => {
    switch (action.type) {
      case 'file':
        return withFile(model, action.path, action.code);
      case 'control': {
        if (model.stateError) return model;
        const next = applyControlChange(
          descriptor.controls,
          model.validState,
          action.id,
          action.value,
        );
        if (!next.ok) return model;
        return external(
          withFile(model, descriptor.stateFile, serialiseState(next.value)),
        );
      }
      case 'reset-file':
        return external(
          withFile(model, action.path, authored.files[action.path] ?? ''),
        );
      case 'reset-all':
        return { ...authored, externalRevision: model.externalRevision + 1 };
      case 'apply-state':
        if (model.stateError) return model;
        return external(
          withFile(model, descriptor.stateFile, serialiseState(action.state)),
        );
    }
  };
}

function useLatest<T>(value: T): { readonly current: T } {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

interface RuntimeStatus {
  kind: 'loading' | 'ready' | 'error';
  errors: string[];
  missing: string[];
}

export default function CodePlaygroundIsland({
  descriptor,
  children,
}: CodePlaygroundIslandProps): ReactElement {
  const reducer = useMemo(() => createReducer(descriptor), [descriptor]);
  const [model, dispatch] = useReducer(reducer, descriptor, initialModel);
  const [hydrated, setHydrated] = useState(false);
  const [parentOrigin, setParentOrigin] = useState<string | null>(null);
  const [preview, setPreview] = useState(() => ({
    files: model.files,
    revision: 0,
  }));
  const [runtime, setRuntime] = useState<RuntimeStatus>({
    errors: [],
    kind: 'loading',
    missing: [],
  });
  const [announcement, setAnnouncement] = useState('');
  const [editor, setEditor] =
    useState<ComponentType<PlaygroundEditorProps> | null>(null);
  const [editorState, setEditorState] = useState<
    'closed' | 'loading' | 'ready' | 'failed'
  >('closed');
  const [view, setView] = useState<ViewMode>('split');
  const [split, setSplit] = useState(SPLIT_DEFAULT);
  const [confirmReset, setConfirmReset] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const defaults = useMemo(
    () => initialModel(descriptor).validState,
    [descriptor],
  );

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const panesRef = useRef<HTMLDivElement>(null);
  const codePaneRef = useRef<HTMLDivElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const discardButtonRef = useRef<HTMLButtonElement>(null);
  const visibleRef = useRef(true);
  const revisionRef = useLatest(preview.revision);
  const filesRef = useLatest(model.files);

  const idPrefix = descriptor.anchorId;
  const codePaneId = `${idPrefix}-code`;
  const statusId = `${idPrefix}-status`;
  const editorActive = editorState !== 'closed';

  // The bridge needs the host origin, which is only known in the browser.
  // Settings recorded in the URL hash are applied once, after hydration, so
  // the server-rendered markup and the first client render stay identical.
  // Runs once on mount.
  useEffect(() => {
    setHydrated(true);
    setParentOrigin(window.location.origin);
    const params = readHashParams(window.location.hash);
    if (!params) return;
    const state = decodeSettings(
      descriptor.exampleId,
      descriptor.controls,
      defaults,
      params,
    );
    if (state) {
      dispatch({ state, type: 'apply-state' });
      setAnnouncement(
        `Settings from the link were applied to ${descriptor.title}.`,
      );
    }
  }, []);

  // Record non-default settings in the URL hash. Debounced, because browsers
  // limit how often history entries may be replaced.
  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(() => {
      const hash = updateHash(
        window.location.hash,
        descriptor.exampleId,
        encodeSettings(
          descriptor.exampleId,
          descriptor.controls,
          defaults,
          model.validState,
        ),
      );
      if (hash === window.location.hash) return;
      const url = `${window.location.pathname}${window.location.search}${hash}`;
      window.history.replaceState(window.history.state, '', url);
    }, URL_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [hydrated, model.validState, defaults, descriptor]);

  const copyLink = useCallback(async () => {
    const { origin, pathname, search, hash } = window.location;
    const fragment = readHashParams(hash) ? hash : `#${descriptor.anchorId}`;
    try {
      await navigator.clipboard.writeText(
        `${origin}${pathname}${search}${fragment}`,
      );
      setAnnouncement('Link copied. It includes the settings you changed.');
      setLinkCopied(true);
    } catch {
      setAnnouncement('Could not copy the link. Copy it from the address bar.');
    }
  }, [descriptor.anchorId]);
  useEffect(() => {
    if (!linkCopied) return;
    const timer = window.setTimeout(() => setLinkCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [linkCopied]);

  // Rebuild the preview after edits settle. The first run after hydration
  // enables the bridge immediately.
  useEffect(() => {
    if (!parentOrigin) return;
    const files = {
      ...model.files,
      [descriptor.stateFile]: model.validStateText,
    };
    const delay = preview.revision === 0 ? 0 : PREVIEW_DEBOUNCE_MS;
    const timer = window.setTimeout(() => {
      setPreview((current) => ({ files, revision: current.revision + 1 }));
    }, delay);
    return () => window.clearTimeout(timer);
    // `preview.revision` is read once to pick the delay; it is not a trigger.
  }, [model.files, model.validStateText, parentOrigin, descriptor.stateFile]);

  const srcDoc = useMemo(
    () =>
      buildPreviewDocument({
        entry: descriptor.entry,
        files: preview.files,
        hooks: descriptor.hooks,
        instanceId: descriptor.instanceId,
        parentOrigin: preview.revision === 0 ? null : parentOrigin,
        revision: preview.revision,
      }),
    [descriptor, preview, parentOrigin],
  );

  const postVisibility = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        instance: descriptor.instanceId,
        kind: 'visibility',
        source: HOST_MESSAGE_SOURCE,
        visible: visibleRef.current,
      },
      '*',
    );
  }, [descriptor.instanceId]);

  // Messages from the preview: same iframe window, opaque origin, schema,
  // instance, and current revision only.
  useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      const frame = iframeRef.current?.contentWindow;
      if (!frame || event.source !== frame || event.origin !== 'null') return;
      const message = readPreviewMessage(
        event.data,
        descriptor.instanceId,
        revisionRef.current,
      );
      if (!message) return;
      if (message.kind === 'error') {
        setRuntime((current) => ({
          errors: [...current.errors, message.message].slice(-5),
          kind: 'error',
          missing: current.missing,
        }));
      } else {
        postVisibility();
        setRuntime((current) => ({
          errors: current.kind === 'error' ? current.errors : [],
          kind: current.kind === 'error' ? 'error' : 'ready',
          missing: message.missing,
        }));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [descriptor.instanceId, postVisibility, revisionRef]);

  // Clear errors from earlier revisions when a new preview starts loading.
  useEffect(() => {
    if (preview.revision > 0) {
      setRuntime({ errors: [], kind: 'loading', missing: [] });
    }
  }, [preview.revision]);

  // Pause preview animations while the preview is scrolled out of view.
  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      visibleRef.current = entry?.isIntersecting ?? true;
      postVisibility();
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [postVisibility]);

  // Announce meaningful status changes only, never every rebuild.
  const runtimeSummary =
    runtime.kind === 'error'
      ? `Preview error: ${runtime.errors[runtime.errors.length - 1] ?? 'unknown error'}`
      : runtime.missing.length > 0
        ? `The preview has no element matching ${runtime.missing.join(', ')}, so some controls may have no effect.`
        : '';
  useEffect(() => {
    if (runtimeSummary) setAnnouncement(runtimeSummary);
  }, [runtimeSummary]);
  useEffect(() => {
    if (model.stateError) {
      setAnnouncement(
        `${descriptor.stateFile.slice(1)} has an error. Controls are paused.`,
      );
    }
  }, [model.stateError, descriptor.stateFile]);

  const loadEditor = useCallback(async () => {
    setEditorState('loading');
    setAnnouncement('Loading the editor.');
    try {
      const module = await import('./PlaygroundEditor.tsx');
      setEditor(() => module.default);
      setEditorState('ready');
      setAnnouncement('Editor ready.');
    } catch {
      setEditorState('failed');
      setAnnouncement('The editor could not be loaded.');
    }
  }, []);

  // Move focus into the editor region once it has loaded.
  useEffect(() => {
    if (editorState === 'ready') codePaneRef.current?.focus();
  }, [editorState]);

  useEffect(() => {
    if (confirmReset) discardButtonRef.current?.focus();
  }, [confirmReset]);

  const changedFiles = descriptor.files
    .filter((file) => model.files[file.path] !== file.code)
    .map((file) => file.path.slice(1));

  const onFileChange = useCallback(
    (path: string, code: string) => dispatch({ code, path, type: 'file' }),
    [],
  );
  const onResetFile = useCallback(
    (path: string) => dispatch({ path, type: 'reset-file' }),
    [],
  );

  // Divider: pointer dragging and keyboard resizing between the panes.
  const setSplitFromPointer = (clientX: number): void => {
    const rect = panesRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const percent = ((clientX - rect.left) / rect.width) * 100;
    setSplit(Math.round(Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, percent))));
  };
  const onDividerPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onDividerPointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      setSplitFromPointer(event.clientX);
    }
  };
  const onDividerKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    const step = event.shiftKey ? 10 : 5;
    const keys: Record<string, number> = {
      ArrowLeft: split - step,
      ArrowRight: split + step,
      End: SPLIT_MAX,
      Enter: SPLIT_DEFAULT,
      Home: SPLIT_MIN,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setSplit(Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, next)));
  };

  const Editor = editor;
  const showCode = editorActive && view !== 'preview';
  const showPreview = !editorActive || view !== 'code';
  const showDivider = editorActive && view === 'split';

  const statusText =
    model.stateError !== null
      ? 'State file has an error'
      : runtime.kind === 'error'
        ? 'Preview error'
        : changedFiles.length > 0
          ? `Changed: ${changedFiles.join(', ')}`
          : 'Original source';

  return (
    <div
      className="grid gap-4"
      data-playground-instance={descriptor.instanceId}
    >
      <div ref={toolbarRef} className="flex flex-wrap items-center gap-2">
        {editorActive ? (
          <fieldset className="inline-flex rounded-md border border-input p-0.5">
            <legend className="sr-only">Layout</legend>
            {VIEW_MODES.map(({ label, mode }) => (
              <button
                key={mode}
                type="button"
                aria-pressed={view === mode}
                className={cn(
                  'h-7 rounded-sm px-2.5 text-sm outline-none transition-colors duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/50 motion-reduce:transition-none',
                  view === mode
                    ? 'bg-primary-700 text-white dark:bg-primary-500 dark:text-gray-950'
                    : 'text-foreground hover:bg-black/5 dark:hover:bg-white/5',
                )}
                onClick={() => setView(mode)}
              >
                {label}
              </button>
            ))}
          </fieldset>
        ) : (
          <Button
            type="button"
            size="sm"
            disabled={!hydrated}
            onClick={loadEditor}
          >
            Edit code
          </Button>
        )}

        {confirmReset ? (
          <span className="inline-flex flex-wrap items-center gap-2 text-sm">
            <span>Discard all edits and control changes?</span>
            <Button
              ref={discardButtonRef}
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => {
                dispatch({ type: 'reset-all' });
                setConfirmReset(false);
                setAnnouncement('All files and controls were reset.');
                // "Reset all" is disabled now, so focus the first toolbar button.
                requestAnimationFrame(() =>
                  toolbarRef.current
                    ?.querySelector<HTMLButtonElement>('button:not(:disabled)')
                    ?.focus(),
                );
              }}
            >
              Discard edits
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => {
                setConfirmReset(false);
                requestAnimationFrame(() => resetButtonRef.current?.focus());
              }}
            >
              Cancel
            </Button>
          </span>
        ) : (
          <Button
            ref={resetButtonRef}
            type="button"
            size="sm"
            variant="outline"
            disabled={!hydrated || changedFiles.length === 0}
            onClick={() => setConfirmReset(true)}
          >
            Reset all
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!hydrated}
          onClick={copyLink}
        >
          {linkCopied ? 'Link copied' : 'Copy link'}
        </Button>

        <p className="ml-auto text-sm text-gray-600 dark:text-gray-400">
          {statusText}
        </p>
      </div>

      <div
        ref={panesRef}
        className={cn(
          'grid min-w-0 gap-4',
          showDivider &&
            'md:grid-cols-[minmax(0,var(--code-pane))_auto_minmax(0,var(--preview-pane))] md:gap-0',
        )}
        style={
          showDivider
            ? ({
                '--code-pane': `${split}fr`,
                '--preview-pane': `${100 - split}fr`,
              } as CSSProperties)
            : undefined
        }
      >
        {editorActive ? (
          <section
            ref={codePaneRef}
            id={codePaneId}
            tabIndex={-1}
            hidden={!showCode}
            aria-label={`${descriptor.title} source`}
            className={cn(
              'h-96 min-w-0 overflow-hidden rounded-md border border-border outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
              showDivider && 'md:h-[28rem]',
            )}
          >
            {editorState === 'loading' ? (
              <p className="p-4 text-sm">Loading the editor...</p>
            ) : null}
            {editorState === 'failed' ? (
              <div className="grid gap-2 p-4 text-sm">
                <p>
                  The editor could not be loaded. The source files below the
                  preview are still available.
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="w-fit"
                  onClick={loadEditor}
                >
                  Try again
                </Button>
              </div>
            ) : null}
            {Editor ? (
              <Editor
                idPrefix={idPrefix}
                filesRef={filesRef}
                externalRevision={model.externalRevision}
                meta={descriptor.files}
                activeFile={descriptor.activeFile}
                onFileChange={onFileChange}
                onResetFile={onResetFile}
                onAnnounce={setAnnouncement}
              />
            ) : null}
          </section>
        ) : null}

        {showDivider ? (
          <div
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-label="Resize source and preview"
            aria-controls={codePaneId}
            aria-valuemin={SPLIT_MIN}
            aria-valuemax={SPLIT_MAX}
            aria-valuenow={split}
            aria-valuetext={`Source ${split}%, preview ${100 - split}%`}
            title="Drag, or use the arrow keys. Home and End jump to the limits, Enter or a double-click resets."
            className="group hidden w-4 cursor-col-resize touch-none items-center justify-center outline-none md:flex"
            onPointerDown={onDividerPointerDown}
            onPointerMove={onDividerPointerMove}
            onDoubleClick={() => setSplit(SPLIT_DEFAULT)}
            onKeyDown={onDividerKeyDown}
          >
            <span className="h-12 w-1 rounded-full bg-gray-300 transition-colors duration-150 group-hover:bg-primary-700 group-focus-visible:bg-primary-700 group-focus-visible:ring-[3px] group-focus-visible:ring-ring/50 motion-reduce:transition-none dark:bg-gray-600 dark:group-hover:bg-primary-500 dark:group-focus-visible:bg-primary-500" />
          </div>
        ) : null}

        <div hidden={!showPreview} className="grid min-w-0 content-start gap-2">
          <iframe
            ref={iframeRef}
            title={`${descriptor.title} preview`}
            sandbox="allow-scripts"
            referrerPolicy="no-referrer"
            srcDoc={srcDoc}
            className={cn(
              'block h-72 w-full rounded-md border border-border bg-white',
              showDivider && 'md:h-[28rem]',
              editorActive && view === 'preview' && 'h-96',
            )}
          />
          {runtime.kind === 'error' ? (
            <div className="rounded-md border border-red-600/40 bg-red-600/5 p-3 text-sm text-red-700 dark:border-red-500/40 dark:text-red-400">
              <p className="font-normal">The preview reported an error:</p>
              <ul className="mt-1 list-disc pl-5 font-mono text-xs">
                {runtime.errors.map((error, index) => (
                  <li key={`${index}-${error}`}>{error}</li>
                ))}
              </ul>
              <p className="mt-1">
                Fix the source, or reset the file to its original version.
              </p>
            </div>
          ) : null}
          {runtime.kind !== 'error' && runtime.missing.length > 0 ? (
            <p className="rounded-md border border-amber-600/40 bg-amber-600/5 p-3 text-sm text-amber-800 dark:border-amber-400/40 dark:text-amber-300">
              The preview has no element matching{' '}
              <code>{runtime.missing.join(', ')}</code>, so some controls may
              have no effect. Reset all files to restore the original markup.
            </p>
          ) : null}
        </div>
      </div>

      {model.stateError ? (
        <div className="rounded-md border border-red-600/40 bg-red-600/5 p-3 text-sm text-red-700 dark:border-red-500/40 dark:text-red-400">
          <p>
            <code>{descriptor.stateFile.slice(1)}</code> is not valid:{' '}
            {model.stateError}
          </p>
          <p className="mt-1">
            The controls are paused and the preview uses the last valid state
            until the file is fixed.
          </p>
          <Button
            type="button"
            size="xs"
            variant="outline"
            className="mt-2"
            onClick={() => onResetFile(descriptor.stateFile)}
          >
            Reset {descriptor.stateFile.slice(1)}
          </Button>
        </div>
      ) : null}

      <PlaygroundControls
        idPrefix={idPrefix}
        controls={descriptor.controls}
        state={model.validState}
        disabled={!hydrated || model.stateError !== null}
        onChange={(id, value) => dispatch({ id, type: 'control', value })}
      />

      <p id={statusId} role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      {editorActive ? null : children}
    </div>
  );
}
