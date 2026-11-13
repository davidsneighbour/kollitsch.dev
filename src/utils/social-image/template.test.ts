// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { siteTitle } from './site-info.ts';
import { markup } from './template.ts';

type VNode = {
  type?: string;
  props?: {
    children?: unknown;
    style?: { fontWeight?: string; margin?: string };
  };
};

function findNodes(node: unknown, match: (n: VNode) => boolean): VNode[] {
  if (!node || typeof node !== 'object') return [];
  const vnode = node as VNode;
  const children = vnode.props?.children;
  const list = Array.isArray(children) ? children : [children];
  return [
    ...(match(vnode) ? [vnode] : []),
    ...list.flatMap((child) => findNodes(child, match)),
  ];
}

describe('markup', () => {
  const tree = markup('Title', 'Date', 1200, 630, '');

  it('renders the title in the registered 400 weight', () => {
    const [h1] = findNodes(tree, (n) => n.type === 'h1');
    expect(h1?.props?.style?.fontWeight).toBe('400');
  });

  it('pins the site title margin so the footer position stays stable', () => {
    const [footerTitle] = findNodes(
      tree,
      (n) => n.type === 'p' && n.props?.children === siteTitle,
    );
    expect(footerTitle?.props?.style?.margin).toBe('20px 0');
  });
});
