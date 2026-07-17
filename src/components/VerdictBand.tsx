import { pipelineLayers } from '../lib/developers';

const verdicts = [
  {
    state: 'CLEAR',
    tone: 'clear',
    summary: 'Safe to submit — no blocking issues in the trace.',
  },
  {
    state: 'WARN',
    tone: 'warn',
    summary: 'Proceed with caution — TTL, archival, or dependency risk flagged.',
  },
  {
    state: 'ABORT',
    tone: 'abort',
    summary: 'Do not submit — simulation failed or blast radius is too high.',
  },
] as const;

export function VerdictBand() {
  return (
    <section className="section section-bordered verdict-band" aria-labelledby="verdict-heading">
      <header className="section-header section-header-tight">
        <h2 id="verdict-heading">Verdict you can act on</h2>
        <p className="section-sub">
          Same pipeline from CLI, SDK, API, or CI — with optional{' '}
          <code>fix_sequence</code> steps when something blocks.
        </p>
      </header>

      <ul className="verdict-states">
        {verdicts.map((item) => (
          <li key={item.state} className={`verdict-state verdict-${item.tone}`}>
            <span className={`tag tag-${item.tone}`}>{item.state}</span>
            <p>{item.summary}</p>
          </li>
        ))}
      </ul>

      <ol className="pipeline-strip" aria-label="Analysis pipeline">
        {pipelineLayers.map((layer, index) => (
          <li key={layer.name}>
            <span className="pipeline-name">{layer.name}</span>
            <span className="pipeline-desc">{layer.description}</span>
            {index < pipelineLayers.length - 1 && (
              <span className="pipeline-arrow" aria-hidden="true">
                →
              </span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
