import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { PAGE_LINKS } from '../lib/nav';
import {
  ANALYZE_CMD,
  DIFF_CMD,
  DOCS_URL,
  GITHUB_DOCS_SRC,
  GITHUB_README,
  GITHUB_REPO,
  INSTALL_CLI,
  INSTALL_JS,
  INSTALL_PY,
} from '../lib/constants';

export function Docs() {
  return (
    <div className="page content-page">
      <SiteHeader links={PAGE_LINKS} ctaHref="/playground" ctaLabel="Playground" />

      <main className="content-main">
        <article className="content-article">
          <p className="content-eyebrow">Docs</p>
          <h1>Quickstart</h1>
          <p className="content-lead">
            Install the CLI, analyze a transaction, and wire the same pipeline into
            your app or CI. Full Starlight docs live in the monorepo.
          </p>

          <section className="content-block">
            <h2>Install</h2>
            <pre className="developer-snippet"><code>{INSTALL_CLI}</code></pre>
          </section>

          <section className="content-block">
            <h2>Analyze</h2>
            <pre className="developer-snippet"><code>{ANALYZE_CMD}</code></pre>
            <p>
              Verdict is <code>CLEAR</code>, <code>WARN</code>, or <code>ABORT</code>.
              On <code>WARN</code> or <code>ABORT</code>, check <code>fix_sequence</code> for
              suggested next steps.
            </p>
          </section>

          <section className="content-block">
            <h2>Compare &amp; policy</h2>
            <pre className="developer-snippet"><code>{DIFF_CMD}</code></pre>
            <pre className="developer-snippet compact"><code>meridian analyze &lt;xdr&gt; --policy strict --deep-discovery</code></pre>
          </section>

          <section className="content-block">
            <h2>SDKs</h2>
            <pre className="developer-snippet"><code>{INSTALL_JS}</code></pre>
            <pre className="developer-snippet"><code>{INSTALL_PY}</code></pre>
          </section>

          <section className="content-block">
            <h2>More</h2>
            <ul className="content-links">
              <li>
                <a href="/ci">GitHub Action — block merges on ABORT</a>
              </li>
              <li>
                <a href="/manifests">Ecosystem manifests — init &amp; validate</a>
              </li>
              <li>
                <a href="/playground">Playground — paste XDR in the browser</a>
              </li>
              <li>
                <a href={GITHUB_README} target="_blank" rel="noopener noreferrer">
                  README on GitHub
                </a>
              </li>
              <li>
                <a href={GITHUB_DOCS_SRC} target="_blank" rel="noopener noreferrer">
                  Starlight docs source (apps/docs)
                </a>
              </li>
            </ul>
          </section>

          <p className="content-foot">
            Meridian is <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">open source (MIT)</a>.
            Hosted API and dashboard are early beta.
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
