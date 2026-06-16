import type { LighthouseProfile } from './types.ts';
import mobile from './mobile.ts';
import desktop from './desktop.ts';
import mobileSlow4g from './mobile-slow4g.ts';
import mobile3g from './mobile-3g.ts';
import desktopCable from './desktop-cable.ts';

export type { LighthouseProfile };

export const configs: Record<string, LighthouseProfile> = {
  mobile,
  desktop,
  'mobile-slow4g': mobileSlow4g,
  'mobile-3g': mobile3g,
  'desktop-cable': desktopCable,
};

/** Builds the lighthouse Config object from a profile. */
export function buildLhConfig(profile: LighthouseProfile) {
  return {
    extends: 'lighthouse:default' as const,
    settings: {
      formFactor: profile.formFactor,
      screenEmulation: { ...profile.screenEmulation, disabled: false },
      throttlingMethod: profile.throttlingMethod,
      ...(profile.throttling ? { throttling: profile.throttling } : {}),
      onlyCategories: profile.categories,
    },
  };
}

/** Extract integer scores (0–100) from a Lighthouse result. */
export function extractScores(categories: Record<string, { score: number | null }>): Record<string, number> {
  return Object.fromEntries(
    Object.entries(categories).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)]),
  );
}
