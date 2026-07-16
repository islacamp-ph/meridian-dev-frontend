import { outcomes } from '../lib/outcomes';

export function Outcomes() {
  return (
    <section id="outcomes" className="section">
      <header className="section-header section-header-tight">
        <h2>What you get</h2>
        <p>Actionable signal — not another log dump.</p>
      </header>

      <ul className="outcomes-strip">
        {outcomes.map((item) => (
          <li key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
