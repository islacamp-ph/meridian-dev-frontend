import { DOCS_URL } from './constants';

export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

export const PAGE_LINKS: NavLink[] = [
  { href: DOCS_URL, label: 'Docs' },
  { href: '/playground', label: 'Playground' },
  { href: '/ci', label: 'CI' },
  { href: '/manifests', label: 'Manifests' },
  { href: '/about', label: 'About' },
];
