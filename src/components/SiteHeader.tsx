import { useEffect, useState } from 'react';
import { BrandMark } from './BrandMark';
import { DOCS_URL, GITHUB_REPO } from '../lib/constants';
import { DEFAULT_LINKS, type NavLink } from '../lib/nav';

export type { NavLink };

interface SiteHeaderProps {
  links?: NavLink[];
  showSignIn?: boolean;
  showGithub?: boolean;
  ctaHref?: string;
  ctaLabel?: string;
}

function isActiveLink(href: string, pathname: string): boolean {
  if (href.startsWith('http')) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({
  links = DEFAULT_LINKS,
  showSignIn = true,
  showGithub = false,
  ctaHref = DOCS_URL,
  ctaLabel = 'Quickstart',
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pathname, setPathname] = useState('/');

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-open', menuOpen);
    return () => document.body.classList.remove('nav-open');
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 800) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <a href="/" className="brand" onClick={closeMenu}>
        <BrandMark />
        <span className="brand-name">Meridian</span>
      </a>

      <button
        type="button"
        className="nav-toggle"
        aria-expanded={menuOpen}
        aria-controls="site-nav-panel"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
        <span className="nav-toggle-bar" aria-hidden="true" />
        <span className="nav-toggle-bar" aria-hidden="true" />
        <span className="nav-toggle-bar" aria-hidden="true" />
      </button>

      <div
        id="site-nav-panel"
        className={`site-nav-panel ${menuOpen ? 'site-nav-panel-open' : ''}`}
      >
        <nav className="site-nav" aria-label="Main navigation">
          {links.map((link) => {
            const active = !link.external && isActiveLink(link.href, pathname);
            return (
              <a
                key={link.href + link.label}
                href={link.href}
                className={active ? 'nav-link-active' : undefined}
                aria-current={active ? 'page' : undefined}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={closeMenu}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="header-actions">
          {showSignIn && (
            <a className="link-button" href="/login" onClick={closeMenu}>
              Sign in
            </a>
          )}
          {showGithub && (
            <a
              className="link-button"
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
          <a className="btn btn-primary compact" href={ctaHref} onClick={closeMenu}>
            {ctaLabel}
          </a>
        </div>
      </div>

      {menuOpen && (
        <button
          type="button"
          className="nav-backdrop"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}
    </header>
  );
}
