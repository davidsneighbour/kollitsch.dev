import type { LighthouseProfile } from './types.ts';

const profile: LighthouseProfile = {
  name: 'mobile-3g',
  description: 'Mobile 412×823 — 3G (300 ms RTT, 400 Kbps, 4× CPU)',
  formFactor: 'mobile',
  screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75 },
  throttlingMethod: 'simulate',
  throttling: {
    rttMs: 300,
    throughputKbps: 400,
    requestLatencyMs: 750,
    downloadThroughputKbps: 400,
    uploadThroughputKbps: 400,
    cpuSlowdownMultiplier: 4,
  },
  categories: ['performance', 'accessibility', 'best-practices', 'seo'],
};

export default profile;
