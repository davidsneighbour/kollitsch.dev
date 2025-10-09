declare module '@rollup/plugin-yaml' {
  import type { Plugin } from 'vite';
  const yaml: (options?: unknown) => Plugin;
  export default yaml;
}
