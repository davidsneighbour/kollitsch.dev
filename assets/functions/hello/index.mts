import { Config, Context } from "@netlify/functions";

export default async (request: Request, context: Context) => {
  const url = request.url.split('/');
  const name = url[5] ?? "World";
  return new Response(`Hello, ${name}!`);
};

export const config: Config = {
  path: [
    "/api/hello",
    "/api/hello/:name",
  ],
  preferStatic: true
};

// Netlify - specific Context object

// geo: an object containing geolocation data for the client with the following properties:
//   city: name of the city.
//   country:
//      code: ISO 3166 code for the country.
//      name: name of the country.
//   latitude: latitude of the location.
//   longitude: longitude of the location.
//   subdivision:
//     code: ISO 3166 code for the country subdivision.
//     name: name of the country subdivision.
//   timezone: timezone of the location.
// ip: a string containing the client IP address.



// The Netlify global object exposes the following properties:

// env: an object providing access to environment variables with the following properties:
//   delete (name): in the context of the invocation, deletes an environment variable with a given name.
//   get(name): returns the string value of an environment variable with a given name; if the environment variable is not defined, undefined is returned.
//   has(name): returns a boolean value containing true if an environment variable with a given name exists, and false otherwise.
//   set(name, value): in the context of the invocation, sets an environment variable with a given name and value.
//   toObject(): returns a plain object containing all the environment variables and their values.
