/**
 * Typed access to the social media setup (`social` section of
 * `src/data/setup.json`). Import from here instead of reading the JSON in
 * components, so every consumer gets the same validated data.
 *
 * @see documentation/content/social-setup.md
 */
import setup from '@data/setup.json' with { type: 'json' };
import type { IconName } from '@utils/icon-names.ts';
import {
  type SocialConfig,
  type SocialNetwork,
  type SocialPlacement,
  networksFor,
  validateSocialConfig,
} from '@utils/social.pure.ts';

export type SocialMediaNetwork = SocialNetwork<IconName>;

export const social: SocialConfig<IconName> = validateSocialConfig(
  setup.social as SocialConfig<IconName>,
);

/** Every configured network, in config order. */
export const socialNetworks: readonly SocialMediaNetwork[] = social.networks;

/** Networks shown at one placement, in config order. */
export function socialNetworksFor(placement: SocialPlacement): SocialMediaNetwork[] {
  return networksFor(social.networks, placement);
}

/** One network by id. Throws if the id is not configured. */
export function getSocialNetwork(id: string): SocialMediaNetwork {
  const network = social.networks.find((item) => item.id === id);
  if (!network) {
    throw new Error(`Social network "${id}" is not configured in src/data/setup.json`);
  }
  return network;
}
