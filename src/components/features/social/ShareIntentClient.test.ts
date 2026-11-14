// @vitest-environment node

import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { shareToInstance } from './ShareIntentClient.ts';

const prompt = vi.fn();
const open = vi.fn();
const assign = vi.fn();
const getItem = vi.fn();
const setItem = vi.fn();
const popup = { opener: {} };
const link = {
  dataset: {
    shareInstance: JSON.stringify({
      default: 'mas.to',
      prompt: 'Choose your server',
      storageKey: 'mastodon_instance_url',
    }),
    shareTemplate: 'https://{instance}/share?text={title}%20{url}',
    shareValues: JSON.stringify({
      title: 'A & B',
      url: 'https://kollitsch.dev/example/',
    }),
  },
} as unknown as HTMLAnchorElement;

beforeEach(() => {
  vi.resetAllMocks();
  open.mockReturnValue(popup);
  vi.stubGlobal('window', { location: { assign }, open, prompt });
  vi.stubGlobal('localStorage', { getItem, setItem });
});
afterEach(() => vi.unstubAllGlobals());

it('prefills the saved server, allows changes, and saves the normalised choice', () => {
  getItem.mockReturnValue('mastodon.social');
  prompt.mockReturnValue('https://MAS.TO/@someone');
  shareToInstance(link);
  expect(prompt).toHaveBeenCalledWith('Choose your server', 'mastodon.social');
  expect(setItem).toHaveBeenCalledWith('mastodon_instance_url', 'mas.to');
  expect(new URL(open.mock.calls[0]?.[0]).searchParams.get('text')).toBe(
    'A & B https://kollitsch.dev/example/',
  );
  expect(popup.opener).toBeNull();
});
it('does not save or navigate when cancelled', () => {
  prompt.mockReturnValue(null);
  shareToInstance(link);
  expect(setItem).not.toHaveBeenCalled();
  expect(open).not.toHaveBeenCalled();
  expect(assign).not.toHaveBeenCalled();
});
it('retries invalid input and permits cancellation', () => {
  prompt.mockReturnValueOnce('javascript:alert(1)').mockReturnValueOnce(null);
  shareToInstance(link);
  expect(prompt).toHaveBeenCalledTimes(2);
  expect(open).not.toHaveBeenCalled();
});
it('shares even when local storage is blocked', () => {
  getItem.mockImplementation(() => {
    throw new Error('blocked');
  });
  setItem.mockImplementation(() => {
    throw new Error('blocked');
  });
  prompt.mockReturnValue('mas.to');
  shareToInstance(link);
  expect(prompt).toHaveBeenCalledWith('Choose your server', 'mas.to');
  expect(open).toHaveBeenCalledOnce();
});
it('uses the current tab when the browser blocks a popup', () => {
  prompt.mockReturnValue('mas.to');
  open.mockReturnValue(null);
  shareToInstance(link);
  expect(assign).toHaveBeenCalledWith(
    expect.stringContaining('https://mas.to/share?'),
  );
});
