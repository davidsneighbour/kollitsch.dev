import fetch from "node-fetch";
import "dotenv/config";

const zoneId = process.env.CLOUDFLARE_ZONEID;
const token = process.env.CLOUDFLARE_TOKEN;

// Check if the environment variables are defined
if (!zoneId || !token) {
  console.error("Error: CLOUDFLARE_ZONEID or CLOUDFLARE_TOKEN is not defined.");
  process.exit(1); // Exit the process with an error code
}

const baseUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`;
const headers = {
  Authorization: `Bearer ${token}`,
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
