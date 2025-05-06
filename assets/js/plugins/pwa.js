import DebugLogger from '@davidsneighbour/debuglogger';
// Import parameters from GoHugo
// @ts-ignore - injected at runtime by GoHugo
import * as params from '@params';

// enable logger for local debugging
const logger = new DebugLogger(params.debug);
logger.setPrefix('⚡', '#00aa00');
logger.enableDebug();

if ('serviceWorker' in navigator) {
  const path = params['pwa.path'];
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(path + 'service-worker.js')
      .then((registration) => {
        logger.log('service worker registered: ', registration);
      })
      .catch((registrationError) => {
        logger.log('service worker registration failed: ', registrationError);
      });
  });
} else {
  logger.log(
    'service worker registration failed: navigator.serviceWorker not available',
  );
}
