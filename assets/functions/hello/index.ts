import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {

	// {
	// 	"path": "Path parameter (original URL encoding)",
	// 	"httpMethod": "Incoming request’s method name",
	// 	"headers": {Incoming request headers},
	// 	"queryStringParameters": {Query string parameters},
	// 	"body": "A JSON string of the request payload",
	// 	"isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encoded"
	// }

	// 0, 1, 2, 3 are the function, 4 is the request
	const request = event.path.split("/");

	// {
	// 	"isBase64Encoded": true|false,
	// 	"statusCode": httpStatusCode,
	// 	"headers": { "headerName": "headerValue", ... },
	// 	"multiValueHeaders": { "headerName": ["headerValue", "headerValue2", ...], ... },
	// 	"body": "..."
	// }
	return {
		statusCode: 200,
		body: JSON.stringify({ message: "Hello " + (request[4] ?? "World") }),
	};
};

export { handler };
