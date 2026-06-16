import type { LighthouseProfile } from './types.ts';

const profile: LighthouseProfile = {
  name: 'desktop-cable',
  description: 'Desktop 1350×940 — fast cable (40 ms RTT, 10 Mbps, 1× CPU)',
  formFactor: 'desktop',
  screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1 },
  throttlingMethod: 'simulate',
  throttling: {
    rttMs: 40,
    throughputKbps: 10240,
    requestLatencyMs: 0,
    downloadThroughputKbps: 10240,
    uploadThroughputKbps: 10240,
    cpuSlowdownMultiplier: 1,
  },
  categories: ['performance', 'accessibility', 'best-practices', 'seo'],
};

export default profile;
