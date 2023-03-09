const { chromium } = require("playwright");
const argv = require('yargs').argv;
(async () => {
	let browser = await chromium.launch();
	let page = await browser.newPage();
	await page.setViewportSize({
		width: argv.width || 1200,
		height: argv.height || 600
	});
	await page.goto(argv.url || 'https://example.com');
	await page.screenshot({ path: argv.output || 'header.jpg' });
	await browser.close();
})();
