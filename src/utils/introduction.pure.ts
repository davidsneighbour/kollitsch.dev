/**
 * Server-side rendering of the site introduction (`setup.introduction`).
 */
import MarkdownIt from 'markdown-it';

/** Placeholder in `setup.introduction` that marks the greeting position. */
export const GREETING_PLACEHOLDER = '{$greeting}';

/** Attribute on the empty element that a client script fills with the greeting. */
export const GREETING_SLOT_ATTRIBUTE = 'data-greeting-slot';

const md = new MarkdownIt();
const TOKEN = 'GREETINGSLOTTOKEN';

/**
 * Renders the introduction Markdown to block HTML, so blank lines become
 * separate paragraphs. The greeting placeholder becomes an empty
 * `<span data-greeting-slot></span>` that a client script can fill with a
 * time-of-day greeting. Without JavaScript the span stays empty.
 */
export function renderIntroductionHtml(raw: string): string {
  const html = md.render(raw.split(GREETING_PLACEHOLDER).join(TOKEN)).trim();
  return html.split(TOKEN).join(`<span ${GREETING_SLOT_ATTRIBUTE}></span>`);
}
