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

export const createBlueSkyPost = async (post) => {
  let content = "A new post on KOLLITSCH.dev* titled: ";
  content += post.title[0];
  content += "\n\n";
  content += post.link[0];
  content += "\n\n";
  content += "via @kollitsch.dev";

  return content;
}

export function parseMentions(text) {
  const spans = [];
  // regex based on: https://atproto.com/specs/handle#handle-identifier-syntax
  const mentionRegex = /[$|\W](@([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)/g;

  let m;
  while ((m = mentionRegex.exec(text)) !== null) {
    spans.push({
      start: m.index + 1,
      end: m.index + m[1].length,
      handle: m[1].substring(1)
    });
  }

  return spans;
}

export function parseUrls(text) {
  const spans = [];
  // partial/naive URL regex based on: https://stackoverflow.com/a/3809435
  const urlRegex = /[$|\W](https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*[-a-zA-Z0-9@%_\+~#\/\/=])?)/g;

  let m;
  while ((m = urlRegex.exec(text)) !== null) {
    spans.push({
      start: m.index + 1,
      end: m.index + m[1].length,
      url: m[1]
    });
  }

  return spans;
}