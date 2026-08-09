export interface WordMarkConfig {
  text: string;
}

const ELEMENT_NAME = 'word-mark';
let defaultText = '';

class WordMarkElement extends HTMLElement {
  static observedAttributes = ['text'];

  connectedCallback(): void {
    this.render();
  }

  attributeChangedCallback(): void {
    this.render();
  }

  refresh(): void {
    this.render();
  }

  private render(): void {
    try {
      const text = this.getAttribute('text') ?? defaultText;

      if (!this.shadowRoot) {
        this.attachShadow({ mode: 'open' });
      }

      if (!this.shadowRoot) {
        throw new Error('Unable to create a shadow root for <word-mark>.');
      }

      this.shadowRoot.replaceChildren();

      const style = document.createElement('style');
      style.textContent = `
        :host {
          display: inline;
          font-family: var(--font-wordmark, var(--font-title, inherit));
        }

        .wordmark-text {
          background-image: var(--wordmark-background-image);
          background-position: var(--wordmark-background-position, center);
          background-repeat: no-repeat;
          background-size: var(--wordmark-background-size, 100vw auto);
          -webkit-background-clip: text;
          background-clip: text;
          color: var(--color-orange-500, currentColor);
        }

        @supports ((-webkit-background-clip: text) or (background-clip: text)) {
          .wordmark-text {
            color: transparent;
          }
        }
      `;

      const span = document.createElement('span');
      span.className = 'wordmark-text';
      span.setAttribute('part', 'text');
      span.textContent = text;

      this.shadowRoot.append(style, span);
    } catch (error) {
      console.error('[word-mark] Failed to render wordmark.', error);
    }
  }
}

export function defineWordMark(config: WordMarkConfig): void {
  try {
    if (typeof window === 'undefined' || !('customElements' in window)) {
      return;
    }

    if (typeof config.text !== 'string' || config.text.trim().length === 0) {
      throw new Error('Wordmark text must be a non-empty string.');
    }

    defaultText = config.text;

    if (!customElements.get(ELEMENT_NAME)) {
      customElements.define(ELEMENT_NAME, WordMarkElement);
    }

    document.querySelectorAll<WordMarkElement>(ELEMENT_NAME).forEach((element) => {
      element.refresh();
    });
  } catch (error) {
    console.error('[word-mark] Failed to register web component.', error);
  }
}
