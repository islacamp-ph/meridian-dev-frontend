import { integrations } from '../lib/scenarios';

export function Integrations() {
  return (
    <section id="integrations" className="section">
      <header className="section-header section-header-tight">
        <h2>Where it fits</h2>
        <p>Drop in before submit — pipeline, wallet, or ops.</p>
      </header>

      <ul className="integration-strip">
        {integrations.map((item) => (
          <li key={item.title}>
            <span className="integration-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
