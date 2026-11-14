import type { ShareValues, SocialShareInstance } from '@utils/social.pure.ts';
import { buildShareUrl, normalizeShareInstance } from '@utils/social.pure.ts';

/** Loaded and called only after a visitor activates an instance-aware link. */
export function shareToInstance(link: HTMLAnchorElement): void {
  const settings = JSON.parse(
    link.dataset['shareInstance'] ?? '{}',
  ) as SocialShareInstance;
  const values = JSON.parse(link.dataset['shareValues'] ?? '{}') as ShareValues;
  const template = link.dataset['shareTemplate'] ?? '';
  let previous = settings.default;
  try {
    previous = localStorage.getItem(settings.storageKey) || previous;
  } catch {
    // Private browsing and blocked storage must not prevent sharing.
  }
  let prompt = settings.prompt;
  while (true) {
    const input = window.prompt(prompt, previous);
    if (input === null) return;
    previous = input;
    let instance: string;
    try {
      instance = normalizeShareInstance(input);
    } catch {
      prompt = `Enter a valid HTTPS server domain. ${settings.prompt}`;
      continue;
    }
    try {
      localStorage.setItem(settings.storageKey, instance);
    } catch {
      // The preference is optional; continue without saving it.
    }
    const href = buildShareUrl(template, { ...values, instance });
    // Lazy loading can outlast transient user activation. If the browser blocks
    // a new tab, use the current tab instead of losing the visitor's share.
    const popup = window.open(href, '_blank');
    if (popup) popup.opener = null;
    else window.location.assign(href);
    return;
  }
}
