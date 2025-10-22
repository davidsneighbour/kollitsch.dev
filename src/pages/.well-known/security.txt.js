/**
 * @todo update to latest security.txt spec
 * @see https://securitytxt.org/
 */
export async function GET() {
  // Compute Expires date one year from now (UTC)
  const expires = new Date();
  expires.setUTCFullYear(expires.getUTCFullYear() + 1);
  const expiresIso = expires.toISOString();

  // Build the body of security.txt
  const body = `##############################################################################
# Information related to reporting security vulnerabilities on kollitsch.dev #
##############################################################################

Expires: ${expiresIso}
Contact: https://kollitsch.dev/contact/
Preferred-Languages: en,de
Policy: https://davids-neighbour.com/security-policy/
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
    status: 200,
  });
}
