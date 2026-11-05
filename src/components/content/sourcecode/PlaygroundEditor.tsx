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
  SandpackCodeEditor,
  type SandpackFiles,
  SandpackProvider,
  type SandpackTheme,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { Button } from '@components/shared/elements/button.tsx';
import type { PlaygroundFile } from '@utils/code-playground.pure.ts';
import {
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

function EditorActions({
  onResetFile,
  onAnnounce,
}: {
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
      <p className="ml-auto text-xs text-muted-foreground">
        Press <kbd>Esc</kbd>, then <kbd>Tab</kbd>, to leave the editor.
      </p>
    </div>
  );
}

function PlaygroundEditor({
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
      <SandpackCodeEditor
        showTabs
        showLineNumbers
        showRunButton={false}
        className="min-h-0 flex-1"
        style={{ height: 'auto' }}
      />
      <EditorActions onResetFile={onResetFile} onAnnounce={onAnnounce} />
    </SandpackProvider>
  );
}

/** Re-renders only when `externalRevision` or a callback changes. */
export default memo(PlaygroundEditor);
