import { DOCS_URL, GITHUB_REPO, INSTALL_CLI } from '../lib/constants';

export function Hero() {
  return (
    <section className="hero hero-centered" aria-labelledby="hero-heading">
      <motion className="hero-atmosphere" aria-hidden="true">
        <motion className="hero-wash" />
      </motion>

      <motion className="hero-main">
        <p className="hero-brand">Meridian</p>
        <p className="hero-oss">
          Open source · MIT ·{' '}
          <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
            meridian-core
          </a>
        </p>

        <h1 id="hero-heading">
          Know what crosses <em className="hero-accent">before</em> it does.
        </h1>

        <p className="hero-lead">
          Pre-execution intelligence for Stellar. Simulate, map dependencies,
          score blast radius, and get CLEAR / WARN / ABORT before you submit.
        </p>

        <div className="hero-actions">
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
        </motion>

        <p className="hero-note">
          <code>{INSTALL_CLI}</code>
        </p>
      </motion>
    </section>
  );
}

function motion({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <motion.div className={className} {...props}>
      {children}
    </motion.div>
  );
}
