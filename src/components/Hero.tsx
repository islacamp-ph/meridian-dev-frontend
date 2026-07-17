import { DOCS_URL, GITHUB_REPO, INSTALL_CLI } from '../lib/constants';

export function Hero() {
  return (
    <section className="hero hero-centered" aria-labelledby="hero-heading">
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-wash" />
      </div>

      <div className="hero-main">
        <p className="hero-brand">Meridian</p>

        <h1 id="hero-heading">
          Know what crosses <em className="hero-accent">before</em> it does.
        </h1>

        <p className="hero-lead">
          Pre-execution intelligence for Stellar. Simulate, score blast radius,
          and get a verdict before you submit.
        </p>

        <div className="hero-actions">
          <a className="btn btn-primary" href={DOCS_URL}>
            Quickstart
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

        <p className="hero-note">
          <code>{INSTALL_CLI}</code>
        </p>
      </div>
    </section>
  );
}
