import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

/**
 * Render the introduction with a time-based greeting.
 */
export function renderIntroduction(
  introRaw: string,
  greetings: Record<string, string>,
): string {
  const hour = new Date().getHours();
  const greeting =
    hour >= 5 && hour < 12
      ? greetings.morning
      : hour >= 12 && hour < 17
        ? greetings.afternoon
        : hour >= 17 && hour < 21
          ? greetings.evening
          : hour >= 21 || hour < 5
            ? greetings.night
            : greetings.default;

  const introFinal = introRaw.replace('{$greeting}', greeting ?? '');
  return md.renderInline(introFinal);
}
