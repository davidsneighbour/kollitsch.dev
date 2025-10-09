declare module '@fbraem/rollup-plugin-toml' {
  import type { Plugin } from 'vite';
  const toml: (options?: unknown) => Plugin;
  export default toml;
}
