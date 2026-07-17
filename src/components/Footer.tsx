import { DOCS_URL, GITHUB_EXAMPLES, GITHUB_REPO, INSTALL_CLI } from '../lib/constants';

export function Footer() {
  return (
    <footer className="site-footer">
      <p className="footer-left">
        <strong>Meridian</strong>
        <span className="footer-oss">Open source · MIT</span>
      </p>
      <div className="footer-links">
        <a href={DOCS_URL}>Docs</a>
        <a href="/playground">Playground</a>
        <a href="/ci">CI</a>
        <a href="/manifests">Manifests</a>
        <a href="/about">About</a>
        <a href="/changelog">Changelog</a>
        <a href={GITHUB_EXAMPLES} target="_blank" rel="noopener noreferrer">Examples</a>
        <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
      <p className="footer-install">
        <code>{INSTALL_CLI}</code>
      </p>
    </footer>
  );
}
