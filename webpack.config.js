import config from '@davidsneighbour/webpack-config';
import { dirname, resolve as _resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let localConfig = {
  context: _resolve(__dirname, 'assets'),
  entry: {
    main: join(__dirname, 'assets/js', 'script.ts'),
    // theme: join(__dirname, 'assets/css', 'tailwind.css'),
  },
  output: {
    path: join(__dirname, 'static/assets/dist'),
  },
  watch: true,
};

console.log(config());

console.log({
  ...config,
  ...localConfig,
});

// export default {
//   ...config,
//   ...localConfig,
// };
