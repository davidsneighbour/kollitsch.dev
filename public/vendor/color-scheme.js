// dnb-color-scheme.js
const template = document.createElement('template');
template.innerHTML = `
  <style>
    table {
      @apply w-full text-sm table-fixed;
    }
    th, td {
      @apply px-3 py-2 text-left;
    }
    tbody tr:hover {
      @apply bg-gray-100 dark:bg-gray-800;
    }
    .color-swatch {
      @apply w-full h-6 rounded;
    }
    .copy-btn {
      @apply text-blue-600 cursor-pointer underline;
    }
    .copy-btn[aria-pressed="true"] {
      @apply text-green-600;
    }
  </style>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Copy</th>
        <th>Value</th>
        <th>Swatches</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
`;

class ColorScheme extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'bg'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const type = this.getAttribute('type') || 'rgb';
    const bgColors = (this.getAttribute('bg') || '#fff').split(',');
    const scriptTag = this.querySelector('script[type="application/json"]');
    let rows = [];
    try {
      rows = scriptTag ? JSON.parse(scriptTag.textContent) : [];
    } catch (e) {
      console.warn('Invalid JSON in <script type="application/json">', e);
    }

    const tbody = this.shadowRoot.querySelector('tbody');
    tbody.innerHTML = '';

    for (const row of rows) {
      const [name, value] = row;
      const colorString = this.parseColor(type, value);
      const cssLine = `background-color: ${colorString};`;
      const tr = document.createElement('tr');

      // Name
      const tdName = document.createElement('td');
      tdName.textContent = name;

      // Copy
      const tdCopy = document.createElement('td');
      const copyLink = document.createElement('span');
      copyLink.textContent = 'copy';
      copyLink.setAttribute('role', 'button');
      copyLink.setAttribute('tabindex', '0');
      copyLink.className = 'copy-btn';
      copyLink.addEventListener('click', () => {
        navigator.clipboard.writeText(cssLine);
        copyLink.setAttribute('aria-pressed', 'true');
        setTimeout(() => copyLink.removeAttribute('aria-pressed'), 1000);
      });
      tdCopy.appendChild(copyLink);

      // Value
      const tdValue = document.createElement('td');
      tdValue.textContent = colorString;

      // Swatches
      const tdSwatch = document.createElement('td');
      tdSwatch.style.display = 'flex';
      tdSwatch.style.gap = '4px';

      for (const bg of bgColors) {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = colorString;
        swatch.style.border = '1px solid #ccc';
        swatch.style.padding = '2px';
        swatch.style.color = this.getReadableColor(bg);
        swatch.style.background = bg;
        swatch.textContent = name;

        // WCAG contrast check
        const contrastRatio = this.getContrastRatio(colorString, bg);
        swatch.title = `Contrast Ratio: ${contrastRatio.toFixed(2)}`;
        if (contrastRatio < 4.5) swatch.style.outline = '2px dashed red';

        tdSwatch.appendChild(swatch);
      }

      tr.append(tdName, tdCopy, tdValue, tdSwatch);
      tbody.appendChild(tr);
    }
  }

  /**
   * Parse the value depending on type.
   */
  parseColor(type, value) {
    if (type === 'hsl') {
      return `hsl(${value})`;
    } else if (type === 'rgb') {
      return value.startsWith('#') ? value : `#${value}`;
    } else if (type === 'rgba') {
      return value.startsWith('rgba') ? value : `rgba(${value})`;
    } else if (type === 'hsla') {
      return value.startsWith('hsla') ? value : `hsla(${value})`;
    }
    return value;
  }

  /**
   * Calculate text color based on background brightness.
   * @param {string} bg - Background color (#hex or rgb/hsl supported).
   * @returns {string} - CSS color string ('#000' or '#fff')
   */
  getReadableColor(bg) {
    let r = 0,
      g = 0,
      b = 0;
    if (bg.startsWith('#')) {
      const hex = bg.replace('#', '');
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      }
    } else if (bg.startsWith('rgb')) {
      [r, g, b] = bg.match(/\d+/g).map(Number);
    }
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000' : '#fff';
  }

  /**
   * Compute WCAG contrast ratio between two colors
   */
  getContrastRatio(fg, bg) {
    const toRGB = (color) => {
      const d = document.createElement('div');
      d.style.color = color;
      document.body.appendChild(d);
      const rgb = getComputedStyle(d).color;
      document.body.removeChild(d);
      const [r, g, b] = rgb.match(/\d+/g).map(Number);
      return [r / 255, g / 255, b / 255].map((c) => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
    };
    const L = (rgb) => 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    const L1 = L(toRGB(fg));
    const L2 = L(toRGB(bg));
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  }
}

customElements.define('dnb-color-scheme', ColorScheme);

/* 
<dnb-color-scheme type="rgb" bg="#000,#fff,#ff5500">
  <script type="application/json">
    [["Primary", "123123"], ["Accent", "234234"], ["Bright", "ffffff"]]
  </script>
</dnb-color-scheme> 

*/
