// @see https://github.com/paulirish/lite-youtube-embed/issues/148
declare module "lite-youtube-embed" {
  declare class LiteYTEmbed extends HTMLElement {
     async getYTPlayer(): Promise<YT.Player>;
  }
  declare global {
     interface HTMLElementTagNameMap {
        "lite-youtube": LiteYTEmbed;
     }
  }
}

// for pwa module, see service-worker.js
declare const __IS_DEV__: boolean;
