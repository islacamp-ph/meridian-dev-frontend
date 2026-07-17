import { developerTools } from '../lib/developers';
import { integrations } from '../lib/scenarios';

export function DeveloperTools() {
  const featured = developerTools[0];

  return (
    <section id="developers" className="section section-bordered">
      <header className="section-header section-header-tight">
        <h2>Developers</h2>
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
        <pre className="developer-snippet"><code>{featured.example}</code></pre>
      </div>

      <ul className="integration-names" aria-label="Integrations">
        {integrations.map((item) => (
          <li key={item.title}>{item.title}</li>
        ))}
      </ul>
    </section>
  );
}
