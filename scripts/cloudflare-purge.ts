import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootPath = path.resolve(__dirname, '../');
const envPath = path.join(rootPath, '.env');

// Load environment variables manually from .env
if (fs.existsSync(envPath)) {
  const envVars = fs.readFileSync(envPath, 'utf-8');
  envVars.split('\n').forEach((line) => {
    const [key, value] = line.split('=');
    if (key && value) {
      // Trim and remove surrounding quotes if present
      const cleanValue = value
        .trim()
        .replace(/^"(.*)"$/, '$1')
        .replace(/^'(.*)'$/, '$1');
      process.env[key.trim()] = cleanValue;
    }
  });
} else {
  console.error('Error: .env file not found.');
  process.exit(1);
}

const zoneId = process.env.CLOUDFLARE_ZONEID;
const token = process.env.CLOUDFLARE_TOKEN;

// Validate required environment variables
if (!zoneId || !token) {
  console.error('Error: CLOUDFLARE_ZONEID or CLOUDFLARE_TOKEN is not defined.');
  process.exit(1);
}

console.log(`Zone ID: ${zoneId}`);
console.log(`Token: ${token}`);

const baseUrl = `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`;
const headers: Record<string, string> = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
};

const body = { purge_everything: true };

console.log('Request Body:', JSON.stringify(body, null, 2));
console.log('Authorization Header:', headers.Authorization);

/**
 * Purges the Cloudflare cache for the specified zone.
 */
const purgeCloudflareCache = async (): Promise<void> => {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const jsonResponse = await response.json();
    console.log('Response Body:', JSON.stringify(jsonResponse, null, 2));

    if (response.status !== 200) {
      console.log(
        `Cloudflare cache couldn't be purged. Status: ${response.status} ${response.statusText}`,
      );
    } else {
      console.log(
        `Cloudflare cache purge done. Status: ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.log('Cloudflare cache purge failed.', error);
  }
};

purgeCloudflareCache();
