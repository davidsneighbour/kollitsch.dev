/**
 * Escape raw HTML entities to avoid rendering.
 */
export function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Render a nested HTML table for debugging complex data structures.
 * Automatically escapes all values to preserve raw representation.
 */
export function renderDebugTable(value: unknown): string {
  if (Array.isArray(value)) {
    return `<table><tbody>${value
      .map((item, idx) => `<tr><td>${escapeHTML(String(idx))}</td><td>${renderDebugTable(item)}</td></tr>`)
      .join('')}</tbody></table>`;
  }

  if (value && typeof value === 'object') {
    return `<table><tbody>${Object.entries(value as Record<string, unknown>)
      .map(([key, val]) => `<tr><th>${escapeHTML(key)}</th><td>${renderDebugTable(val)}</td></tr>`)
      .join('')}</tbody></table>`;
  }

  return escapeHTML(String(value));
}
