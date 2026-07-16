import { DOCS_URL } from '../lib/constants';
import { developerTools } from '../lib/developers';

export function DeveloperTools() {
  const featured = developerTools[0];

  return (
    <section id="developers" className="section section-bordered">
      <header className="section-header section-header-tight">
        <h2>Developers</h2>
        <p>CLI, SDKs, API, and CI — same pipeline everywhere.</p>
      </header>

      <ul className="tool-chips" aria-label="Developer surfaces">
        {developerTools.map((tool) => (
          <li key={tool.id}>
            <span className="tool-chip-name">{tool.name}</span>
            <code>{tool.package}</code>
          </li>
        ))}
      </ul>

      <div className="tool-feature">
        <div className="tool-feature-head">
          <h3>{featured.name}</h3>
          <a href={DOCS_URL}>Docs waitlist →</a>
        </div>
        <pre className="developer-snippet"><code>{featured.example}</code></pre>
      </div>
    </section>
  );
}
