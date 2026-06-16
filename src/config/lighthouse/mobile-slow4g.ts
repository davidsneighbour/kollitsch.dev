import type { LighthouseProfile } from './types.ts';

const profile: LighthouseProfile = {
  name: 'mobile-slow4g',
  description: 'Mobile 412×823 — Slow 4G (150 ms RTT, 1.6 Mbps, 4× CPU)',
  formFactor: 'mobile',
  screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75 },
  throttlingMethod: 'simulate',
  throttling: {
    rttMs: 150,
    throughputKbps: 1638.4,
    requestLatencyMs: 562.5,
    downloadThroughputKbps: 1474.56,
    uploadThroughputKbps: 675,
    cpuSlowdownMultiplier: 4,
  },
  categories: ['performance', 'accessibility', 'best-practices', 'seo'],
};

export default profile;
