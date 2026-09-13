/**
 * Isomorphic pieces of the `/stream/` Mastodon integration: the normalised
 * status shape and thread-grouping logic. Deliberately free of Node-only
 * imports (`node:fs`, `sanitize-html`, `turndown`) so it can be bundled into
 * the client-side stream page as well as imported from
 * `@utils/mastodon-stream.ts` on the server.
 */

export interface StreamMedia {
  url: string | null;
  previewUrl: string | null;
  description: string | null;
  type: string;
}

export interface StreamStatus {
  id: string;
  uri: string;
  url: string | null;
  createdAt: string;
  contentHtml: string;
  spoilerText: string;
  sensitive: boolean;
  inReplyToId: string | null;
  media: StreamMedia[];
  counts: { replies: number; favourites: number; boosts: number };
}

export interface StreamThread {
  root: StreamStatus;
  replies: StreamStatus[];
}

/**
 * Groups eligible statuses into threads: a root post (no `inReplyToId`, or a
 * reply whose parent isn't in the set) followed by its self-reply chain, in
 * chronological order within the thread. Statuses must already be filtered
 * to stream-eligible statuses.
 */
export function groupSelfReplyThreads(
  statuses: StreamStatus[],
): StreamThread[] {
  const byId = new Map(statuses.map((status) => [status.id, status]));
  const childrenByParent = new Map<string, StreamStatus[]>();
  const roots: StreamStatus[] = [];

  for (const status of statuses) {
    const parentId = status.inReplyToId;
    if (parentId && byId.has(parentId)) {
      const siblings = childrenByParent.get(parentId) ?? [];
      siblings.push(status);
      childrenByParent.set(parentId, siblings);
    } else {
      roots.push(status);
    }
  }

  const flattenChain = (root: StreamStatus): StreamStatus[] => {
    const chain: StreamStatus[] = [];
    let current: StreamStatus | undefined = root;
    while (current) {
      const children = childrenByParent.get(current.id);
      const next = children?.[0];
      if (next) chain.push(next);
      current = next;
    }
    return chain;
  };

  return roots
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .map((root) => ({ replies: flattenChain(root), root }));
}
