// dnb-color-scheme.js
class DNBColorScheme extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  get type() {
    return this.getAttribute('type') || 'rgb';
  }

  parseData() {
    const script = this.querySelector('script[type="application/json"]');
    if (!script) return [];

    try {
      const data = JSON.parse(script.textContent);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Invalid JSON in <dnb-color-scheme>', e);
      return [];
    }
  }

  formatColor(value) {
    if (this.type === 'rgb') {
      // Support both with and without # prefix
      const hex = value.startsWith('#') ? value : `#${value}`;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (this.type === 'hsl') {
      return `hsl(${value})`;
    }
    return value;
  }

  getContrastYIQ(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  }

  copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
      button.textContent = '✓ Copied';
      button.classList.add('text-green-600');
      setTimeout(() => {
        button.textContent = 'Copy';
        button.classList.remove('text-green-600');
      }, 1500);
    });
  }

  render() {
    const data = this.parseData();

    const style = /*css*/ `
      :host {
        display: block;
        font-family: ui-sans-serif, system-ui;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th, td {
        padding: 0.5rem 1rem;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }

      .swatch {
        display: inline-block;
        width: 3rem;
        height: 2rem;
        border-radius: 0.25rem;
        box-shadow: inset 0 0 0 1px rgba(0,0,0,0.1);
      }

      button.copy {
        background: none;
        border: 1px solid #ccc;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      button.copy:hover {
        border-color: #aaa;
        background-color: #f5f5f5;
      }
    `;

    const rows = data
      .map(([name, value]) => {
        const background = this.formatColor(value); // rgb(...) or hsl(...)
        const contrastColor = this.getContrastYIQ(value); // returns 'black' or 'white'

        return /*html*/ `
  <tr>
    <td class="font-medium text-sm">${name}</td>
    <td>
      <button class="copy text-sm" role="button" tabindex="0"
        data-copy="background-color: ${background};">
        Copy
      </button>
    </td>
    <td class="text-xs text-gray-600">${value}</td>
    <td>
      <div
        class="rounded px-2 py-1 text-sm"
        style="
          background-color: ${background};
          color: ${contrastColor};
          display: inline-block;
          min-width: 5rem;
          text-align: center;
          border: 1px solid rgba(0,0,0,0.1);
        "
      >
        ${name}
      </div>
    </td>
  </tr>
`;
      })
      .join('');

    this.shadowRoot.innerHTML = `
      <style>${style}</style>
      <table>
        <thead>
          <tr class="text-xs text-gray-500">
            <th>Name</th>
            <th>Copy</th>
            <th>Value</th>
            <th>Preview</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;

    this.shadowRoot.querySelectorAll('button.copy').forEach((button) => {
      button.addEventListener('click', () =>
        this.copyToClipboard(button.dataset.copy, button),
      );
    });
  }
}

customElements.define('dnb-color-scheme', DNBColorScheme);
