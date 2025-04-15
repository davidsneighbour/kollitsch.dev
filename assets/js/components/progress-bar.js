import DebugLogger from '@davidsneighbour/debuglogger';

// Import parameters from GoHugo
// @ts-ignore - injected at runtime by GoHugo
import * as params from '@params';

class ProgressBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="progress"
            role="progressbar"
            aria-label="Reading progress"
            aria-valuenow="0"
            aria-valuemin="0"
            aria-valuemax="100"
            style="height:2px">
        <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: var(--scroll);"></div>
      </div>
    `;
  }
  static {
    // enable logger for local debugging
    const logger = new DebugLogger(params.debug);
    logger.setPrefix('⚡ DEBUG:', '#00aa00');
    logger.enableDebug();
    logger.log('ProgressBar loaded');
  }
}

export default ProgressBar;
