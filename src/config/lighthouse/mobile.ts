import type { LighthouseProfile } from './types.ts';

const profile: LighthouseProfile = {
  name: 'mobile',
  description: 'Mobile 412×823 — unthrottled, used by CI',
  formFactor: 'mobile',
  screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75 },
  throttlingMethod: 'provided',
  categories: ['performance', 'accessibility', 'best-practices', 'seo'],
};

export default profile;
