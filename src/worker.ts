interface AssetFetcher {
  fetch(request: Request): Promise<Response>;
}

interface Env {
  ASSETS: AssetFetcher;
  RESEND_API_KEY: string;
  RESEND_FROM: string;
  RESEND_TO: string;
}

interface ContactPayload {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  message?: unknown;
  honeyPot?: unknown;
}

const contactPath = '/api/send-email';
const apexHostname = 'kollitsch.dev';
const wwwHostname = `www.${apexHostname}`;
const resendEndpoint = 'https://api.resend.com/emails';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function redirectWwwToApex(url: URL): Response {
  url.hostname = apexHostname;

  return Response.redirect(url.toString(), 301);
}

function jsonResponse(body: Record<string, unknown>, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      ...init.headers,
    },
  });
}

function textValue(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}

function validatePayload(payload: ContactPayload): {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
} {
  const firstName = textValue(payload.firstName);
  const lastName = textValue(payload.lastName);
  const email = textValue(payload.email);
  const message = textValue(payload.message);

  if (textValue(payload.honeyPot)) {
    throw new Error('Bot submission rejected.');
  }

  if (!firstName) {
    throw new Error('First name is required.');
  }

  if (!email) {
    throw new Error('Email is required.');
  }

  if (!emailPattern.test(email)) {
    throw new Error('Please enter a valid email address.');
  }

  if (!message) {
    throw new Error('Message is required.');
  }

  return { firstName, lastName, email, message };
}

async function sendContactEmail(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        Allow: 'POST, OPTIONS',
      },
    });
  }

  if (request.method !== 'POST') {
    return jsonResponse(
      { error: 'Method not allowed.' },
      {
        status: 405,
        headers: {
          Allow: 'POST, OPTIONS',
        },
      },
    );
  }

  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return jsonResponse({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  let contact;

  try {
    contact = validatePayload(payload);
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : 'Invalid form payload.' },
      { status: 400 },
    );
  }

  const fullName = [contact.firstName, contact.lastName].filter(Boolean).join(' ');
  const html = [
    '<h1>New contact form submission</h1>',
    `<p><strong>Name:</strong> ${escapeHtml(fullName)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>`,
    '<p><strong>Message:</strong></p>',
    `<p>${escapeHtml(contact.message).replaceAll('\n', '<br>')}</p>`,
  ].join('');
  const text = [
    'New contact form submission',
    '',
    `Name: ${fullName}`,
    `Email: ${contact.email}`,
    '',
    contact.message,
  ].join('\n');

  const resendResponse = await fetch(resendEndpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.RESEND_FROM,
      to: [env.RESEND_TO],
      reply_to: contact.email,
      subject: `New message from ${fullName}`,
      html,
      text,
    }),
  });

  if (!resendResponse.ok) {
    console.error('Contact form email delivery failed.', {
      status: resendResponse.status,
      statusText: resendResponse.statusText,
    });

    return jsonResponse(
      { error: 'Unable to send your message right now. Please try again later.' },
      { status: 502 },
    );
  }

  return jsonResponse({ message: 'Thank you for your message!' });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === wwwHostname) {
      return redirectWwwToApex(url);
    }

    if (url.pathname === contactPath) {
      return sendContactEmail(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
