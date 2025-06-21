// src/ColorGrid.js

class ColorGrid extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const colors = this.textContent
      .trim()
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    console.log('Colors:', colors);

    const container = document.createElement('div');
    container.className = 'container overflow-hidden text-center mb-4 px-0';

    const row = document.createElement('div');
    row.className = 'row gx-2';

    colors.forEach((color) => {
      const col = document.createElement('div');
      col.className = 'col';

      const box = document.createElement('div');
      box.className = 'border border-secondary-subtle px-2 py-4';
      box.style.backgroundColor = color;

      const label = document.createElement('span');
      label.className = 'text-dark';
      label.textContent = color;

      box.appendChild(label);
      col.appendChild(box);
      row.appendChild(col);
    });

    container.appendChild(row);
    this.shadowRoot.appendChild(container);

    // Optional Bootstrap styling support
    const style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute(
      'href',
      'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    );
    this.shadowRoot.appendChild(style);
  }
}

customElements.define('color-grid', ColorGrid);
