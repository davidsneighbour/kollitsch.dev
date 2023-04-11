const path = require('path');
const arguments = process.argv;

(async () => {
	if (arguments && arguments.length > 0) {
		const folderArg = path.dirname(arguments[3]);
		const frontmatterArg = arguments[4];
		const data = frontmatterArg && typeof frontmatterArg === "string" ? JSON.parse(frontmatterArg) : null;
		const link = data.link;

		// node./ bin / content / site - screenshot.mjs--url link--output folderArg + "/header.jpg"

	}
})();
