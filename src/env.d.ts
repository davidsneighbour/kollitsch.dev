/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// biome-ignore lint/correctness/noUnusedVariables: this is used for type definitions
interface Window {
  theme: {
    setTheme: (theme: "auto" | "dark" | "light") => void;
    getTheme: () => "auto" | "dark" | "light";
    getSystemTheme: () => "light" | "dark";
    getDefaultTheme: () => "auto" | "dark" | "light";
  };
}
