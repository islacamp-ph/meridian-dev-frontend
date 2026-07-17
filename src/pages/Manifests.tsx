import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { PAGE_LINKS } from '../lib/nav';
import {
  DOCS_URL,
  GITHUB_MANIFESTS,
  MANIFEST_INIT,
  MANIFEST_VALIDATE,
} from '../lib/constants';

const sampleManifest = `{
  "name": "my-ecosystem",
  "network": "testnet",
  "contracts": [],
  "policies": { "fail_on": "ABORT" }
}`;

export function Manifests() {
  return (
    <div className="page content-page">
      <SiteHeader links={PAGE_LINKS} ctaHref={DOCS_URL} ctaLabel="Quickstart" />

      <main className="content-main">
        <article className="content-article">
          <p className="content-eyebrow">Manifests</p>
          <h1>Ecosystem manifests</h1>
          <p className="content-lead">
            Declare contracts, policies, and network defaults in one file.
            Init, validate, and share across teams and CI.
          </p>

          <section className="content-block">
            <h2>Init</h2>
            <pre className="developer-snippet"><code>{MANIFEST_INIT}</code></pre>
          </section>

          <section className="content-block">
            <h2>Validate</h2>
            <pre className="developer-snippet"><code>{MANIFEST_VALIDATE}</code></pre>
          </section>

          <section className="content-block">
            <h2>Shape</h2>
            <pre className="developer-snippet"><code>{sampleManifest}</code></pre>
          </section>

          <p className="content-foot">
            Examples in{' '}
            <a href={GITHUB_MANIFESTS} target="_blank" rel="noopener noreferrer">
              manifests/
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
