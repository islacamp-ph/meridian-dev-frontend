import { DOCS_URL, GITHUB_REPO, INSTALL_CLI } from '../lib/constants';

export function Cta() {
  return (
    <section id="get-started" className="section section-bordered cta-section">
      <div className="cta-inner">
        <h2>Start before you submit</h2>
        <p className="cta-sub">Open source · MIT · install in one line.</p>
        <div className="cta-actions">
          <a className="btn btn-primary" href={DOCS_URL}>
            Quickstart
          </a>
          <a className="btn btn-secondary" href="/playground">
            Playground
          </a>
          <a
            className="btn btn-secondary"
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
        <p className="cta-install">
          <code>{INSTALL_CLI}</code>
        </p>
      </div>
    </section>
  );
}
