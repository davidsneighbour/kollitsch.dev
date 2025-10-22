/**
 * dnb-syncstring (with Dracula theme via attribute switch)
 * ESM + TypeScript. Self-contained. Multiple instances supported.
 *
 * Theming:
 * - Default tokens on <dnb-syncstring>
 * - Auto dark if no theme attr and user prefers dark
 * - Force with theme="dracula" or theme="light"
 *
 * Example:
 * <dnb-syncstring
 *   theme="dracula"
 *   fields='[{"label":"Username","type":"text","slug":"username"},{"label":"Repository","type":"text","slug":"repo"},{"label":"API key","type":"password","slug":"apiKey"}]'
 *   result-template="https://{apiKey}@github.com/{username}/{repo}.git">
 * </dnb-syncstring>
 */
/**
 * Strict TS ready (suggest "lib": ["ES2022","DOM"], "module":"ES2022", "target":"ES2022").
 */

/**
 * dnb-syncstring (with Dracula theme via attribute switch)
 * ESM + TypeScript. Self-contained. Multiple instances supported.
 *
 * Two independent reveal controls:
 * - Per-field (password) reveal: shows/hides ONLY the input field value while editing.
 *   It resets to hidden on save/exit/switch. Does NOT affect result masking.
 * - Global "Reveal secrets" switch: shows/hides ALL secrets in the RESULT STRING display only.
 *
 * Strict TS ready (suggest "lib": ["ES2022","DOM"], "module":"ES2022", "target":"ES2022").
 */
/**
 * dnb-syncstring — Theming refactor (OCD mode)
 * Goal: Keep DOM classes STRICTLY to dnb-syncstring-*.
 * Tailwind (or any utility CSS) is opt-in via:
 *   - attribute: tailwind="true" and tw-theme="dracula" | "light"
 *   - OR JSON styles map via attribute: styles='{ ... }'
 *   - OR programmatic: setStyles(map)
 *
 * Rules:
 * - Core CSS uses tokens + minimal defaults only (no utility classes baked in).
 * - Style maps add classes on top of base classes at runtime.
 * - You can mix: start with preset Tailwind map, override via JSON/object.
 *
 * Strict TS suggested tsconfig: ES2022 module/target, DOM lib, strict true.
 */
/**
 * dnb-syncstring (with Dracula theme via attribute switch)
 * ESM + TypeScript. Self-contained. Multiple instances supported.
 *
 * Two independent reveal controls:
 * - Per-field (password) reveal: shows/hides ONLY the input field value while editing.
 *   It resets to hidden on save/exit/switch. Does NOT affect result masking.
 * - Global "Reveal secrets" switch: shows/hides ALL secrets in the RESULT STRING display only.
 *
 * Strict TS ready (suggest "lib": ["ES2022","DOM"], "module":"ES2022", "target":"ES2022").
 */

type FieldType = 'text' | 'password' | 'email' | 'url' | 'search';

interface SyncField {
  label: string;
  type: FieldType;
  slug: string;
  placeholder?: string;
  value?: string;
  pattern?: string;
  required?: boolean;
  /** If type === "password": show a per-field Reveal button next to the input (edit mode only) */
  revealToggle?: boolean;
}

interface SyncStringConfig {
  fields: SyncField[];
  resultTemplate: string;
  threshold: number; // min chars before user input replaces fallback
  debounceMs: number; // debounce for typing
}

interface DisplayNode {
  slug: string;
  el: HTMLSpanElement;
  editBtn: HTMLButtonElement;
  row: HTMLDivElement;
}

const DEFAULT_CONFIG: SyncStringConfig = {
  debounceMs: 300,
  fields: [
    {
      label: 'Username',
      placeholder: 'octocat',
      slug: 'username',
      type: 'text',
      value: 'username',
    },
    {
      label: 'Repository',
      placeholder: 'hello-world',
      slug: 'repo',
      type: 'text',
      value: 'repo',
    },
    {
      label: 'API key',
      placeholder: 'ghp_***',
      revealToggle: true,
      slug: 'apiKey',
      type: 'password',
      value: 'apiKey',
    },
  ],
  resultTemplate: 'https://{apiKey}@github.com/{username}/{repo}.git',
  threshold: 3,
};

/** One-time style injector */
function ensureThemeStylesInjected(): void {
  const STYLE_ID = 'dnb-syncstring-theme-styles';
  if (document.getElementById(STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = STYLE_ID;
  s.textContent = `
dnb-syncstring {
  --dnb-bg: #ffffff;
  --dnb-panel: #f7f7fb;
  --dnb-muted: #6b7280;
  --dnb-fg: #111827;
  --dnb-accent: #6366f1;
  --dnb-accent-2: #ec4899;
  --dnb-success: #10b981;
  --dnb-info: #06b6d4;
  --dnb-border: #e5e7eb;
  --dnb-danger: #ef4444;
  --dnb-warning: #f59e0b;
}
@media (prefers-color-scheme: dark) {
  dnb-syncstring:not([theme]) {
    --dnb-bg: #0f1115;
    --dnb-panel: #0b0d12;
    --dnb-muted: #94a3b8;
    --dnb-fg: #e5e7eb;
    --dnb-accent: #7c3aed;
    --dnb-accent-2: #db2777;
    --dnb-success: #10b981;
    --dnb-info: #06b6d4;
    --dnb-border: #1f2937;
    --dnb-danger: #ef4444;
    --dnb-warning: #f59e0b;
  }
}
dnb-syncstring[theme="dracula"] {
  --dnb-bg: #282a36;
  --dnb-panel: #1e1f29;
  --dnb-muted: #6272a4;
  --dnb-fg: #f8f8f2;
  --dnb-accent: #bd93f9;
  --dnb-accent-2: #ff79c6;
  --dnb-success: #50fa7b;
  --dnb-info: #8be9fd;
  --dnb-border: #44475a;
  --dnb-danger: #ff5555;
  --dnb-warning: #f1fa8c;
}
dnb-syncstring[theme="light"] {
  --dnb-bg: #ffffff;
  --dnb-panel: #f7f7fb;
  --dnb-muted: #6b7280;
  --dnb-fg: #111827;
  --dnb-accent: #6366f1;
  --dnb-accent-2: #ec4899;
  --dnb-success: #10b981;
  --dnb-info: #06b6d4;
  --dnb-border: #e5e7eb;
  --dnb-danger: #ef4444;
  --dnb-warning: #f59e0b;
}
dnb-syncstring .dnb-syncstring { background-color: var(--dnb-panel); color: var(--dnb-fg); border-color: var(--dnb-border); }
dnb-syncstring .dnb-syncstring-label { color: var(--dnb-muted); }
dnb-syncstring .dnb-syncstring-display-text { background-color: var(--dnb-bg); border-color: var(--dnb-border); color: var(--dnb-fg); }
dnb-syncstring .dnb-syncstring-input { background-color: var(--dnb-bg); border-color: var(--dnb-border); color: var(--dnb-fg); outline: none; }
dnb-syncstring .dnb-syncstring-input:focus { box-shadow: 0 0 0 2px var(--dnb-accent); border-color: var(--dnb-accent); }
dnb-syncstring .dnb-syncstring-result { background-color: var(--dnb-bg); border-color: var(--dnb-border); color: var(--dnb-fg); }
dnb-syncstring .dnb-syncstring-copy,
dnb-syncstring .dnb-syncstring-edit-btn,
dnb-syncstring .dnb-syncstring-save,
dnb-syncstring .dnb-syncstring-cancel { background-color: transparent; border-color: var(--dnb-border); color: var(--dnb-fg); }
dnb-syncstring .dnb-syncstring-copy:hover,
dnb-syncstring .dnb-syncstring-edit-btn:hover,
dnb-syncstring .dnb-syncstring-save:hover,
dnb-syncstring .dnb-syncstring-cancel:hover { border-color: var(--dnb-accent); color: var(--dnb-accent); }
dnb-syncstring .dnb-syncstring-reveal { color: var(--dnb-muted); }
dnb-syncstring .dnb-syncstring-error { color: var(--dnb-danger); }
dnb-syncstring .active {
  background: color-mix(in oklab, var(--dnb-accent) 20%, transparent);
  outline: 2px solid var(--dnb-accent);
  border-radius: .25rem;
  padding: .1rem .15rem;
}
dnb-syncstring .dnb-syncstring-reveal-input {
  background-color: transparent;
  border-color: var(--dnb-border);
  color: var(--dnb-fg);
}
dnb-syncstring .dnb-syncstring-reveal-input:hover {
  border-color: var(--dnb-accent);
  color: var(--dnb-accent);
}

/* hide lastpass autocomplete icon */
[data-lastpass-icon-root], [data-lastpass-root] {
display: none;
}

`;
  document.head.appendChild(s);
}

function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  wait: number,
): T {
  let timeout: number | undefined;
  return function debounced(this: unknown, ...args: Parameters<T>) {
    if (timeout) window.clearTimeout(timeout);
    timeout = window.setTimeout(() => fn.apply(this, args), wait);
  } as T;
}

function safeParseJson<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error('[dnb-syncstring] Failed to parse JSON:', err);
    return fallback;
  }
}

/** Collect `{placeholder}` names safely as `string[]` under exactOptionalPropertyTypes */
function templatePlaceholders(template: string): string[] {
  return Array.from(template.matchAll(/\{([a-zA-Z0-9_-]+)\}/g))
    .map((m) => m[1])
    .filter((p): p is string => typeof p === 'string');
}

function findMissingPlaceholders(
  template: string,
  fields: SyncField[],
): string[] {
  const placeholders = templatePlaceholders(template);
  const slugs = new Set(fields.map((f) => f.slug));
  return Array.from(new Set(placeholders.filter((p) => !slugs.has(p))));
}

function applyTemplate(
  template: string,
  values: Readonly<Record<string, string>>,
): string {
  return template.replace(
    /\{([a-zA-Z0-9_-]+)\}/g,
    (_m: string, key: string) => {
      const v = values[key as keyof typeof values];
      return v !== undefined ? v : `{${key}}`;
    },
  );
}

/** ES2022-safe HTML escape (no replaceAll) */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Resolve values with:
 * - threshold gating: use user input only if length >= threshold
 * - fallback to field.value if provided, else to slug
 */
function resolveWithFallback(
  raw: Record<string, string>,
  fields: SyncField[],
  threshold: number,
): Record<string, string> {
  const out: Record<string, string> = {};
  const meta = new Map(fields.map((f) => [f.slug, f]));
  for (const slug of meta.keys()) {
    const field = meta.get(slug)!;
    const v = raw[slug] ?? '';
    if (v.length >= threshold) out[slug] = v;
    else out[slug] = field.value ?? field.slug;
  }
  return out;
}

/** Visual masking for password fields in the RESULT string only (controlled by global revealAll) */
function valuesForMask(
  values: Record<string, string>,
  fields: SyncField[],
  revealAll: boolean,
): Record<string, string> {
  const typemap = new Map(fields.map((f) => [f.slug, f.type]));
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(values)) {
    const t = typemap.get(k);
    out[k] = t === 'password' && !revealAll ? (v ? '***' : '') : (v ?? '');
  }
  return out;
}

/** Highlight active slug; keep slug typed as string (not possibly undefined) */
function highlightActive(
  template: string,
  values: Record<string, string>,
  activeSlug: string,
): string {
  const parts: Array<string> = [];
  let i = 0;
  const re = /\{([a-zA-Z0-9_-]+)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(template)) !== null) {
    const token = m[0];
    const slug = m[1] as string; // regex guarantees this capture exists
    parts.push(escapeHtml(template.slice(i, m.index)));
    const replacement = values[slug] ?? token;
    if (slug === activeSlug && replacement) {
      parts.push(`<span class="active">${escapeHtml(replacement)}</span>`);
    } else {
      parts.push(escapeHtml(replacement));
    }
    i = m.index + token.length;
  }
  parts.push(escapeHtml(template.slice(i)));
  return parts.join('');
}

export class DNBSyncString extends HTMLElement {
  private config: SyncStringConfig = { ...DEFAULT_CONFIG };
  private state: Map<string, string> = new Map();
  private debouncedCompute!: () => void;

  private root!: HTMLElement;
  private inputsEl!: HTMLDivElement;
  private outputEl!: HTMLDivElement;
  private errorEl!: HTMLDivElement;
  private copyBtn!: HTMLButtonElement;

  /** Global RESULT reveal switch (checkbox in header) */
  private revealChk!: HTMLInputElement;

  /** Tracks per-field INPUT visibility while editing (decoupled from result masking) */
  private revealedInputs: Set<string> = new Set();

  private activeSlug: string | null = null;
  private displayNodes: Map<string, DisplayNode> = new Map();
  private editors: Map<string, HTMLDivElement> = new Map();

  static get observedAttributes(): string[] {
    return ['fields', 'result-template', 'threshold', 'debounce', 'theme'];
  }

  constructor() {
    super();
    ensureThemeStylesInjected();
    this.debouncedCompute = debounce(
      () => this.computeAndRender(),
      DEFAULT_CONFIG.debounceMs,
    );
  }

  connectedCallback(): void {
    this.loadConfigFromAttributes();
    this.renderBase();
    this.mountRows();
    this.updateDebounce();
    this.computeAndRender();
  }

  /** Guarded to avoid DOM access before connectedCallback */
  attributeChangedCallback(): void {
    this.loadConfigFromAttributes();
    if (!this.isConnected) return;
    if (!this.root) this.renderBase();
    if (!this.inputsEl) this.renderBase();
    this.updateDebounce();
    this.mountRows();
    this.computeAndRender();
  }

  /** Merge config programmatically */
  public setConfig(cfg: Partial<SyncStringConfig>): void {
    this.config = {
      ...this.config,
      ...cfg,
      debounceMs:
        typeof cfg.debounceMs === 'number'
          ? cfg.debounceMs
          : this.config.debounceMs,
      fields: cfg.fields ?? this.config.fields,
      resultTemplate: cfg.resultTemplate ?? this.config.resultTemplate,
      threshold:
        typeof cfg.threshold === 'number'
          ? cfg.threshold
          : this.config.threshold,
    };
    this.renderBase();
    this.mountRows();
    this.updateDebounce();
    this.computeAndRender();
  }

  /** Current values (raw, without fallback) */
  public getValues(): Record<string, string> {
    const out: Record<string, string> = {};
    this.config.fields.forEach(
      (f) => (out[f.slug] = this.state.get(f.slug) ?? ''),
    );
    return out;
  }

  /** Current result; masked by default for visual display */
  public getResult(unmasked = false): string {
    const raw = this.getValues();
    const resolved = resolveWithFallback(
      raw,
      this.config.fields,
      this.config.threshold,
    );
    const revealAll = unmasked || (this.revealChk?.checked ?? false);
    const values = valuesForMask(resolved, this.config.fields, revealAll);
    return applyTemplate(this.config.resultTemplate, values);
  }

  // ----- internals -----

  private loadConfigFromAttributes(): void {
    const fields = safeParseJson<SyncField[]>(
      this.getAttribute('fields'),
      DEFAULT_CONFIG.fields,
    );
    const tpl =
      this.getAttribute('result-template')?.trim() ||
      DEFAULT_CONFIG.resultTemplate;
    const thresholdAttr = this.getAttribute('threshold');
    const debounceAttr = this.getAttribute('debounce');

    const normalized: SyncField[] = [];
    const seen = new Set<string>();

    for (const f of fields) {
      if (!f?.slug) continue;
      const slug = String(f.slug).trim();
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);

      const base: SyncField = {
        label: f.label ?? slug,
        // revealToggle only allowed for password fields
        revealToggle:
          f.type === 'password'
            ? Boolean((f as Partial<SyncField>).revealToggle)
            : false,
        slug,
        type: (f.type as FieldType) ?? 'text',
        // set a concrete default so it is never "present but undefined"
        value: f.value ?? slug,
      };

      // Add optionals ONLY if actually defined (per exactOptionalPropertyTypes)
      if (f.placeholder !== undefined) {
        base.placeholder = f.placeholder;
      }
      if (f.pattern !== undefined) {
        base.pattern = f.pattern;
      }
      if (f.required !== undefined) {
        base.required = f.required;
      }

      normalized.push(base);
    }

    const threshold = Number.isFinite(Number(thresholdAttr))
      ? Math.max(0, Number(thresholdAttr))
      : DEFAULT_CONFIG.threshold;
    const debounceMs = Number.isFinite(Number(debounceAttr))
      ? Math.max(0, Number(debounceAttr))
      : DEFAULT_CONFIG.debounceMs;

    this.config = {
      debounceMs,
      fields: normalized.length ? normalized : DEFAULT_CONFIG.fields,
      resultTemplate: tpl,
      threshold,
    };

    // seed state with defaults if empty
    for (const f of this.config.fields) {
      if (!this.state.has(f.slug)) this.state.set(f.slug, f.value ?? f.slug);
    }
  }

  private renderBase(): void {
    this.innerHTML = '';

    this.root = document.createElement('div');
    this.root.className =
      'dnb-syncstring w-full flex flex-col gap-4 border rounded p-4 transition-colors';

    this.inputsEl = document.createElement('div');
    this.inputsEl.className = 'dnb-syncstring-inputs flex flex-col gap-3';

    const outWrap = document.createElement('div');
    outWrap.className =
      'dnb-syncstring-output flex items-start gap-3 flex-wrap';

    this.outputEl = document.createElement('div');
    this.outputEl.className =
      'dnb-syncstring-result font-mono break-all p-2 border rounded min-w-[16rem]';

    this.copyBtn = document.createElement('button');
    this.copyBtn.type = 'button';
    this.copyBtn.className = 'dnb-syncstring-copy px-2 py-1 border rounded';
    this.copyBtn.textContent = 'Copy';
    this.copyBtn.addEventListener('click', () => this.handleCopy());

    const revealWrap = document.createElement('label');
    revealWrap.className =
      'dnb-syncstring-reveal flex items-center gap-2 select-none';
    this.revealChk = document.createElement('input');
    this.revealChk.type = 'checkbox';
    this.revealChk.addEventListener('change', () => this.computeAndRender());
    const revealTxt = document.createElement('span');
    revealTxt.textContent = 'Reveal secrets';
    revealWrap.append(this.revealChk, revealTxt);

    outWrap.append(this.outputEl, this.copyBtn, revealWrap);

    this.errorEl = document.createElement('div');
    this.errorEl.className = 'dnb-syncstring-error text-sm';
    this.errorEl.hidden = true;

    this.root.append(this.inputsEl, outWrap, this.errorEl);
    this.appendChild(this.root);
  }

  private mountRows(): void {
    this.inputsEl.innerHTML = '';
    this.displayNodes.clear();
    this.editors.clear();

    const missing = findMissingPlaceholders(
      this.config.resultTemplate,
      this.config.fields,
    );
    if (missing.length)
      this.showError(
        `Template references missing slugs: ${missing.join(', ')}`,
      );
    else this.clearError();

    for (const field of this.config.fields) {
      const row = document.createElement('div');
      row.className = 'dnb-syncstring-row flex flex-col gap-1';

      const label = document.createElement('div');
      label.className = 'dnb-syncstring-label text-sm';
      label.textContent = field.label;

      const display = document.createElement('div');
      display.className = 'dnb-syncstring-display flex items-center gap-2';

      const text = document.createElement('span');
      text.className =
        'dnb-syncstring-display-text px-2 py-1 border rounded min-h-[2rem] inline-flex items-center';
      text.textContent = this.displayValue(field);

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'dnb-syncstring-edit-btn px-2 py-1 border rounded';
      editBtn.setAttribute('aria-label', `Edit ${field.label}`);
      editBtn.textContent = '✎';
      editBtn.addEventListener('click', () => this.enterEdit(field.slug));

      display.append(text, editBtn);

      const edit = document.createElement('div');
      edit.className = 'dnb-syncstring-edit hidden items-center gap-2';

      const input = document.createElement('input');
      input.autocomplete = 'off'; // autocomplete off
      input.setAttribute('data-lpignore', 'true'); // lastpass autocomplete off
      input.className = 'dnb-syncstring-input border rounded px-2 py-1';
      input.type = field.type;
      input.placeholder = field.placeholder ?? '';
      input.value = this.state.get(field.slug) ?? field.value ?? field.slug;
      if (field.pattern) input.pattern = field.pattern;
      if (field.required) input.required = true;

      // Respect current input visibility state on mount
      if (field.type === 'password' && this.revealedInputs.has(field.slug)) {
        input.type = 'text';
      }

      // Per-field INPUT reveal toggle (password + revealToggle)
      let perRevealBtn: HTMLButtonElement | null = null;
      if (field.type === 'password' && field.revealToggle) {
        perRevealBtn = document.createElement('button');
        perRevealBtn.type = 'button';
        perRevealBtn.className =
          'dnb-syncstring-reveal-input px-2 py-1 border rounded';
        const updateBtnLabel = () => {
          perRevealBtn!.textContent = this.revealedInputs.has(field.slug)
            ? 'Hide'
            : 'Show';
        };
        updateBtnLabel();
        perRevealBtn.addEventListener('click', () => {
          if (this.revealedInputs.has(field.slug)) {
            this.revealedInputs.delete(field.slug); // input hidden
            input.type = 'password';
          } else {
            this.revealedInputs.add(field.slug); // input visible
            input.type = 'text';
          }
          updateBtnLabel();
          // Update only the display mirror (for the inline preview), not the result masking
          text.textContent = this.displayValue(field, input.value);
        });
      }

      const saveBtn = document.createElement('button');
      saveBtn.type = 'button';
      saveBtn.className = 'dnb-syncstring-save px-2 py-1 border rounded';
      saveBtn.textContent = 'Save';

      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'dnb-syncstring-cancel px-2 py-1 border rounded';
      cancelBtn.textContent = 'Cancel';

      const onInput = () => {
        this.state.set(field.slug, input.value);
        this.activeSlug = field.slug;
        this.debouncedCompute();
        text.textContent = this.displayValue(field, input.value);
      };
      input.addEventListener('input', onInput);

      saveBtn.addEventListener('click', () => this.exitEdit(field.slug, true));
      cancelBtn.addEventListener('click', () => {
        input.value = this.state.get(field.slug) ?? field.value ?? field.slug;
        this.activeSlug = null;
        this.exitEdit(field.slug, false);
        this.computeAndRender();
      });

      // assemble editor row
      edit.append(input);
      if (perRevealBtn) edit.append(perRevealBtn);
      edit.append(saveBtn, cancelBtn);

      row.append(label, display, edit);
      this.inputsEl.appendChild(row);

      this.displayNodes.set(field.slug, {
        editBtn,
        el: text,
        row,
        slug: field.slug,
      });
      this.editors.set(field.slug, edit);
    }
  }

  private displayValue(field: SyncField, raw?: string): string {
    const entered = raw ?? this.state.get(field.slug) ?? '';
    const effective =
      entered.length >= this.config.threshold
        ? entered
        : (field.value ?? field.slug);
    // Mask only if password AND global result reveal is OFF.
    // Note: per-field input reveal is intentionally ignored here (it only controls the editor input visibility).
    const revealResult = this.revealChk?.checked ?? false;
    if (field.type === 'password' && !revealResult)
      return effective ? '***' : '';
    return effective;
  }

  private getField(slug: string): SyncField | undefined {
    return this.config.fields.find((f) => f.slug === slug);
  }

  /** Close all editors; if commit=true, save values. Reset password INPUT reveal when inactive. */
  private closeAllEditors(commit: boolean): void {
    for (const [slug, editor] of this.editors) {
      if (editor.classList.contains('hidden')) continue;

      const dn = this.displayNodes.get(slug);
      if (!dn) continue;

      const input = editor.querySelector('input') as HTMLInputElement | null;
      const field = this.getField(slug);

      if (commit && input) {
        this.state.set(slug, input.value);
        if (field) dn.el.textContent = this.displayValue(field, input.value);
      } else if (!commit) {
        if (input) input.value = this.state.get(slug) ?? '';
        if (field) dn.el.textContent = this.displayValue(field);
      }

      // Reset INPUT reveal (edit-mode only) when editor closes
      if (field?.type === 'password') {
        this.revealedInputs.delete(slug);
        if (input) input.type = 'password';
        const btn = editor.querySelector(
          '.dnb-syncstring-reveal-input',
        ) as HTMLButtonElement | null;
        if (btn) btn.textContent = 'Show';
      }

      editor.classList.add('hidden');
      editor.classList.remove('flex');
      dn.row
        .querySelector('.dnb-syncstring-display')
        ?.classList.remove('hidden');
    }

    this.activeSlug = null;
    this.computeAndRender();
  }

  /** Enforce single-open editor and auto-save others */
  private enterEdit(slug: string): void {
    this.closeAllEditors(true); // auto-save other editor before opening this one
    this.activeSlug = slug;
    const dn = this.displayNodes.get(slug);
    const ed = this.editors.get(slug);
    if (!dn || !ed) return;

    dn.row.querySelector('.dnb-syncstring-display')?.classList.add('hidden');
    ed.classList.remove('hidden');
    ed.classList.add('flex');

    (ed.querySelector('input') as HTMLInputElement | null)?.focus();
    this.computeAndRender();
  }

  private exitEdit(slug: string, commit: boolean): void {
    const dn = this.displayNodes.get(slug);
    const ed = this.editors.get(slug);
    if (!dn || !ed) return;

    const input = ed.querySelector('input') as HTMLInputElement | null;
    const field = this.getField(slug);

    if (commit && input) {
      this.state.set(slug, input.value);
      if (field) dn.el.textContent = this.displayValue(field, input.value);
    }

    // Reset INPUT reveal on exit
    if (field?.type === 'password') {
      this.revealedInputs.delete(slug);
      if (input) input.type = 'password';
      const btn = ed.querySelector(
        '.dnb-syncstring-reveal-input',
      ) as HTMLButtonElement | null;
      if (btn) btn.textContent = 'Show';
    }

    ed.classList.add('hidden');
    ed.classList.remove('flex');
    dn.row.querySelector('.dnb-syncstring-display')?.classList.remove('hidden');

    this.activeSlug = null;
    this.computeAndRender();
  }

  private updateDebounce(): void {
    this.debouncedCompute = debounce(
      () => this.computeAndRender(),
      this.config.debounceMs,
    );
  }

  private computeAndRender(): void {
    try {
      const raw = this.getValues();
      const resolved = resolveWithFallback(
        raw,
        this.config.fields,
        this.config.threshold,
      );

      // RESULT masking uses ONLY the global reveal toggle
      const masked = valuesForMask(
        resolved,
        this.config.fields,
        this.revealChk?.checked ?? false,
      );
      const visible = applyTemplate(this.config.resultTemplate, masked);

      const highlighted = this.activeSlug
        ? highlightActive(this.config.resultTemplate, masked, this.activeSlug)
        : escapeHtml(visible);

      this.outputEl.innerHTML = highlighted;

      // keep display mirrors in sync (non-edit rows)
      for (const f of this.config.fields) {
        const dn = this.displayNodes.get(f.slug);
        if (dn) dn.el.textContent = this.displayValue(f);
      }

      this.dispatchEvent(
        new CustomEvent('dnb-syncstring:change', {
          bubbles: true,
          detail: {
            fields: raw,
            value: this.getResult(true), // unmasked full value for programmatic use
          },
        }),
      );
    } catch (err) {
      console.error('[dnb-syncstring] Compute error:', err);
      this.showError('An error occurred while building the string.');
    }
  }

  private async handleCopy(): Promise<void> {
    const raw = this.getResult(true);
    if (!raw) {
      this.showError('Nothing to copy yet.');
      return;
    }
    try {
      await navigator.clipboard.writeText(raw);
      this.clearError();
      const orig = this.copyBtn.textContent;
      this.copyBtn.textContent = 'Copied';
      this.copyBtn.disabled = true;
      setTimeout(() => {
        this.copyBtn.textContent = orig ?? 'Copy';
        this.copyBtn.disabled = false;
      }, 900);
    } catch (err) {
      console.error('[dnb-syncstring] Clipboard error:', err);
      this.showError(
        'Failed to copy. Your browser may block clipboard access.',
      );
    }
  }

  private showError(msg: string): void {
    this.errorEl.textContent = msg;
    this.errorEl.hidden = false;
  }
  private clearError(): void {
    this.errorEl.textContent = '';
    this.errorEl.hidden = true;
  }
}

// define once
if (!customElements.get('dnb-syncstring')) {
  customElements.define('dnb-syncstring', DNBSyncString);
}

/*
Usage example:

<dnb-syncstring
  theme="dracula"
  class="w-full max-w-2xl flex flex-col gap-4"
  fields='[
    {"label":"Username","type":"text","slug":"username","placeholder":"octocat"},
    {"label":"Repository","type":"text","slug":"repo","placeholder":"hello-world"},
    {"label":"API key","type":"password","slug":"apiKey","placeholder":"ghp_***","revealToggle":true}
  ]'
  result-template="https://{apiKey}@github.com/{username}/{repo}.git"
  threshold="2"
  debounce="150">
</dnb-syncstring>
*/

/* ---------------------------
Usage examples

1) Tailwind on + dracula preset:
<dnb-syncstring
  theme="dracula"
  tailwind="true"
  tw-theme="dracula"
  fields='[
    {"label":"Username","type":"text","slug":"username","placeholder":"octocat"},
    {"label":"Repository","type":"text","slug":"repo","placeholder":"hello-world"},
    {"label":"API key","type":"password","slug":"apiKey","placeholder":"ghp_***","revealToggle":true}
  ]'
  result-template="https://{apiKey}@github.com/{username}/{repo}.git"
  threshold="2"
  debounce="150">
</dnb-syncstring>

2) Tailwind on + custom layout overrides via "styles":
<dnb-syncstring
  tailwind="true"
  tw-theme="light"
  styles='{
    "root":"max-w-3xl",
    "result":"font-mono text-sm p-3 border rounded bg-transparent",
    "copyBtn":"px-3 py-1.5 border rounded"
  }'>
</dnb-syncstring>

3) Programmatic styles (merge with current):
document.querySelector('dnb-syncstring')?.setStyles({
  root: 'shadow-md',
  result: 'text-xs'
});
---------------------------- */

/*
<dnb-syncstring
  theme="dracula"
  class="w-full max-w-2xl flex flex-col gap-4"
  fields='[
 {"label":"Username","type":"text","slug":"username","placeholder":"octocat"},
    {"label":"Repository","type":"text","slug":"repo","placeholder":"hello-world"},
    {"label":"API key","type":"password","slug":"apiKey","placeholder":"ghp_***","revealToggle":true}
  ]'
  result-template="https://{apiKey}@github.com/{username}/{repo}.git"
  threshold="2"
  debounce="150">
</dnb-syncstring>
*/
