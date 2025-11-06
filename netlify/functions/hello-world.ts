import { Context } from "@netlify/functions";

/**
 * @type {import('@netlify/functions').Handler}
 * @param {Request} request https://developer.mozilla.org/en-US/docs/Web/API/Request
 * @param {Context} context https://docs.netlify.com/build/functions/api/#netlify-specific-context-object
 * @returns {Promise<Response>} https://developer.mozilla.org/en-US/docs/Web/API/Response
 */
export default async (request: Request, context: Context): Promise<Response> => {

  console.log({ request, context });
  return Response.json({ message: "Yes..., and?" });

};
