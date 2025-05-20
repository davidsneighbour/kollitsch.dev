/**
 * Wireframe Mode - Replace all fonts with "Redacted Script"
 *
 * This script dynamically loads the "Redacted Script" font from Google Fonts
 * and applies it across the entire page to mimic a wireframe-style design.
 */

/**
 * Inject Google Font link into the document head
 */
const loadFont = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Redacted+Script:wght@300;400;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

/**
 * Apply wireframe styles to the entire page
 */
const applyWireframeStyle = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    * {
      font-family: 'Redacted Script', cursive !important;
      color: #333 !important;
      background-color: transparent !important;
      border-color: #333 !important;
      box-shadow: none !important;
    }

    body {
      background-color: #f5f5f5 !important;
    }

    button, input, select, textarea {
      font-family: 'Redacted Script', cursive !important;
      border: 2px dashed #333 !important;
      background-color: transparent !important;
    }

    img {
      filter: grayscale(100%) opacity(0.2);
    }
  `;
  document.head.appendChild(style);

  // Override inline styles
  const allElements = document.querySelectorAll('*');
  allElements.forEach((el) => {
    if (el.style.fontFamily) {
      el.style.fontFamily = "'Redacted Script', cursive";
    }
  });
};

/**
 * Initialize wireframe mode
 */
const initializeWireframeMode = () => {
  loadFont();
  applyWireframeStyle();
};

document.addEventListener('DOMContentLoaded', initializeWireframeMode);
