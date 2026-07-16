import { DOCS_URL, GITHUB_REPO, INSTALL_CLI } from '../lib/constants';

export function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-left">
        <strong>Meridian</strong>
      </p>
      <div className="footer-links">
        <a href="/playground">Playground</a>
        <a href="/about">About</a>
        <a href="/changelog">Changelog</a>
        <a href={DOCS_URL}>Docs</a>
        <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
      <p className="footer-install">
        <code>{INSTALL_CLI}</code>
      </p>
    </footer>
  );
}
