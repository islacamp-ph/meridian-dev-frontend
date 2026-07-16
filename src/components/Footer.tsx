import { DOCS_URL, GITHUB_REPO, INSTALL_CLI } from '../lib/constants';

export function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-left">
        <strong>Meridian</strong>
      </p>
      <div className="footer-links">
        <a href={DOCS_URL}>Docs</a>
        <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="mailto:hello@meridian.dev">Contact</a>
      </div>
      <p className="footer-install">
        <code>{INSTALL_CLI}</code>
      </p>
    </footer>
  );
}
