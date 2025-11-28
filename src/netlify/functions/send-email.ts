import type { Config, Context } from "@netlify/functions";
import { Resend } from 'resend';

export const config: Config = {
  method: "POST",
  // path: "/api/send-email",
};

type ContactPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  message?: string;
  honeyPot?: string;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const createHtmlRow = (
  label: string,
  value?: string,
  options?: { preserveLineBreaks?: boolean },
): string => {
  if (!value) {
    return '';
  }

  const displayValue = options?.preserveLineBreaks
    ? escapeHtml(value).replace(/\n/g, '<br />')
    : escapeHtml(value);

  return `
        <tr>
          <th style="text-align:left;padding:4px 8px 4px 0;color:#555;font-weight:600;">${escapeHtml(label)}</th>
          <td style="padding:4px 0;color:#111;">${displayValue}</td>
        </tr>`;
};

// use import.meta instead of __dirname
// http://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta

/**
 * @type {import('@netlify/functions').Handler}
 * @param {Request} request https://developer.mozilla.org/en-US/docs/Web/API/Request
 * @param {Context} context https://docs.netlify.com/build/functions/api/#netlify-specific-context-object
 * @returns {Promise<Response>} https://developer.mozilla.org/en-US/docs/Web/API/Response
 */
export default async (request: Request, context: Context): Promise<Response> => {

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const RESEND_FROM = process.env.RESEND_FROM;
  const RESEND_TO = process.env.RESEND_TO;

  console.log({ request, context });

  if (!RESEND_API_KEY || !RESEND_FROM || !RESEND_TO) {
    console.error('Missing email environment variables.');
    return Response.json(
      { error: 'Email service is not configured. Please try again later.' },
      { status: 500 },
    );
  }

  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch (parseError) {
    console.error('Failed parsing request body', parseError);
    return Response.json({ error: 'Invalid request payload.' }, { status: 400 });
  }

  if (payload?.honeyPot) {
    return Response.json({ message: 'Message received.' });
  }

  const firstName = payload?.firstName?.trim();
  const lastName = payload?.lastName?.trim();
  const email = payload?.email?.trim();
  const message = payload?.message?.trim();

  if (!firstName || !email || !message) {
    return Response.json(
      { error: 'First name, email, and message are required.' },
      { status: 400 },
    );
  }

  const resend = new Resend(RESEND_API_KEY);

  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const subject = fullName
    ? `New contact form submission from ${fullName}`
    : 'New contact form submission';

  const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;line-height:1.6;padding:24px;background-color:#f8fafc;">
        <h2 style="margin:0 0 16px;font-size:20px;color:#0f172a;">New contact message</h2>
        <p style="margin:0 0 16px;color:#334155;">You have received a new message from the contact form on kollitsch.dev.</p>
        <table style="border-collapse:collapse;width:100%;max-width:520px;background:#ffffff;padding:16px;border-radius:12px;box-shadow:0 4px 16px rgba(15, 23, 42, 0.08);">
          <tbody>
            ${createHtmlRow('First name', firstName)}
            ${createHtmlRow('Last name', lastName)}
            ${createHtmlRow('Email', email)}
            ${createHtmlRow('Message', message, { preserveLineBreaks: true })}
          </tbody>
        </table>
      </div>
    `;

  const text = `New contact message${fullName ? ` from ${fullName}` : ''}

First name: ${firstName}
Last name: ${lastName || '—'}
Email: ${email}

Message:
${message}`;

  let sendResult: unknown;

  try {
    sendResult = await resend.emails.send({
      from: RESEND_FROM,
      to: [RESEND_TO],
      // Use the SDK property name for Reply-To
      replyTo: email,
      subject,
      html,
      text,
    });
  } catch (sendError) {
    console.error('Failed to send email via Resend:', sendError);
    return Response.json({ error: 'Failed sending email', payload: String(sendError) }, { status: 500 });
  }

  // Log the raw result from the SDK. Most Resend SDK responses include an `id`.
  // We avoid destructuring because the SDK returns the created message object
  // and throws on failure instead of returning `{ error }`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resultAny = sendResult as any;
  console.log(`Email ${resultAny?.id ?? 'unknown'} has been sent`);
  console.log({ sendResult });
  return Response.json({ message: 'Thank you for your message!' });

};
