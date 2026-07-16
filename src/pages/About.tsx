import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { DOCS_URL, GITHUB_REPO } from '../lib/constants';

const PAGE_LINKS = [
  { href: '/playground', label: 'Playground' },
  { href: '/about', label: 'About' },
  { href: '/changelog', label: 'Changelog' },
  { href: DOCS_URL, label: 'Docs' },
];

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
            a layer between your app and the chain.
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
              and downstream impact. Same pipeline from CLI, SDK, API, or CI.
            </p>
          </section>

          <section className="content-block">
            <h2>Who builds it</h2>
            <p>
              Meridian is an early-beta product for developers shipping on
              Stellar. Follow the work on{' '}
              <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              , or reach us at{' '}
              <a href="mailto:hello@meridian.dev">hello@meridian.dev</a>.
            </p>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
