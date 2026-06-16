import type { LighthouseProfile } from './types.ts';

const profile: LighthouseProfile = {
  name: 'desktop',
  description: 'Desktop 1350×940 — unthrottled, used by CI',
  formFactor: 'desktop',
  screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1 },
  throttlingMethod: 'provided',
  categories: ['performance', 'accessibility', 'best-practices', 'seo'],
};

export default profile;
