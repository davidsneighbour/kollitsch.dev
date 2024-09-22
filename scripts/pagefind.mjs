import * as pagefind from "pagefind";

/**
 * Pagefind index for search functionality.
 *
 * @todo configurability
 */
async function buildPagefindIndex() {
	const { index } = await pagefind.createIndex({
		rootSelector: "html",
		verbose: true,
		logfile: "debug.log",
	});

	if (index) {
		await index.addDirectory({
			path: "public",
		});
		await index.writeFiles({
			outputPath: "public/search",
		});
	}
}

await buildPagefindIndex();
