import { Config, Context } from "@netlify/functions";

export default async (request: Request, context: Context) => {

  const url = request.url.split('/');
  console.log(url[5]);
  const name = url[5] ?? "World";


  return new Response(`Hello, ${name}!`);
};

export const config: Config = {
  path: [
    "/api/test",
    "/api/test/:something",
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
