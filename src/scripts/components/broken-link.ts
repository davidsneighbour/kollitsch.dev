export const brokenLinkReasons = [
  'redirect-loop',
  'tls-error',
  'timeout',
  'server-error',
  'temporarily-unavailable',
  'unknown',
] as const;

export type BrokenLinkReason = (typeof brokenLinkReasons)[number];

export const brokenLinkReasonLabels = {
  'redirect-loop': 'redirect loop',
  'tls-error': 'TLS error',
  timeout: 'timeout',
  'server-error': 'server error',
  'temporarily-unavailable': 'temporarily unavailable',
  unknown: 'unknown issue',
} satisfies Record<BrokenLinkReason, string>;

const brokenLinkReasonSet = new Set<string>(brokenLinkReasons);
const brokenLinkElementName = 'broken-link';
const generatedMarkerSelector = '[data-broken-link-generated]';

export function isBrokenLinkReason(value: unknown): value is BrokenLinkReason {
  return typeof value === 'string' && brokenLinkReasonSet.has(value);
}

export function resolveBrokenLinkReason(value: unknown): BrokenLinkReason {
  return isBrokenLinkReason(value) ? value : 'unknown';
}

export function getBrokenLinkReasonLabel(reason: BrokenLinkReason): string {
  return brokenLinkReasonLabels[reason];
}

export function getBrokenLinkStatusText(
  reason: BrokenLinkReason,
  checked?: string | null,
): string {
  const checkedText = checked ? `; checked ${checked}` : '';
  return `Link currently unavailable: ${getBrokenLinkReasonLabel(reason)}${checkedText}.`;
}

function findPrecedingAnchor(element: Element): HTMLAnchorElement | null {
  const previous = element.previousElementSibling;
  return previous instanceof HTMLAnchorElement ? previous : null;
}

function injectBrokenLinkStyles(): void {
  if (document.getElementById('broken-link-component-styles')) return;

  const style = document.createElement('style');
  style.id = 'broken-link-component-styles';
  style.textContent = `
broken-link {
  display: inline-flex;
  align-items: baseline;
  margin-inline-start: 0.2em;
  vertical-align: baseline;
}

broken-link[data-broken-link-state='missing-link'] {
  color: var(--color-red-700);
}

.broken-link-marker {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.15em;
  height: 1.15em;
  color: var(--color-amber-700);
  vertical-align: -0.15em;
}

.broken-link-marker svg {
  width: 0.95em;
  height: 0.95em;
  stroke-width: 2.25;
}

[data-theme='dark'] .broken-link-marker {
  color: var(--color-amber-400);
}

.broken-link-tooltip-group {
  position: relative;
  display: inline-flex;
  align-items: center;
  outline: none;
}

.broken-link-tooltip {
  pointer-events: none;
  position: absolute;
  bottom: calc(100% + 0.35em);
  left: 50%;
  z-index: var(--z-50);
  width: max-content;
  max-width: 16rem;
  translate: -50% 0.25rem;
  scale: 0.95;
  border-radius: var(--radius-sm);
  background-color: var(--color-green-700);
  color: var(--color-white);
  padding: 0.375rem 0.75rem;
  font-size: var(--text-xs);
  line-height: 1.2;
  box-shadow: var(--shadow-md);
  opacity: 0;
  transition: opacity 150ms ease, scale 150ms ease, translate 150ms ease;
}

.broken-link-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  width: 0.55em;
  height: 0.55em;
  translate: -50% -50%;
  rotate: 45deg;
  border-radius: 2px;
  background-color: var(--color-green-700);
}

.broken-link-tooltip-group:hover .broken-link-tooltip,
.broken-link-tooltip-group:focus-visible .broken-link-tooltip {
  translate: -50% 0;
  scale: 1;
  opacity: 1;
}

[data-theme='dark'] .broken-link-tooltip,
[data-theme='dark'] .broken-link-tooltip::after {
  background-color: var(--color-green-500);
  color: var(--color-gray-950);
}
`;
  document.head.append(style);
}

function createMarker(statusText: string): HTMLSpanElement {
  const group = document.createElement('span');
  group.className = 'broken-link-tooltip-group';
  group.dataset['brokenLinkGenerated'] = 'true';
  group.setAttribute('tabindex', '0');
  group.setAttribute('role', 'img');
  group.setAttribute('aria-label', statusText);

  const marker = document.createElement('span');
  marker.className = 'broken-link-marker';
  marker.setAttribute('aria-hidden', 'true');
  marker.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18.84 12.25 1.72-1.71a5 5 0 0 0-7.07-7.08l-1.72 1.71"></path><path d="m5.17 11.75-1.71 1.71a5 5 0 0 0 7.07 7.08l1.71-1.71"></path><path d="m8 16 8-8"></path><path d="m2 2 20 20"></path></svg>';

  const tooltip = document.createElement('span');
  tooltip.className = 'broken-link-tooltip';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.setAttribute('aria-hidden', 'true');
  tooltip.textContent = statusText;

  group.append(marker, tooltip);
  return group;
}

function enhanceBrokenLink(element: HTMLElement): void {
  const originalReason = element.getAttribute('reason');
  const reason = resolveBrokenLinkReason(originalReason);
  const checked = element.getAttribute('checked');
  const precedingAnchor = findPrecedingAnchor(element);
  const href = element.getAttribute('href') ?? precedingAnchor?.getAttribute('href') ?? null;
  const statusText = getBrokenLinkStatusText(reason, checked);

  element.querySelector(generatedMarkerSelector)?.remove();
  element.dataset['brokenLink'] = '';
  element.dataset['brokenLinkReason'] = reason;
  element.dataset['brokenLinkStatus'] = 'currently-unavailable';
  element.dataset['brokenLinkValidReason'] = String(reason === originalReason);
  element.setAttribute('role', 'note');
  element.setAttribute('aria-label', statusText);

  if (checked) {
    element.dataset['brokenLinkChecked'] = checked;
  } else {
    delete element.dataset['brokenLinkChecked'];
  }

  if (href) {
    element.dataset['brokenLinkHref'] = href;
    element.dataset['brokenLinkState'] = 'linked';
  } else {
    delete element.dataset['brokenLinkHref'];
    element.dataset['brokenLinkState'] = 'missing-link';
  }

  element.append(createMarker(statusText));
}

export function defineBrokenLink(): void {
  if (typeof window === 'undefined' || !('customElements' in window)) return;

  injectBrokenLinkStyles();

  if (customElements.get(brokenLinkElementName)) return;

  customElements.define(
    brokenLinkElementName,
    class BrokenLinkElement extends HTMLElement {
      public connectedCallback(): void {
        enhanceBrokenLink(this);
      }

      public static get observedAttributes(): string[] {
        return ['checked', 'href', 'reason'];
      }

      public attributeChangedCallback(): void {
        if (this.isConnected) enhanceBrokenLink(this);
      }
    },
  );
}
