/**
 * Content for the SocialSpec well-known files in `src/pages/.well-known/`.
 *
 * Edit this file to change what `following.opml`, `about.md`, and
 * `contact.vcf` publish. Values that already exist elsewhere (site
 * description, social profiles, blogroll) are read from their source
 * files so that there is one place to change them. The social profiles are
 * the networks with `show.socialspec` in `src/data/setup.json`.
 *
 * @see documentation/content/socialspec.md
 */
import blogroll from '@content/blogroll.json' with { type: 'json' };
import setup from '@data/setup.json' with { type: 'json' };
import { socialNetworksFor } from '@data/social.ts';
import type {
  AboutConfig,
  ContactConfig,
  FollowingConfig,
  ProfileLink,
} from '@utils/socialspec.pure';

const SITE_URL = setup.url;
const AVATAR_URL = new URL('/.well-known/avatar', SITE_URL).toString();

function profileLinks(): ProfileLink[] {
  return socialNetworksFor('socialspec').map((network) => ({
    label: network.label,
    url: network.profile.url,
  }));
}

export const following: FollowingConfig = {
  title: `${setup.author.name}'s followed feeds`,
  ownerName: setup.author.name,
  ownerUrl: setup.author.url,
  // Only blogroll entries with a feed URL are subscriptions.
  feeds: blogroll.items.flatMap((item) =>
    'rss' in item && item.rss
      ? [
          {
            name: item.name,
            feedUrl: item.rss,
            siteUrl: item.url,
            ...('description' in item && item.description ? { description: item.description } : {}),
          },
        ]
      : [],
  ),
};

export const about: AboutConfig = {
  summary: setup.description,
  name: setup.author.name,
  image: AVATAR_URL,
  // The introduction starts with a time-based greeting placeholder.
  body: setup.introduction.replace('{$greeting}', '').trim(),
  links: [{ label: setup.title, url: SITE_URL }, ...profileLinks()],
};

export const contact: ContactConfig = {
  fullName: setup.author.name,
  givenName: 'Patrick',
  familyName: 'Kollitsch',
  nickname: 'davidsneighbour',
  // Set a public address here to publish an EMAIL property.
  email: '',
  url: SITE_URL,
  photo: { url: AVATAR_URL, mediaType: 'image/png' },
  note: setup.description,
  timezone: setup.timezone,
  locality: 'Koh Samui',
  country: 'Thailand',
  languages: ['en', 'de'],
  socialProfiles: profileLinks().map((link) => ({
    service: link.label,
    url: link.url,
  })),
};
