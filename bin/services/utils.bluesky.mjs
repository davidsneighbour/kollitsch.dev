/**
 * @param {*} post
 * @param {*} blob
 * @returns
 */
export const createBlueskyEmbed = async (post, blob) => {
  let embed = {
    "$type": "app.bsky.embed.external",
    external: {
      uri: post.link[0],
      title: post.title[0],
      description: post.description[0],
      thumb: blob,
    }
  };

  return embed;
}

/**
 * @param {*} post
 * @returns
 * @todo add description to the post
 */
export const createBlueSkyPost = async (post) => {
  let content = "A new post on KOLLITSCH.dev* titled: ";
  content += post.title[0];
  content += "\n\n";
  content += post.link[0];

  return content;
}

/**
 * @param {*} text
 * @returns
 * @todo retrieve the account data from the server
 */
export function parseMentions(text) {
  const spans = [];
  // regex based on: https://atproto.com/specs/handle#handle-identifier-syntax
  const mentionRegex = /[$|\W](@([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)/g;

  let m;
  while ((m = mentionRegex.exec(text)) !== null) {
    // spans.push({
    //   index: {
    //     byteStart: m.index + 1,
    //     byteEnd: m.index + m[1].length
    //   },
    //   features: [
    //     {
    //       "$type": "app.bsky.richtext.facet#mention",
    //       handle: m[1].substring(1)
    //     }
    //   ]
    // });
  }
  return spans;
}

/**
 * @param {*} text
 * @returns
 */
export function parseUrls(text) {
  const spans = [];
  // partial/naive URL regex based on: https://stackoverflow.com/a/3809435
  const urlRegex = /[$|\W](https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*[-a-zA-Z0-9@%_\+~#\/\/=])?)/g;

  let m;
  while ((m = urlRegex.exec(text)) !== null) {
    spans.push({
      index: {
        byteStart: m.index + 1,
        byteEnd: m.index + m[1].length
      },
      features: [
        {
          "$type": "app.bsky.richtext.facet#link",
          uri: m[1],
        }
      ]
    });
  }

  return spans;
}
