import { DOCS_URL } from './constants';

export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

export const PAGE_LINKS: NavLink[] = [
  { href: '/playground', label: 'Playground' },
  { href: '/about', label: 'About' },
  { href: '/changelog', label: 'Changelog' },
  { href: DOCS_URL, label: 'Docs' },
];

export const DEFAULT_LINKS: NavLink[] = PAGE_LINKS;
