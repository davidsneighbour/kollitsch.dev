import path from "node:path";
import netlify from "@astrojs/netlify";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import matomo from "astro-matomo";
import pagefind from "astro-pagefind";
// @ts-check
import { defineConfig } from "astro/config";

import sentry from "@sentry/astro";
import spotlightjs from "@spotlightjs/astro";

// https://astro.build/config
export default defineConfig({
	site: "https://kollitsch.dev/",
	trailingSlash: "always",
	prefetch: {
		prefetchAll: true,
		defaultStrategy: "viewport",
	},
	adapter: netlify({
		imageCDN: false,
	}),
	// redirects: {
	//   '/blog/old-post': '/blog/new-post',
	// },
	integrations: [
		react(),
		sitemap(), // https://github.com/shishkin/astro-pagefind
		pagefind({
			indexConfig: {
				keepIndexUrl: true,
			},
		}), // https://github.com/felix-berlin/astro-matomo
		matomo({
			enabled: import.meta.env.PROD, // Only load in production
			host: "https://analytics.dnbhub.xyz/",
			siteId: 1,
			setCookieDomain: "*.kollitsch.dev",
			heartBeatTimer: 5,
			disableCookies: true,
			debug: false,
			partytown: true,
			preconnect: true,
			viewTransition: {
				contentElement: "main",
			},
		}),
		partytown(),
		sentry(),
		spotlightjs(),
	],
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				"@components": path.resolve("./src/components"),
				"@layouts": path.resolve("./src/layouts"),
				"@data": path.resolve("./src/data"),
				"@styles": path.resolve("./src/styles"),
				"@types": path.resolve("./src/types"),
			},
		},
	},
	experimental: {
		responsiveImages: true,
		contentIntellisense: true,
		preserveScriptOrder: true,
		clientPrerender: true,
		// fonts: [{
		//   provider: 'local',
		//   name: "exo2",
		//   cssVariable: "--font-exo2",
		//   fallbacks: ["sans-serif"],
		//   variants: [{
		//     src: [{
		//         url: './src/assets/fonts/exo/normal.woff2', tech: 'format("woff2") tech("variations")'
		//     }, {
		//         url: './src/assets/fonts/exo/normal.woff2', tech: 'format("woff2-variations")'
		//     }],
		//     weight: '100 900',
		//     style: 'normal',
		//     display: 'fallback',
		//   }, {
		//     src: [{
		//       url: './src/assets/fonts/exo/italic.woff2', tech: 'format("woff2") tech("variations")'
		//     }, {
		//       url: './src/assets/fonts/exo/italic.woff2', tech: 'format("woff2-variations")'
		//     }],
		//     weight: '100 900',
		//     style: 'italic',
		//     display: 'swap',
		//   }],
		// },{
		//   provider: 'local',
		//   name: "jetbrainsmono",
		//   cssVariable: "--font-jetbrainsmono",
		//   fallbacks: ["sans-serif"],
		//   variants: [{
		//     src: [{
		//         url: './src/assets/fonts/jetbrainsmono/JetBrainsMono[wght].woff2', tech: 'format("woff2") tech("variations")'
		//     }, {
		//         url: './src/assets/fonts/jetbrainsmono/JetBrainsMono[wght].woff2', tech: 'format("woff2-variations")'
		//     }],
		//     weight: '100 800',
		//     style: 'normal',
		//     display: 'fallback',
		//   }, {
		//     src: [{
		//       url: './src/assets/fonts/jetbrainsmono/JetBrainsMono-Italic[wght].woff2', tech: 'format("woff2") tech("variations")'
		//     }, {
		//       url: './src/assets/fonts/jetbrainsmono/JetBrainsMono-Italic[wght].woff2', tech: 'format("woff2-variations")'
		//     }],
		//     weight: '100 800',
		//     style: 'italic',
		//     display: 'swap',
		//   }],
		// },{
		//   provider: 'local',
		//   name: "changa",
		//   cssVariable: "--font-changa",
		//   fallbacks: ["sans-serif"],
		//   variants: [{
		//     src: [{
		//         url: './src/assets/fonts/changa/changaone-regular-webfont.woff2', tech: 'format("woff2")'
		//     }, {
		//         url: './src/assets/fonts/changa/changaone-regular-webfont.woff2', tech: 'format("woff2-variations")'
		//     }],
		//     weight: 400,
		//     style: 'normal',
		//     display: 'fallback',
		//   }, {
		//     src: [{
		//       url: './src/assets/fonts/changa/changaone-italic-webfont.woff2', tech: 'format("woff2")'
		//     }, {
		//       url: './src/assets/fonts/changa/changaone-italic-webfont.woff2', tech: 'format("woff2-variations")'
		//     }],
		//     weight: 400,
		//     style: 'italic',
		//     display: 'swap',
		//   }],
		// }],
	},
	image: {
		experimentalLayout: "constrained",
	},
	markdown: {
		shikiConfig: {
			themes: {
				light: "github-light",
				dark: "dark-plus",
			},
			wrap: true,
		},
	},
	// redirects: {
	//  '/old': '/new',
	//  '/news': {
	//    status: 302,
	//    destination: 'https://example.com/news'
	//  },
	// },
	compressHTML: import.meta.env.PROD,
});
