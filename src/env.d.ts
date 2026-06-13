/**
 * adding global types to the Window object.
 */
interface Window {
  theme: {
    setTheme: (theme: 'auto' | 'dark' | 'light') => void;
    getTheme: () => 'auto' | 'dark' | 'light';
    getSystemTheme: () => 'light' | 'dark';
    getDefaultTheme: () => 'auto' | 'dark' | 'light';
  };
}

/**
 * environment variables type declaration
 * @see https://docs.astro.build/en/guides/environment-variables/
 */
interface ImportMetaEnv {
  readonly YOUTUBE_API_KEY: string;
  readonly FRESHRSS_BASE_URL: string;
  readonly FRESHRSS_USERNAME: string;
  readonly FRESHRSS_API_PASSWORD: string;
  readonly GH_TOKEN: string;
  readonly GITHUB_TOKEN: string;
}
