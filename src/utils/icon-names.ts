// Small, hand-maintained registry mapping the icon names used across the
// site to their backing Lucide or Simple Icons Astro component. Unlike the
// old astro-icon setup, this is not generated from the full @iconify-json/*
// icon sets — see issue #1886. Add an entry here only when a new icon is
// actually used somewhere in the site.
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  BookmarkCheck,
  BookOpen,
  BookText,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleX,
  Clock,
  ClockAlert,
  Contact,
  EyeOff,
  FileLock,
  FingerprintPattern,
  Heart,
  House,
  IdCard,
  Info,
  X as LucideX,
  Mail,
  Menu,
  Monitor,
  PanelBottom,
  PanelTop,
  Pencil,
  RefreshCw,
  Rss,
  ScanFace,
  Scissors,
  Search,
  ServerCrash,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Slash,
  Sparkles,
  Star,
  Sun,
  SunDim,
  Tags,
  TimerOff,
  Unlink,
} from '@lucide/astro';
import {
  Bluesky,
  Devdotto,
  Discord,
  Facebook,
  Github,
  Instagram,
  Linuxmint,
  Mastodon,
  Medium,
  Pinterest,
  Raspberrypi,
  Reddit,
  X as SimpleIconsX,
  Telegram,
  Threads,
  Ubuntu,
  Whatsapp,
  Youtube,
} from 'simple-icons-astro';

// The Astro language server needs this loose shape (not astro's internal
// AstroComponentFactory) to accept components returned from both
// @lucide/astro and simple-icons-astro — see @lucide/astro's own
// `AstroComponent` type, which uses the same signature for the same reason.
type IconComponent = (props: Record<string, unknown>) => unknown;

const lucideIcons = {
  archive: Archive,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,
  'book-open': BookOpen,
  'book-text': BookText,
  'bookmark-check': BookmarkCheck,
  calendar: Calendar,
  'chevron-down': ChevronDown,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'circle-x': CircleX,
  clock: Clock,
  'clock-alert': ClockAlert,
  contact: Contact,
  'eye-off': EyeOff,
  'file-lock': FileLock,
  'fingerprint-pattern': FingerprintPattern,
  heart: Heart,
  house: House,
  'id-card': IdCard,
  info: Info,
  mail: Mail,
  menu: Menu,
  monitor: Monitor,
  'panel-bottom': PanelBottom,
  'panel-top': PanelTop,
  pencil: Pencil,
  'refresh-cw': RefreshCw,
  rss: Rss,
  'scan-face': ScanFace,
  scissors: Scissors,
  search: Search,
  'server-crash': ServerCrash,
  'share-2': Share2,
  'shield-alert': ShieldAlert,
  'shield-check': ShieldCheck,
  slash: Slash,
  sparkles: Sparkles,
  star: Star,
  sun: Sun,
  'sun-dim': SunDim,
  tags: Tags,
  'timer-off': TimerOff,
  unlink: Unlink,
  x: LucideX,
} as const satisfies Record<string, IconComponent>;

const simpleIcons = {
  bluesky: Bluesky,
  devdotto: Devdotto,
  discord: Discord,
  facebook: Facebook,
  github: Github,
  instagram: Instagram,
  linuxmint: Linuxmint,
  mastodon: Mastodon,
  medium: Medium,
  pinterest: Pinterest,
  raspberrypi: Raspberrypi,
  reddit: Reddit,
  telegram: Telegram,
  threads: Threads,
  ubuntu: Ubuntu,
  whatsapp: Whatsapp,
  x: SimpleIconsX,
  youtube: Youtube,
} as const satisfies Record<string, IconComponent>;

// Reserved for icons that cannot come from Lucide or Simple Icons — see
// src/components/icons/local/README.md. Keep this empty except for those
// extreme cases; add entries by importing from
// '@components/icons/local/<Name>.astro'.
const localIcons = {} as const satisfies Record<string, IconComponent>;

export type LucideIconName = keyof typeof lucideIcons;
export type SimpleIconsName = keyof typeof simpleIcons;
export type LocalIconName = keyof typeof localIcons;
export type IconName =
  | `lucide:${LucideIconName}`
  | `simple-icons:${SimpleIconsName}`
  | `local:${LocalIconName}`;

export const iconNames: IconName[] = [
  ...(Object.keys(lucideIcons) as LucideIconName[]).map(
    (name) => `lucide:${name}` as const,
  ),
  ...(Object.keys(simpleIcons) as SimpleIconsName[]).map(
    (name) => `simple-icons:${name}` as const,
  ),
  ...(Object.keys(localIcons) as LocalIconName[]).map(
    (name) => `local:${name}` as const,
  ),
];

/**
 * Resolves an {@link IconName} to its backing Lucide, Simple Icons, or local Astro component.
 */
export function getIcon(name: IconName): IconComponent {
  const separatorIndex = name.indexOf(':');
  const set = name.slice(0, separatorIndex);
  const key = name.slice(separatorIndex + 1);

  if (set === 'lucide' && key in lucideIcons) {
    return lucideIcons[key as LucideIconName];
  }

  if (set === 'simple-icons' && key in simpleIcons) {
    return simpleIcons[key as SimpleIconsName];
  }

  if (set === 'local' && key in localIcons) {
    return localIcons[key as LocalIconName];
  }

  throw new Error(`Unknown icon name: "${name}"`);
}
