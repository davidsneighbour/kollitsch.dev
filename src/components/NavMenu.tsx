import React from 'react';

export interface NavItem {
  label: string;
  link: string;
  children?: NavItem[];
}

interface Props {
  items: NavItem[];
  currentPath: string;
}

export default function NavMenu({ items, currentPath }: Props) {
  return (
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <NavItemComponent key={idx} item={item} currentPath={currentPath} />
      ))}
    </ul>
  );
}

function NavItemComponent({ item, currentPath }: { item: NavItem; currentPath: string }) {
  const hasChildren = !!item.children?.length;
  const isExactMatch = currentPath === item.link;
  const isActive =
    isExactMatch ||
    (hasChildren &&
      item.children!.some(
        (child) =>
          currentPath === child.link || currentPath.startsWith(child.link)
      ));

  return (
    <li className={`ml-2 ${isActive ? 'font-bold text-blue-600' : ''}`}>
      <div className="flex items-center gap-2">
        <a
          href={item.link}
          className={`${isExactMatch ? 'underline text-blue-800 active-child' : ''}`}
        >
          {item.label}
        </a>
      </div>

      {hasChildren && (
        <ul className="ml-4 border-l pl-2 mt-1 space-y-1">
          {item.children!.map((child, idx) => (
            <NavItemComponent key={idx} item={child} currentPath={currentPath} />
          ))}
        </ul>
      )}
    </li>
  );
}
