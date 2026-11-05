/**
 * Sandpack-backed source editor for the code playground.
 *
 * This module is loaded with a dynamic `import()` only after a reader selects
 * "Edit code", so Sandpack and CodeMirror never ship with the initial page.
 * Sandpack is used for its editor, file tabs, and file state only: autorun is
 * off and no `SandpackPreview` is mounted, so its hosted bundler is never
 * contacted. The preview is rendered by `CodePlaygroundIsland.tsx`.
 */
import {
  CodeEditor,
  type SandpackFiles,
  SandpackProvider,
  type SandpackTheme,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { Button } from '@components/shared/elements/button.tsx';
import type { PlaygroundFile } from '@utils/code-playground.pure.ts';
import {
  type KeyboardEvent,
  memo,
  type ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

/** Pause in typing after which editor changes are reported to the host. */
const REPORT_DELAY_MS = 120;

export interface PlaygroundEditorProps {
  /** Prefix for element ids, unique per playground on the page. */
  idPrefix: string;
  /**
   * Current host files. A ref, not a value, so that host updates while the
   * reader types do not re-render the Sandpack tree (re-rendering it while
   * CodeMirror is ahead of Sandpack's state starts an update loop).
   */
  filesRef: { readonly current: Readonly<Record<string, string>> };
  /** Changes when the host changed files outside the editor. */
  externalRevision: number;
  meta: readonly PlaygroundFile[];
  activeFile: string;
  /** Called when the reader edits a file in the editor. */
  onFileChange: (path: string, code: string) => void;
  /** Called when the reader resets the active file. */
  onResetFile: (path: string) => void;
  /** Short status text announced by the host's live region. */
  onAnnounce: (message: string) => void;
}

const fonts = {
  body: 'var(--font-sans)',
  lineHeight: '1.6',
  mono: 'var(--font-mono)',
  size: '14px',
};

/**
 * Syntax palettes mirror the Expressive Code themes used for static code
 * blocks (`dracula` in dark mode, `light-plus` in light mode), with comment
 * and inactive-tab colours raised to at least 4.5:1 contrast.
 */
const draculaTheme: SandpackTheme = {
  colors: {
    accent: '#50fa7b',
    base: '#f8f8f2',
    clickable: '#c2c6d9',
    disabled: '#8a93b8',
    error: '#ff6e6e',
    errorSurface: '#44475a',
    hover: '#ffffff',
    surface1: '#282a36',
    surface2: '#44475a',
    surface3: '#343746',
  },
  font: fonts,
  syntax: {
    comment: { color: '#9ba5d6', fontStyle: 'italic' },
    definition: '#50fa7b',
    keyword: '#ff79c6',
    plain: '#f8f8f2',
    property: '#8be9fd',
    punctuation: '#f8f8f2',
    static: '#bd93f9',
    string: '#f1fa8c',
    tag: '#ff79c6',
  },
};

const lightPlusTheme: SandpackTheme = {
  colors: {
    accent: '#008236',
    base: '#1f1f1f',
    clickable: '#4d4d4d',
    disabled: '#767676',
    error: '#c4314b',
    errorSurface: '#fde7e9',
    hover: '#000000',
    surface1: '#ffffff',
    surface2: '#d4d4d4',
    surface3: '#f3f3f3',
  },
  font: fonts,
  syntax: {
    comment: '#008000',
    definition: '#001080',
    keyword: '#0000ff',
    plain: '#000000',
    property: '#c50000',
    punctuation: '#000000',
    static: '#098658',
    string: '#a31515',
    tag: '#800000',
  },
};

/** Follows the site's `data-code-theme` attribute (set by the theme selector). */
function useCodeTheme(): SandpackTheme {
  const read = (): SandpackTheme =>
    document.documentElement.dataset['codeTheme'] === 'dracula'
      ? draculaTheme
      : lightPlusTheme;
  const [theme, setTheme] = useState<SandpackTheme>(read);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, {
      attributeFilter: ['data-code-theme'],
      attributes: true,
    });
    return () => observer.disconnect();
  }, []);
  return theme;
}

/**
 * Keeps Sandpack's file state and the host's file state in step without a
 * feedback loop: host files are pushed into Sandpack only when
 * `externalRevision` changes (controls and resets), and Sandpack edits are
 * reported only when Sandpack's files change. Equal content is never written
 * back, and the host never echoes an older version of an edit into the
 * editor while the reader types.
 */
function EditorSync({
  filesRef,
  flushRef,
  externalRevision,
  paths,
  onFileChange,
}: {
  filesRef: { readonly current: Readonly<Record<string, string>> };
  flushRef: { current: () => void };
  externalRevision: number;
  paths: readonly string[];
  onFileChange: (path: string, code: string) => void;
}): null {
  const { sandpack } = useSandpack();
  const sandpackFiles = sandpack.files;

  // Runs only for host-originated changes (controls and resets).
  useEffect(() => {
    for (const path of paths) {
      const code = filesRef.current[path];
      if (code !== undefined && sandpack.files[path]?.code !== code) {
        sandpack.updateFile(path, code, false);
      }
    }
  }, [externalRevision]);

  // Editor changes reach the host after a short pause in typing, or at once
  // when focus leaves the editor (see `flushRef`). Reporting them from the
  // same input event chain as CodeMirror's own synchronous Sandpack update
  // makes React abort with "Maximum update depth exceeded" during fast typing.
  const pending = useRef(new Map<string, string>());
  const timer = useRef<number | undefined>(undefined);
  const flush = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = undefined;
    const changes = [...pending.current];
    pending.current.clear();
    for (const [path, code] of changes) onFileChange(path, code);
  }, [onFileChange]);
  flushRef.current = flush;

  // Runs only when Sandpack's files change.
  useEffect(() => {
    for (const path of paths) {
      const code = sandpackFiles[path]?.code;
      if (code === undefined) continue;
      if (filesRef.current[path] === code) pending.current.delete(path);
      else pending.current.set(path, code);
    }
    if (pending.current.size === 0) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(flush, REPORT_DELAY_MS);
  }, [sandpackFiles]);

  useEffect(() => flush, [flush]);

  return null;
}

const tabId = (idPrefix: string, path: string): string =>
  `${idPrefix}-tab-${path.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '')}`;

/**
 * File tabs. Sandpack's own tab strip puts `role="tab"` on a wrapper around
 * a button (axe: nested-interactive), so the playground renders its own
 * tablist: one button per file, roving `tabindex`, arrow keys, Home, and End,
 * with automatic activation.
 */
function FileTabs({
  idPrefix,
  paths,
}: {
  idPrefix: string;
  paths: readonly string[];
}): ReactElement {
  const { sandpack } = useSandpack();
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ): void => {
    const last = paths.length - 1;
    const targets: Record<string, number> = {
      ArrowLeft: index === 0 ? last : index - 1,
      ArrowRight: index === last ? 0 : index + 1,
      End: last,
      Home: 0,
    };
    const next = targets[event.key];
    const path = next === undefined ? undefined : paths[next];
    if (next === undefined || path === undefined) return;
    event.preventDefault();
    sandpack.setActiveFile(path);
    tabs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Source files"
      className="flex shrink-0 overflow-x-auto border-b border-(--sp-colors-surface2) bg-(--sp-colors-surface1)"
    >
      {paths.map((path, index) => {
        const selected = path === sandpack.activeFile;
        return (
          <button
            key={path}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            id={tabId(idPrefix, path)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={selected ? 0 : -1}
            className={
              selected
                ? 'shrink-0 border-b-2 border-(--sp-colors-accent) px-3 py-2 font-mono text-xs text-(--sp-colors-base) outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset'
                : 'shrink-0 border-b-2 border-transparent px-3 py-2 font-mono text-xs text-(--sp-colors-clickable) outline-none hover:text-(--sp-colors-hover) focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:ring-inset'
            }
            onClick={() => sandpack.setActiveFile(path)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {path.replace(/^\//, '')}
          </button>
        );
      })}
    </div>
  );
}

/**
 * The tab panel: one CodeMirror instance for the active file.
 *
 * Sandpack wraps CodeMirror in a focusable `role="textbox"` element and takes
 * the real editable element out of the tab order (Enter moves focus into it).
 * That nests one textbox in another for screen readers and leaves the
 * scrolling region without focusable content. After each mount, the editable
 * element becomes the single tab stop and the wrapper a labelled group that
 * still receives focus from Escape, so Escape then Tab leaves the editor.
 */
function EditorPanel({ idPrefix }: { idPrefix: string }): ReactElement {
  const { sandpack } = useSandpack();
  const { code, updateCode, readOnly } = useActiveCode();
  const path = sandpack.activeFile;
  const panelRef = useRef<HTMLDivElement>(null);
  const hintId = `${idPrefix}-editor-hint`;

  useEffect(() => {
    const panel = panelRef.current;
    const wrapper = panel?.querySelector<HTMLElement>('.sp-cm');
    const content = panel?.querySelector<HTMLElement>('.cm-content');
    if (!wrapper || !content) return;
    wrapper.setAttribute('role', 'group');
    wrapper.removeAttribute('aria-autocomplete');
    wrapper.removeAttribute('aria-multiline');
    wrapper.tabIndex = -1;
    content.tabIndex = 0;
    content.setAttribute('aria-describedby', hintId);
    // Escape focuses the wrapper. Tab from there would re-enter the editable
    // element inside it, so it leaves the tab order until the wrapper loses
    // focus again.
    const onWrapperFocus = (event: FocusEvent): void => {
      if (event.target === wrapper) content.tabIndex = -1;
    };
    const onWrapperBlur = (event: FocusEvent): void => {
      if (event.target === wrapper) content.tabIndex = 0;
    };
    wrapper.addEventListener('focus', onWrapperFocus);
    wrapper.addEventListener('blur', onWrapperBlur);
    return () => {
      wrapper.removeEventListener('focus', onWrapperFocus);
      wrapper.removeEventListener('blur', onWrapperBlur);
    };
  }, [path, readOnly, hintId]);

  return (
    <div
      ref={panelRef}
      id={`${idPrefix}-panel`}
      role="tabpanel"
      aria-labelledby={tabId(idPrefix, path)}
      className="min-h-0 flex-1 overflow-hidden bg-(--sp-colors-surface1) [&_.cm-editor]:h-full [&_.sp-code-editor]:h-full"
    >
      <CodeEditor
        key={path}
        code={code}
        filePath={path}
        initMode="immediate"
        readOnly={readOnly}
        showLineNumbers
        showReadOnly
        onCodeUpdate={(next) => updateCode(next, false)}
      />
    </div>
  );
}

function EditorActions({
  idPrefix,
  onResetFile,
  onAnnounce,
}: {
  idPrefix: string;
  onResetFile: (path: string) => void;
  onAnnounce: (message: string) => void;
}): ReactElement {
  const { sandpack } = useSandpack();
  const path = sandpack.activeFile;
  const name = path.replace(/^\//, '');
  const readOnly = sandpack.files[path]?.readOnly === true;

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-border px-3 py-2">
      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(
              sandpack.files[path]?.code ?? '',
            );
            onAnnounce(`Copied ${name}.`);
          } catch {
            onAnnounce(
              `Could not copy ${name}. Select the code and copy it manually.`,
            );
          }
        }}
      >
        Copy {name}
      </Button>
      {readOnly ? null : (
        <Button
          type="button"
          variant="outline"
          size="xs"
          onClick={() => {
            onResetFile(path);
            onAnnounce(`Reset ${name}.`);
          }}
        >
          Reset {name}
        </Button>
      )}
      <p
        id={`${idPrefix}-editor-hint`}
        className="ml-auto text-xs text-gray-600 dark:text-gray-400"
      >
        <kbd>Tab</kbd> indents. Press <kbd>Esc</kbd>, then <kbd>Tab</kbd>, to
        leave the editor.
      </p>
    </div>
  );
}

function PlaygroundEditor({
  idPrefix,
  filesRef,
  externalRevision,
  meta,
  activeFile,
  onFileChange,
  onResetFile,
  onAnnounce,
}: PlaygroundEditorProps): ReactElement {
  const theme = useCodeTheme();
  const flushRef = useRef<() => void>(() => undefined);
  // Sandpack treats `files` as initial state; later changes go through
  // `EditorSync`, so the provider is never remounted while the reader types.
  const [initialFiles] = useState<SandpackFiles>(() =>
    Object.fromEntries(
      meta.map((file) => [
        file.path,
        {
          code: filesRef.current[file.path] ?? file.code,
          hidden: file.hidden,
          readOnly: file.readOnly,
        },
      ]),
    ),
  );
  // Sandpack reacts to new `options` objects, so they are created once.
  const [{ options, paths }] = useState(() => ({
    options: {
      activeFile,
      autoReload: false,
      autorun: false,
      initMode: 'immediate' as const,
      visibleFiles: meta
        .filter((file) => !file.hidden)
        .map((file) => file.path),
    },
    paths: meta.map((file) => file.path),
  }));

  return (
    <SandpackProvider
      template="static"
      files={initialFiles}
      theme={theme}
      options={options}
      className="flex h-full min-h-0 flex-col"
      onBlur={() => flushRef.current()}
    >
      <EditorSync
        filesRef={filesRef}
        flushRef={flushRef}
        externalRevision={externalRevision}
        paths={paths}
        onFileChange={onFileChange}
      />
      <FileTabs idPrefix={idPrefix} paths={options.visibleFiles} />
      <EditorPanel idPrefix={idPrefix} />
      <EditorActions
        idPrefix={idPrefix}
        onResetFile={onResetFile}
        onAnnounce={onAnnounce}
      />
    </SandpackProvider>
  );
}

/** Re-renders only when `externalRevision` or a callback changes. */
export default memo(PlaygroundEditor);
