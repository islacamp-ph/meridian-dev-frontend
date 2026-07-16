import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { DOCS_URL } from '../lib/constants';

const PAGE_LINKS = [
  { href: '/playground', label: 'Playground' },
  { href: '/about', label: 'About' },
  { href: '/changelog', label: 'Changelog' },
  { href: DOCS_URL, label: 'Docs' },
];

const entries = [
  {
    date: '2026-07-08',
    title: 'Early beta dashboard',
    items: [
      'Account sign-in and API key management',
      'Usage overview and integration snippets',
      'Docs waitlist for early access',
    ],
  },
  {
    date: '2026-06-20',
    title: 'Developer surfaces',
    items: [
      'CLI package meridian-core',
      'JavaScript and Python SDK clients',
      'GitHub Action for CI verdict gates',
    ],
  },
  {
    date: '2026-05-12',
    title: 'Core pipeline',
    items: [
      'TRACE → FIELD → GRAVITY → BRIEF analysis path',
      'CLEAR / WARN / ABORT verdicts',
      'Blast-radius scoring and plain-language briefs',
    ],
  },
  {
    date: '2026-04-01',
    title: 'Meridian launched',
    items: [
      'Public site and early access waitlist',
      'First testnet analysis endpoints',
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
            Notable releases and milestones. Dates are approximate for early beta.
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
