import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { PAGE_LINKS } from '../lib/nav';
import { DOCS_URL, GITHUB_EXAMPLES, GITHUB_REPO } from '../lib/constants';

export function About() {
  return (
    <div className="page content-page">
      <SiteHeader links={PAGE_LINKS} />

      <main className="content-main">
        <article className="content-article">
          <p className="content-eyebrow">About</p>
          <h1>Built for the moment before submit</h1>
          <p className="content-lead">
            Meridian is pre-execution intelligence for Stellar developers —
            open source under MIT in the{' '}
            <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
              meridian-core
            </a>{' '}
            monorepo.
          </p>

          <section className="content-block">
            <h2>Why Stellar</h2>
            <p>
              Stellar and Soroban make fast, low-cost finance possible — and
              that speed raises the cost of a bad transaction. Meridian exists
              so teams can see the full path, dependencies, and blast radius
              before funds move.
            </p>
          </section>

          <section className="content-block">
            <h2>The thesis</h2>
            <p>
              Simulation alone is not enough. You need a verdict you can act on:
              CLEAR, WARN, or ABORT — grounded in execution traces, TTL risk,
              archival warnings, and downstream impact. Same pipeline from CLI,
              SDK, API, or CI, with optional <code>fix_sequence</code> guidance.
            </p>
          </section>

          <section className="content-block">
            <h2>Open source</h2>
            <p>
              Core packages ship on npm and PyPI. Examples like{' '}
              <a href={GITHUB_EXAMPLES} target="_blank" rel="noopener noreferrer">
                ScholarSeal
              </a>{' '}
              live in the repo. Hosted API and dashboard are early beta — start
              with the <a href={DOCS_URL}>Quickstart</a> or run locally.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
