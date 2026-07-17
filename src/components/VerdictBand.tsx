const verdicts = [
  {
    state: 'CLEAR',
    tone: 'clear',
    summary: 'Safe to submit.',
  },
  {
    state: 'WARN',
    tone: 'warn',
    summary: 'Proceed with caution.',
  },
  {
    state: 'ABORT',
    tone: 'abort',
    summary: 'Do not submit.',
  },
] as const;

export function VerdictBand() {
  return (
    <section className="section section-bordered verdict-band" aria-labelledby="verdict-heading">
      <header className="section-header section-header-tight">
        <h2 id="verdict-heading">A verdict you can act on</h2>
      </header>

      <ul className="verdict-states">
        {verdicts.map((item) => (
          <li key={item.state} className={`verdict-state verdict-${item.tone}`}>
            <span className={`tag tag-${item.tone}`}>{item.state}</span>
            <p>{item.summary}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
