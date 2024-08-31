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
        <div class="progress-bar" style="width: var(--scroll);"></div>
      </div>
    `;
  }

}

export default ProgressBar;
