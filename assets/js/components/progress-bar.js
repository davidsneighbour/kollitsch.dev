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
    console.log('ProgressBar loaded');
  }
}

export default ProgressBar;
