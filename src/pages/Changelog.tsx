import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { PAGE_LINKS } from '../lib/nav';

const entries = [
  {
    date: '2026-07-17',
    title: 'Public site aligned with meridian-core',
    items: [
      'Quickstart docs, CI and manifests pages',
      'CLI-first hero, verdict band, run-locally section',
      'Developer links to npm, PyPI, examples, and Action source',
    ],
  },
  {
    date: '2026-07-08',
    title: 'Early beta dashboard',
    items: [
      'Account sign-in and API key management',
      'Usage overview and integration snippets',
      'Hosted API optional — CLI and self-host supported',
    ],
  },
  {
    date: '2026-06-20',
    title: 'Developer surfaces',
    items: [
      'CLI package meridian-core on npm',
      '@meridian/stellar and meridian-py SDKs',
      'GitHub Action for CI verdict gates',
      'Ecosystem manifest init and validate',
    ],
  },
  {
    date: '2026-05-12',
    title: 'Core pipeline',
    items: [
      'TRACE → FIELD → GRAVITY → BRIEF analysis path',
      'CLEAR / WARN / ABORT verdicts with fix_sequence',
      'Blast-radius scoring, TTL and archival warnings',
    ],
  },
  {
    date: '2026-04-01',
    title: 'Meridian launched',
    items: [
      'meridian-core monorepo open sourced (MIT)',
      'First testnet analyze endpoints',
    ],
  },
] as const;

export function Changelog() {
  return (
    <div className="page content-page">
      <SiteHeader links={PAGE_LINKS} />

      <main className="content-main">
        <article className="content-article">
          <p className="content-eyebrow">Changelog</p>
          <h1>What shipped</h1>
          <p className="content-lead">
            Notable releases and milestones from the meridian-core monorepo and this site.
          </p>

          <ol className="changelog-list">
            {entries.map((entry) => (
              <li key={entry.date} className="changelog-entry">
                <time className="changelog-date" dateTime={entry.date}>
                  {formatDate(entry.date)}
                </time>
                <div className="changelog-body">
                  <h2>{entry.title}</h2>
                  <ul>
                    {entry.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </article>
      </main>

      <Footer />
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
