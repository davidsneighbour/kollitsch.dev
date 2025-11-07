// netlify/functions/dhook.mjs

const DEFAULT_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1435884738576646277/88mCUKOR3c7oJCBYQWpMIVbANBRk4Rmd9h4VBsZc7oR6lecqAoVEjB4qx6yMHdLsvIi0";

/**
 * Normalize inbound data:
 * - If body is { data: [...] } use that array.
 * - If body is an array, use as-is.
 * - If body is an object, wrap it in an array.
 */
function normalizeData(body) {
  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body.data)) return body.data;
  if (body && typeof body === "object") return [body];
  return [];
}

/**
 * Build a markdown-like table string (Discord doesn't render tables, but the pipe
 * format reads well in monospace). We won't put it in a code block so it's a
 * regular text message.
 */
function toPipeTable(rows) {
  if (!rows.length) return "No data.";

  // Union of keys across rows, stable order: first row keys first
  const headerKeys = Array.from(
    rows.reduce((set, r, i) => {
      const keys = Object.keys(r || {});
      if (i === 0) keys.forEach(k => set.add(k));
      else keys.forEach(k => set.add(k));
      return set;
    }, new Set())
  );

  const esc = (val) => {
    if (val === null || val === undefined) return "";
    const s = typeof val === "string" ? val : JSON.stringify(val);
    return s.replace(/\n/g, " ").replace(/\|/g, "\\|").trim();
  };

  const header = `| ${headerKeys.join(" | ")} |`;
  const sep = `| ${headerKeys.map(() => "---").join(" | ")} |`;
  const lines = rows.map((r) => {
    const cells = headerKeys.map((k) => esc(r?.[k]));
    return `| ${cells.join(" | ")} |`;
  });

  return [header, sep, ...lines].join("\n");
}

/**
 * Discord has a 2000 character limit per message. Chunk safely.
 */
function chunkString(str, max = 2000) {
  const out = [];
  let i = 0;
  while (i < str.length) {
    out.push(str.slice(i, i + max));
    i += max;
  }
  return out;
}

export async function handler(event) {
  // CORS & preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Discord-Title",
      },
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method Not Allowed. Use POST." }),
    };
  }

  try {
    const webhook =
      process.env.DISCORD_WEBHOOK_URL?.trim() || DEFAULT_WEBHOOK_URL;

    if (!webhook) {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Missing DISCORD_WEBHOOK_URL." }),
      };
    }

    const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";
    if (!contentType.includes("application/json")) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Content-Type must be application/json." }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const title =
      body?.title ||
      event.headers["x-discord-title"] ||
      "Webhook Notification";

    const rows = normalizeData(body);
    const table = toPipeTable(rows);

    // Prefix with an optional title line
    const message = `**${title}**\n${table}`;

    // Chunk and send sequentially
    const chunks = chunkString(message, 2000);

    for (const part of chunks) {
      const resp = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        body: JSON.stringify({ content: part }),
      });
      if (!resp.ok) {
        const text = await resp.text();
        return {
          statusCode: 502,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({
            error: "Discord webhook rejected the payload.",
            status: resp.status,
            body: text,
          }),
        };
      }
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: true, sent: chunks.length }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err?.message || "Unknown error" }),
    };
  }
}
