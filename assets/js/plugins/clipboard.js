// @ts-ignore - is mounted via gohugo module
import ClipboardJS from "./lib/clipboard.js";

// initiate clipboard.js on all buttons with class .btn-clipboard
const clipboard = new ClipboardJS(".btn-clipboard");

// show all clipboard buttons when the copy plugin is loaded
window.addEventListener("load", () => {
	for (const btn of document.querySelectorAll(".btn-clipboard")) {
		btn.classList.remove("invisible");
	}
});

// a little timeout to remove the focus from the button after copying
clipboard.on(
	"success",
	(/** @type {{ clearSelection: () => void; }} */ event) => {
		setTimeout(() => {
			event.clearSelection();
		}, 500);
	},
);

// handling errors
clipboard.on("error", (/** @type {any} */ event) => {});

// handle copy button on multi-tab highlighting components
if (document.readyState === "loading") {
	// if loading hasn't finished yet
	document.addEventListener("DOMContentLoaded", setupCopyButton);
} else {
	// `DOMContentLoaded` has already fired
	setupCopyButton();
}
function setupCopyButton() {
	// all .component--highlight blocks
	const highlightComponents = document.querySelectorAll(
		".component--highlight",
	);
	for (const component of highlightComponents) {
		// copy buttons within this component (in case there are multiple)
		const copyButtons = component.querySelectorAll(".btn-clipboard");
		if (copyButtons.length > 0) {
			// update the copy button's target for each button
			function updateClipboardTarget(newTarget) {
				if (newTarget) {
					for (const copyButton of copyButtons) {
						copyButton.setAttribute("data-clipboard-target", newTarget);
					}
				} else {
					console.error("No new target specified.");
				}
			}
			// Add event listeners to all tab buttons within this block, excluding the copy button
			for (const tabButton of component.querySelectorAll(
				".nav-link:not(.btn-clipboard)",
			)) {
				tabButton.addEventListener("click", () => {
					const newTarget = tabButton.getAttribute("data-bs-target");
					updateClipboardTarget(newTarget);
				});
			}
			// Set initial clipboard target to the currently active tab within this block
			const activeTabButton = component.querySelector(
				".nav-link.active:not(.btn-clipboard)",
			);
			if (activeTabButton) {
				updateClipboardTarget(activeTabButton.getAttribute("data-bs-target"));
			}
		} else {
			console.error(".btn-clipboard button(s) not found in the component.");
		}
	}
}
