import fs from 'node:fs';
import path from 'path';

/**
 *
 * @param {*} feed
 * @param {*} localFileName
 * @returns
 */
export const preparePostObject = (feed, localFileName) => {
  const link = path.parse(feed.rss.channel[0].item[0].link[0]).dir;

  return {
    content: [
      {
        type: 'text',
        subtype: 'heading1',
        text: feed.rss.channel[0].item[0].title[0],
      },
      {
        type: 'image',
        media: fs.createReadStream(new URL(localFileName, import.meta.url)),
        alt_text: 'Article header image',
      },
      {
        type: 'text',
        text: feed.rss.channel[0].item[0].description[0],
      },
      {
        type: 'text',
        text: 'Read on at kollitsch.dev',
        formatting: [
          {
            start: 11,
            end: 24,
            type: 'link',
            url: feed.rss.channel[0].item[0].link[0],
          },
        ],
      },
    ],
    layout: [
      {
        type: 'rows',
        display: [
          { blocks: [0] },
          { blocks: [1] },
          { blocks: [2] },
          { blocks: [3] },
        ],
      },
    ],
    slug: link,
  };
};
