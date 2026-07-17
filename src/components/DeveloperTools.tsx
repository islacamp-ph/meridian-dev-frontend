import { developerTools } from '../lib/developers';
import {
  DIFF_CMD,
  DOCS_URL,
  GITHUB_EXAMPLES,
  GITHUB_MANIFESTS,
  GITHUB_REPO,
} from '../lib/constants';

export function DeveloperTools() {
  const featured = developerTools[0];

  return (
    <section id="developers" className="section section-bordered">
      <header className="section-header section-header-tight">
        <h2>Developers</h2>
        <p className="section-sub">
          CLI-first. Same analyze path everywhere — diff, policy, and deep discovery
          on the CLI.{' '}
          <a href={DOCS_URL}>Full reference →</a>
        </p>
      </header>

      <ul className="tool-chips" aria-label="Developer surfaces">
        {developerTools.map((tool) => (
          <li key={tool.id}>
            <a
              className="tool-chip-link"
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="tool-chip-name">{tool.name}</span>
              <code>{tool.package}</code>
            </a>
          </li>
        ))}
      </ul>

      <div className="tool-feature">
        <pre className="developer-snippet"><code>{featured.example}</code></pre>
      </motion>

      <div className="tool-commands">
        <p className="tool-commands-label">Also on the CLI</p>
        <pre className="developer-snippet"><code>{DIFF_CMD}</code></pre>
        <pre className="developer-snippet compact"><code>meridian analyze &lt;xdr&gt; --policy strict --deep-discovery</code></pre>
      </div>

      <ul className="dev-resource-links">
        <li>
          <a href={GITHUB_EXAMPLES} target="_blank" rel="noopener noreferrer">
            examples/
          </a>
        </li>
        <li>
          <a href={GITHUB_MANIFESTS} target="_blank" rel="noopener noreferrer">
            manifests/
          </a>
        </li>
        <li>
          <a href="/ci">GitHub Action</a>
        </li>
        <li>
          <a href={GITHUB_REPO} target="_blank" rel="noopener noreferrer">
            Source
          </a>
        </li>
      </ul>
    </section>
  );
}
