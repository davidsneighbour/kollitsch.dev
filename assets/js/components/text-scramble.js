/**
 * <dnb-textscramble> - Custom Web Component
 *
 * Features:
 * ----------
 * - Visually scrambles characters from left to right
 * - Supports manual and hover-triggered animation
 * - Configurable via attributes:
 *   - `speed`      → base speed per character (ms) [default: 100]
 *   - `stagger`    → time between updates (ms) [default: 50]
 *   - `depth`      → how many scramble frames per character [default: 10]
 *   - `curve`      → easing curve for left-to-right animation [default: 0.75]
 *   - `charpreset` → character source: "alnum" (default), "random", "self", "manual"
 *   - `charset`    → string of characters to use when `charpreset="manual"`
 *
 * Accessibility:
 * ---------------
 * - Requires `aria-label` on the parent element
 * - If missing, falls back to inner content and logs an error in development
 *
 * Public API:
 * -----------
 * - `trigger({ label, speed, stagger, depth, curve, save })`
 * - `reset()`
 *
 * Scramble curve function:
 *   Math.pow(i / length, curve)
 *
 * Ideas for future improvements:
 * - add events for start, end, and error
 * - add support for custom easing functions
 * - add a class to the parent element during scrambling
 * - make the containing element configurable
 */

import DebugLogger from '@davidsneighbour/debuglogger';

class DnbTextScramble extends HTMLElement {
	static get observedAttributes() {
		return ['speed', 'stagger', 'depth', 'curve', 'charpreset', 'charset'];
	}

	constructor() {
		super();

		this._logger = new DebugLogger(true);
		this._logger.setPrefix('⚡ DEBUG: [textscramble]', '#00aa00');
		this._logger.enableDebug();

		this._logger.info('Element constructed');

		this.attachShadow({ mode: 'open' });

		this._startTime = null;
		this._duration = 0;
		this._raf = null;

		// Config defaults
		this._defaultSpeed = 100;
		this._defaultStagger = 50;
		this._defaultDepth = 10;
		this._defaultCurve = 0.75;
		this._defaultCharPreset = 'self';

		this._speedFactor = this._defaultSpeed;
		this._stagger = this._defaultStagger;
		this._scrambleDepth = this._defaultDepth;
		this._scrambleCurve = this._defaultCurve;
		this._charPreset = this._defaultCharPreset;
		this._charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	}

	connectedCallback() {
		this._logger.info('connectedCallback triggered');
		this._parseConfig();

		const span = document.createElement('span');
		const originalText = this.textContent.trim();
		this._logger.info('Original content:', originalText);

		this.shadowRoot.innerHTML = '';
		this.shadowRoot.appendChild(span);
		span.innerText = originalText;

		const parent = this.parentElement;
		if (!parent) {
			this._logger.error('No parent element found.');
			return;
		}

		if (!parent.hasAttribute('aria-label')) {
			const fallback = originalText;
			parent.setAttribute('aria-label', fallback);
			if (typeof ENVIRONMENT !== 'undefined' && ENVIRONMENT === 'development') {
				this._logger.error(`Missing aria-label on parent. Fallback applied: "${fallback}"`);
			}
		}

		const label = parent.getAttribute('aria-label');
		this._logger.info('Parent aria-label:', label);
		this.textContent = ''; // Clear light DOM

		if (this._charPreset === 'self') {
			this._charset = this._buildSelfCharset(label);
			this._logger.info(`Generated charset from self: ${this._charset}`);
		}

		this._scrambleHandler = this._scramble(span, parent, label);
		this._scrambleHandler();

		parent.addEventListener('mouseenter', () => {
			this._logger.info('Hover triggered scramble reset + restart');
			this.reset();
			this.trigger();
		});

		parent.addEventListener('mouseleave', () => {
			this._logger.info('Mouse left element, aborting animation');
			this.reset();
		});
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this._logger.info(`Attribute ${name} changed from ${oldValue} to ${newValue}`);
		this._parseConfig();
	}

	_parseConfig() {
		this._speedFactor = parseInt(this.getAttribute('speed') || this._defaultSpeed, 10);
		this._stagger = parseInt(this.getAttribute('stagger') || this._defaultStagger, 10);
		this._scrambleDepth = parseInt(this.getAttribute('depth') || this._defaultDepth, 10);
		this._scrambleCurve = parseFloat(this.getAttribute('curve') || this._defaultCurve);
		this._charPreset = this.getAttribute('charpreset') || this._defaultCharPreset;

		switch (this._charPreset) {
			case 'manual':
				this._charset = this.getAttribute('charset') || '';
				break;
			case 'random':
				this._charset = Array.from({ length: 512 }, () =>
					String.fromCharCode(0x20 + Math.floor(Math.random() * 94))
				).join('');
				break;
			case 'alnum':
			default:
				this._charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		}

		this._logger.info(
			`Config: speed=${this._speedFactor}, stagger=${this._stagger}, depth=${this._scrambleDepth}, curve=${this._scrambleCurve}, charpreset=${this._charPreset}`
		);
	}

	_buildSelfCharset(source) {
		const chars = new Set();
		for (const ch of source) {
			chars.add(ch);
			chars.add(ch.toLowerCase());
			chars.add(ch.toUpperCase());
		}
		return Array.from(chars).join('');
	}

	_randomString(length) {
		if (length <= 0 || !this._charset) return '';
		let result = '';
		for (let i = 0; i < length; i++) {
			const randIndex = Math.floor(Math.random() * this._charset.length);
			result += this._charset[randIndex];
		}
		this._logger.info(`Generated random string of length ${length}:`, result);
		return result;
	}

	_scramble(el, anchor, labelOverride = null, speed = null, stagger = null, depth = null, curve = null) {
		const label = labelOverride || anchor.getAttribute('aria-label');
		const length = label.length;

		const s = speed ?? this._speedFactor;
		const g = stagger ?? this._stagger;
		const d = depth ?? this._scrambleDepth;
		const c = curve ?? this._scrambleCurve;

		this._duration = length * d * g;

		return () => {
			if (!this._startTime) {
				this._logger.info('Initializing scramble animation');
				anchor.dataset.scrambling = 'true';
				this._startTime = Date.now();
				this._logger.info(`Duration set to ${this._duration}ms`);
			}

			const now = Date.now();
			const elapsed = now - this._startTime;

			let index = 0;
			for (let i = 0; i < length; i++) {
				const revealTime = d * g * Math.pow(i / length, c);
				if (elapsed >= revealTime) {
					index++;
				} else {
					break;
				}
			}

			const visiblePart = label.slice(0, index);
			const scrambledPart = this._randomString(length - index);

			this._logger.info(`Frame update: index=${index}, elapsed=${elapsed}ms`);
			el.innerText = `${visiblePart}${scrambledPart}`;

			if (index < length) {
				this._raf = requestAnimationFrame(this._scramble(el, anchor, label, s, g, d, c));
			} else {
				this._logger.info('Scramble completed (all characters revealed)');
				this._startTime = null;
				this._raf = null;
				anchor.dataset.scrambling = 'false';
				el.innerText = label;
			}
		};
	}

	trigger({ label, speed, stagger, depth, curve, save = false } = {}) {
		const parent = this.parentElement;
		const span = this.shadowRoot?.querySelector('span');

		if (!parent || !span) {
			this._logger.error('Cannot trigger scramble: parent or span missing');
			return;
		}

		const s = speed ?? this._speedFactor;
		const g = stagger ?? this._stagger;
		const d = depth ?? this._scrambleDepth;
		const c = curve ?? this._scrambleCurve;

		if (save) {
			this._logger.info('Saving new config from trigger() call');
			this._speedFactor = s;
			this._stagger = g;
			this._scrambleDepth = d;
			this._scrambleCurve = c;
		}

		if (this._charPreset === 'self') {
			const aria = parent.getAttribute('aria-label');
			this._charset = this._buildSelfCharset(aria);
		}

		this._logger.info(`Manual trigger: label="${label}", speed=${s}, stagger=${g}, depth=${d}, curve=${c}, save=${save}`);
		this._scramble(span, parent, label, s, g, d, c)();
	}

	reset() {
		const parent = this.parentElement;
		const span = this.shadowRoot?.querySelector('span');
		const label = parent?.getAttribute('aria-label');

		if (!span || !parent || !label) return;

		if (this._raf) cancelAnimationFrame(this._raf);

		this._startTime = null;
		this._raf = null;
		parent.dataset.scrambling = 'false';
		span.innerText = label;

		this._logger.info('Hard reset: animation stopped, label restored:', label);
	}
}

export default DnbTextScramble;
