import type { Element, ElementContent, Parent, Root, Text } from 'hast';

/**
 * A parsed Internet Archive (Wayback Machine) snapshot URL.
 */
export interface ArchiveSnapshot {
  /** The full snapshot URL, for example `https://web.archive.org/web/20230926190851/https://example.com/`. */
  snapshotUrl: string;
  /** The archived original URL, as written after the timestamp. */
  originalUrl: string;
  /** The raw Wayback timestamp (4 to 14 digits). */
  timestamp: string;
  /** The capture date as `YYYY-MM-DD`, when the timestamp contains a valid day. */
  date?: string;
}

const SNAPSHOT_PATTERN =
  /^https?:\/\/web\.archive\.org\/web\/(\d{4,14})(?:[a-z]{2}_)?\/(.+)$/i;

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

const MARKER_ATTRIBUTE = 'dataArchiveLinkMarker';

/**
 * Parses an Internet Archive snapshot URL. Returns `null` for every other URL,
 * including Wayback listing pages without a snapshot timestamp.
 */
export function parseArchiveUrl(href: unknown): ArchiveSnapshot | null {
  if (typeof href !== 'string') return null;

  const match = SNAPSHOT_PATTERN.exec(href.trim());
  if (!match) return null;

  const [, timestamp = '', originalUrl = ''] = match;
  const snapshot: ArchiveSnapshot = {
    originalUrl,
    snapshotUrl: href.trim(),
    timestamp,
  };

  const date = timestampToDate(timestamp);
  if (date) snapshot.date = date;

  return snapshot;
}

function timestampToDate(timestamp: string): string | undefined {
  if (timestamp.length < 8) return undefined;

  const year = Number(timestamp.slice(0, 4));
  const month = Number(timestamp.slice(4, 6));
  const day = Number(timestamp.slice(6, 8));
  const parsed = new Date(Date.UTC(year, month - 1, day));

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return undefined;
  }

  return `${timestamp.slice(0, 4)}-${timestamp.slice(4, 6)}-${timestamp.slice(6, 8)}`;
}

/**
 * Formats a `YYYY-MM-DD` date in British long form, for example `26 September 2023`.
 */
export function formatArchiveDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const monthName = MONTH_NAMES[(month ?? 1) - 1] ?? '';
  return `${day} ${monthName} ${year}`;
}

/**
 * Returns the visible tooltip text for an archived link.
 */
export function getArchiveLinkTooltip(snapshot: ArchiveSnapshot): string {
  const when = snapshot.date ? ` from ${formatArchiveDate(snapshot.date)}` : '';
  return `Archived copy${when} via the Internet Archive. The original page is no longer available.`;
}

/**
 * Returns the screen-reader text appended to the link's accessible name.
 */
export function getArchiveLinkScreenReaderText(
  snapshot: ArchiveSnapshot,
): string {
  const when = snapshot.date ? ` from ${formatArchiveDate(snapshot.date)}` : '';
  return ` (archived copy${when})`;
}

function text(value: string): Text {
  return { type: 'text', value };
}

function element(
  tagName: string,
  properties: Element['properties'],
  children: ElementContent[] = [],
): Element {
  return { children, properties, tagName, type: 'element' };
}

/**
 * Builds the decorative icon and tooltip that follows the link text.
 *
 * The marker sits inside the link, so it adds no extra focus stop; the
 * tooltip shows while the link is hovered or keyboard-focused.
 */
export function createArchiveMarker(
  snapshot: ArchiveSnapshot,
  iconPath: string,
): Element {
  return element(
    'span',
    {
      ariaHidden: 'true',
      className: [
        'not-prose',
        // Without anchor positioning, the marker is the tooltip's
        // containing block; with it, the tooltip is placed against the
        // icon and can shift away from the edges of the text column.
        'relative',
        'supports-[position-area:top]:static',
        'ms-[0.2em]',
        'inline-flex',
        'align-[-0.1em]',
        // Copying the paragraph must not pick up the tooltip text.
        'select-none',
      ],
      [MARKER_ATTRIBUTE]: '',
    },
    [
      element(
        'svg',
        {
          ariaHidden: 'true',
          className: [
            'size-[0.9em]',
            'text-gray-600',
            'dark:text-gray-400',
            '[anchor-name:--archive-link]',
          ],
          fill: 'currentColor',
          focusable: 'false',
          viewBox: '0 0 24 24',
          xmlns: 'http://www.w3.org/2000/svg',
        },
        [element('path', { d: iconPath })],
      ),
      element(
        'span',
        {
          className: [
            'pointer-events-none',
            'absolute',
            'bottom-[calc(100%+0.35em)]',
            'left-1/2',
            'z-50',
            'w-max',
            'max-w-64',
            '-translate-x-1/2',
            'translate-y-1',
            'scale-95',
            'rounded-sm',
            'bg-primary-700',
            'px-3',
            'py-1.5',
            'text-xs',
            'font-normal',
            'whitespace-normal',
            'text-white',
            'opacity-0',
            'shadow-md',
            'transition-[opacity,scale,translate]',
            'duration-150',
            'ease-out',
            'after:absolute',
            'after:top-full',
            'after:left-1/2',
            'after:size-2.5',
            'after:-translate-x-1/2',
            'after:-translate-y-1/2',
            'after:rotate-45',
            'after:rounded-xs',
            'after:bg-primary-700',
            'group-hover/archive:translate-y-0',
            'group-hover/archive:scale-100',
            'group-hover/archive:opacity-100',
            'group-focus-visible/archive:translate-y-0',
            'group-focus-visible/archive:scale-100',
            'group-focus-visible/archive:opacity-100',
            'motion-reduce:translate-y-0',
            'motion-reduce:scale-100',
            'motion-reduce:transition-opacity',
            'dark:bg-primary-500',
            'dark:text-gray-950',
            'dark:after:bg-primary-500',
            'supports-[position-area:top]:inset-auto',
            'supports-[position-area:top]:mb-[0.35em]',
            'supports-[position-area:top]:translate-x-0',
            'supports-[position-area:top]:[position-anchor:--archive-link]',
            'supports-[position-area:top]:[position-area:top]',
            'supports-[position-area:top]:[position-try-fallbacks:top_span-right,top_span-left]',
            'supports-[position-area:top]:after:hidden',
          ],
        },
        [text(getArchiveLinkTooltip(snapshot))],
      ),
    ],
  );
}

function nowrap(children: ElementContent[]): Element {
  return element('span', { className: ['whitespace-nowrap'] }, children);
}

/**
 * Keeps the marker on the same line as the last word of the link text.
 */
function attachMarker(anchor: Element, marker: Element): void {
  const last = anchor.children.at(-1);
  if (!last) return;

  const rest = anchor.children.slice(0, -1);

  if (last.type === 'text') {
    const trimmed = last.value.trimEnd();
    const splitAt = Math.max(
      trimmed.lastIndexOf(' '),
      trimmed.lastIndexOf('\n'),
      trimmed.lastIndexOf('\t'),
    );
    const before = trimmed.slice(0, splitAt + 1);
    const lastWord = trimmed.slice(splitAt + 1);

    anchor.children = [
      ...rest,
      ...(before ? [text(before)] : []),
      nowrap([text(lastWord), marker]),
    ];
    return;
  }

  anchor.children = [...rest, nowrap([last, marker])];
}

function isElement(node: unknown): node is Element {
  return (
    typeof node === 'object' &&
    node !== null &&
    (node as { type?: unknown }).type === 'element'
  );
}

function decorateAnchor(anchor: Element, iconPath: string): void {
  if (anchor.properties['dataArchiveLink'] !== undefined) return;

  const snapshot = parseArchiveUrl(anchor.properties['href']);
  if (!snapshot || anchor.children.length === 0) return;

  // hast always stores `className` as a list.
  const existingClasses = anchor.properties['className'];
  const classes = Array.isArray(existingClasses)
    ? existingClasses.map(String)
    : [];

  anchor.properties['className'] = [...classes, 'group/archive'];
  anchor.properties['dataArchiveLink'] = '';
  anchor.properties['dataArchiveOriginal'] = snapshot.originalUrl;
  if (snapshot.date) anchor.properties['dataArchiveDate'] = snapshot.date;

  attachMarker(anchor, createArchiveMarker(snapshot, iconPath));
  anchor.children.push(
    element('span', { className: ['sr-only'] }, [
      text(getArchiveLinkScreenReaderText(snapshot)),
    ]),
  );
}

/**
 * Marks every Internet Archive snapshot link in a hast tree with the
 * Internet Archive icon, a tooltip, and screen-reader text. Running it
 * twice on the same tree changes nothing.
 */
export function decorateArchiveLinks(
  tree: Root | Parent,
  iconPath: string,
): void {
  const walk = (node: Root | Parent | Element): void => {
    for (const child of node.children) {
      if (!isElement(child)) continue;
      if (child.tagName === 'a') {
        decorateAnchor(child, iconPath);
        continue;
      }
      walk(child);
    }
  };

  walk(tree);
}
