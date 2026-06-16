export interface ThrottlingSettings {
  rttMs: number;
  throughputKbps: number;
  requestLatencyMs: number;
  downloadThroughputKbps: number;
  uploadThroughputKbps: number;
  cpuSlowdownMultiplier: number;
}

export interface LighthouseProfile {
  /** Short id, used as --config=<name> argument. */
  name: string;
  /** One-line description shown in the interactive runner. */
  description: string;
  formFactor: 'mobile' | 'desktop';
  screenEmulation: {
    mobile: boolean;
    width: number;
    height: number;
    deviceScaleFactor: number;
  };
  /**
   * `'provided'` — use the network as-is (no simulation, for CI).
   * `'simulate'` — software-simulated throttling (for local profiling).
   */
  throttlingMethod: 'provided' | 'simulate';
  /** Only relevant when throttlingMethod === 'simulate'. */
  throttling?: ThrottlingSettings;
  /** Lighthouse categories to run. */
  categories: string[];
}
