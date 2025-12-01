export interface LighthouseRunnerConfig {
  /** URL to audit. */
  url: string;
  /** Directory to store Lighthouse results. */
  outputDir: string;
  /** When true, also write HTML reports generated from the saved JSON. */
  saveHtmlReports: boolean;
  /** Chrome flags to use for headless runs. */
  chromeFlags: string[];
}

export const defaultLighthouseRunnerConfig: LighthouseRunnerConfig = {
  url: 'https://kollitsch.dev/',
  outputDir: 'reports/lighthouse',
  saveHtmlReports: false,
  chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage'],
};
