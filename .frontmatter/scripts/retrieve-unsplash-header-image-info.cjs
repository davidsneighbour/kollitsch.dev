const path = require('path');
const util = require('util');
const fs = require('fs');
require('dotenv').config();
const arguments = process.argv;
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const Fs = require('fs');
const Https = require('https');

/**
 * Download a file from the given `url` into the `targetFile`.
 *
 * @param {String} url
 * @param {String} targetFile
 *
 * @returns {Promise<void>}
 */
async function downloadFile(url, targetFile) {
	return await new Promise((resolve, reject) => {
		Https.get(url, response => {
			const code = response.statusCode ?? 0

			if (code >= 400) {
				return reject(new Error(response.statusMessage))
			}

			// handle redirects
			if (code > 300 && code < 400 && !!response.headers.location) {
				return resolve(
					downloadFile(response.headers.location, targetFile)
				)
			}

			// save the file to disk
			const fileWriter = Fs
				.createWriteStream(targetFile)
				.on('finish', () => {
					resolve({})
				})

			response.pipe(fileWriter)
		}).on('error', error => {
			reject(error)
		})
	})
};

(async () => {
	if (arguments && arguments.length > 0) {
		const folderArg = path.dirname(arguments[3]);
		const frontmatterArg = arguments[4];
		const data = frontmatterArg && typeof frontmatterArg === "string" ? JSON.parse(frontmatterArg) : null;


		const imageId = data.unsplash.imageid;
		console.log(imageId);

		const dataFeed = util.format('https://api.unsplash.com/photos/%s?client_id=%s', imageId, process.env.UNSPLASH_ACCESS_KEY);
		const writeFilePromise = util.promisify(fs.writeFile);

		console.log(dataFeed);

		const dataFile = './data/dnb/unsplash/' + imageId + '.json';
		await downloadFile(dataFeed, dataFile);

		let rawdata = fs.readFileSync(dataFile);
		let imageData = JSON.parse(rawdata);
		await downloadFile(imageData.urls.full, folderArg + "/header.jpg");

		console.log('{ "frontmatter": { "bla": "fasel" }}');

	}
})();
