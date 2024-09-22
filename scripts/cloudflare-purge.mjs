import fetch from "node-fetch";
import "dotenv/config";

const baseUrl = `https://api.cloudflare.com/client/v4/zones/${process.env.CLOUDFLARE_ZONEID}/purge_cache`;
const headers = {
	Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
	"Content-Type": "application/json",
};
const body = { purge_everything: true };

try {
	const { status, statusText } = await fetch(baseUrl, {
		method: "POST",
		headers: headers,
		body: JSON.stringify(body),
	});

	if (status !== 200) {
		console.log(
			`Cloudflare cache couldn't be purged. Status: ${status} ${statusText}`,
		);
	}
	console.log(`Cloudflare cache purge done. Status: ${status} ${statusText}`);
} catch (error) {
	console.log("Cloudflare cache purge failed. ", { error });
}
