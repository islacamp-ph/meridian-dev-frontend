import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { PAGE_LINKS } from '../lib/nav';
import { DOCS_URL, GITHUB_ACTION } from '../lib/constants';

const workflowYaml = `name: Meridian gate

on:
  pull_request:

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: islacamp-ph/meridian-dev-backend/packages/meridian-action@v1
        with:
          tx-file: tx.xdr
          network: testnet
          fail-on: ABORT`;

export function CiAction() {
  return (
    <div className="page content-page">
      <SiteHeader links={PAGE_LINKS} ctaHref={DOCS_URL} ctaLabel="Quickstart" />

      <main className="content-main">
        <article className="content-article">
          <p className="content-eyebrow">CI</p>
          <h1>GitHub Action</h1>
          <p className="content-lead">
            Run the same analyze pipeline in pull requests. Fail the build when
            Meridian returns <code>ABORT</code> — or tighten to <code>WARN</code>.
          </p>

          <section className="content-block">
            <h2>Workflow</h2>
            <pre className="developer-snippet"><code>{workflowYaml}</code></pre>
          </section>

          <section className="content-block">
            <h2>Inputs</h2>
            <ul>
              <li><code>tx-file</code> — path to base64 XDR on disk</li>
              <li><code>network</code> — <code>testnet</code> or <code>mainnet</code></li>
              <li><code>fail-on</code> — <code>ABORT</code> (default) or <code>WARN</code></li>
              <li><code>api-url</code> — optional self-hosted API base URL</li>
            </ul>
          </section>

          <p className="content-foot">
            Source:{' '}
            <a href={GITHUB_ACTION} target="_blank" rel="noopener noreferrer">
              packages/meridian-action
            </a>
            {' · '}
            <a href={DOCS_URL}>Quickstart</a>
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
