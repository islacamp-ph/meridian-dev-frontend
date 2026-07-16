import { DOCS_URL, GITHUB_REPO } from '../lib/constants';

export function Cta() {
  return (
    <section id="get-started" className="section section-bordered cta-section">
      <div className="cta-inner">
        <h2>Start before you submit</h2>
        <div className="cta-actions">
          <a className="btn btn-primary" href={DOCS_URL}>
            Get early access
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
      </div>
    </section>
  );
}
