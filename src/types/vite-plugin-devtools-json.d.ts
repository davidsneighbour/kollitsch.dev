declare module 'vite-plugin-devtools-json' {
  import type { PluginOption } from 'vite';
  const devtoolsJson: (options?: unknown) => PluginOption;
  export default devtoolsJson;
}
