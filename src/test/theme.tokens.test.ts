import { describe, it, expect } from 'vitest';
import { theme, generateTailwindThemeCss } from '@utils/theme';

describe('Tailwind @theme tokens', () => {
  it('emits a @theme block with core variables', () => {
    const css = generateTailwindThemeCss(theme);

    expect(css).toContain('@theme {');
    // Colors
    expect(css).toContain('--color-brand:');
    expect(css).toContain('--color-accent:');
    expect(css).toContain('--color-surface:');
    expect(css).toContain('--color-base:');
    expect(css).toContain('--color-border:');
    expect(css).toContain('--color-warning:');
    expect(css).toContain('--color-info:');
    expect(css).toContain('--color-danger:');
    expect(css).toContain('--color-note:');

    // Radii
    expect(css).toContain('--radius-none:');
    expect(css).toContain('--radius-sm:');
    expect(css).toContain('--radius-md:');
    expect(css).toContain('--radius-lg:');
    expect(css).toContain('--radius-xl:');
    expect(css).toContain('--radius-pill:');

    // Opacity
    expect(css).toContain('--opacity-subtle:');
    expect(css).toContain('--opacity-soft:');
    expect(css).toContain('--opacity-medium:');
    expect(css).toContain('--opacity-strong:');
    expect(css).toContain('--opacity-heavy:');

    // Animation shorthands and keyframes
    expect(css).toContain('--animate-fade:');
    expect(css).toContain('--animate-slide-up:');
    expect(css).toContain('--animate-slide-down:');
    expect(css).toContain('--animate-scale-in:');

    expect(css).toContain('@keyframes fade');
    expect(css).toContain('@keyframes slide-up');
    expect(css).toContain('@keyframes slide-down');
    expect(css).toContain('@keyframes scale-in');
  });

  it('reflects theme values (spot-check a few)', () => {
    const css = generateTailwindThemeCss(theme);

    // These lines are HSL strings derived from your default theme colors.
    // We only assert presence, not exact numeric rounding for robustness.
    expect(css).toMatch(/--color-brand:\s*hsl\(/);
    expect(css).toMatch(/--color-border:\s*hsl\(/);

    // Duration tokens
    expect(css).toContain('--duration-base: 200ms;');
    expect(css).toContain('--duration-fast: 120ms;');

    // Easing tokens
    expect(css).toContain('--ease-in: cubic-bezier(');
    expect(css).toContain('--ease-out: cubic-bezier(');
    expect(css).toContain('--ease-in-out: cubic-bezier(');

    // compare to previous snapshot
    expect(css).toMatchInlineSnapshot(`
      "/* Generated from @utils/theme — do not edit by hand */
      @theme {
        /* Colors */
        --color-brand: hsl(20 100% 50%);
        --color-accent: hsl(199 89% 48%);
        --color-surface: hsl(210 40% 98%);
        --color-base: hsl(226 49% 8%);
        --color-border: hsl(215 25% 27%);
        --color-warning: hsl(38 92% 50%);
        --color-info: hsl(217 91% 60%);
        --color-danger: hsl(0 84% 60%);
        --color-note: hsl(142 71% 45%);

        /* Radii */
        --radius-none: 0px;
        --radius-sm: 2px;
        --radius-md: 6px;
        --radius-lg: 12px;
        --radius-xl: 20px;
        --radius-pill: 9999px;

        /* Opacity */
        --opacity-subtle: 0.08;
        --opacity-soft: 0.15;
        --opacity-medium: 0.28;
        --opacity-strong: 0.45;
        --opacity-heavy: 0.7;

        /* Easing */
        --ease-in: cubic-bezier(0.4, 0.0, 1, 1);
        --ease-out: cubic-bezier(0.0, 0.0, 0.2, 1);
        --ease-in-out: cubic-bezier(0.4, 0.0, 0.2, 1);

        /* Durations */
        --duration-fast: 120ms;
        --duration-base: 200ms;
        --duration-slow: 320ms;
        --duration-slower: 480ms;

        /* Animation shorthands */
        --animate-fade: fade var(--duration-base) var(--ease-out) both;
        --animate-slide-up: slide-up var(--duration-base) var(--ease-out) both;
        --animate-slide-down: slide-down var(--duration-base) var(--ease-out) both;
        --animate-scale-in: scale-in var(--duration-base) var(--ease-out) both;
      }

      /* Keyframes */
      @keyframes fade {
        from { opacity: 0 }
        to { opacity: 1 }
      }
      @keyframes slide-up {
        from { transform: translateY(8px); opacity: 0 }
        to { transform: translateY(0); opacity: 1 }
      }
      @keyframes slide-down {
        from { transform: translateY(-8px); opacity: 0 }
        to { transform: translateY(0); opacity: 1 }
      }
      @keyframes scale-in {
        from { transform: scale(0.96); opacity: 0 }
        to { transform: scale(1); opacity: 1 }
      }
      "
    `);
  });
});
