// Stub for @dnbhq/release-config 1.0.1 — dist/ was not included in that tarball.
// Remove this file once the package is republished with the compiled output.
declare module '@dnbhq/release-config' {
  import type { Config } from 'release-it';

  interface ReleaseConfigScopes {
    minorTypes?: string[];
    patchTypes?: string[];
    minorExclusionSubscopes?: Record<string, string[]>;
  }

  interface ReleaseConfigOptions {
    changelogFile?: string;
    githubTokenRef?: string;
    scopes?: ReleaseConfigScopes;
    repository?: {
      fallbackUrl?: string;
      packageJsonPath?: string;
    };
    overrides?: Partial<Config>;
  }

  export function createReleaseConfig(options?: ReleaseConfigOptions): Config;
}
