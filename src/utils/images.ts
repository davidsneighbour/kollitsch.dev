/**
 * Strip basic markdown/HTML for alt text.
 * @param str Arbitrary text
 * @returns Sanitized plain string
 */
export function stripMarkup(str: string): string {
  return str.replace(/[#_*~`>[\]()\-!]/g, '').replace(/<\/?[^>]+(>|$)/g, '');
}
