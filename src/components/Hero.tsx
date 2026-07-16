import { useEffect, useState } from 'react';
import { scenarios, type Scenario } from '../lib/scenarios';
import { DOCS_URL } from '../lib/constants';

const CYCLE_MS = 5000;

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-atmosphere" aria-hidden="true">
        <div className="hero-wash" />
      </div>

      <div className="hero-main">
        <p className="hero-brand">Meridian</p>

        <h1 id="hero-heading">
          Know what crosses <em className="hero-accent">before</em> it does.
        </h1>

        <div className="hero-actions">
          <a className="btn btn-primary" href={DOCS_URL}>
            Get early access
          </a>
        </div>
      </div>

      <HeroPanel />
    </section>
  );
}

function HeroPanel() {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const [entered, setEntered] = useState(false);
  const scenario = scenarios[index];

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % scenarios.length);
        setFading(false);
      }, 350);
    }, CYCLE_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`hero-panel-wrap ${entered ? 'hero-panel-entered' : ''}`}>
      <ScenarioOutput scenario={scenario} fading={fading} />
      <div className="hero-dots" role="tablist" aria-label="Example transactions">
        {scenarios.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={s.name}
            className={`hero-dot ${i === index ? 'hero-dot-active' : ''}`}
            onClick={() => {
              setFading(true);
              setTimeout(() => {
                setIndex(i);
                setFading(false);
              }, 200);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ScenarioOutput({ scenario, fading }: { scenario: Scenario; fading: boolean }) {
  return (
    <aside
      className={`hero-output ${fading ? 'hero-output-fade' : ''}`}
      aria-label="Sample analysis output"
      aria-live="polite"
    >
      <div className="output-bar">
        <span className="output-title">Analysis</span>
        <span className="output-meta">{scenario.label}</span>
      </div>
      <p className="output-scenario-name">{scenario.name}</p>
      <dl className="output-fields">
        <div className="output-row">
          <dt>Verdict</dt>
          <dd>
            <span className={`tag tag-${scenario.verdict}`}>{scenario.verdict.toUpperCase()}</span>
          </dd>
        </div>
        <div className="output-row">
          <dt>Confidence</dt>
          <dd>{scenario.confidence}%</dd>
        </div>
        <div className="output-row">
          <dt>Blast radius</dt>
          <dd>{scenario.blastRadius}</dd>
        </div>
        <div className="output-row">
          <dt>Contracts</dt>
          <dd>{scenario.contracts}</dd>
        </div>
      </dl>
      <div className="output-brief">
        <p className="output-brief-text">{scenario.brief}</p>
      </div>
    </aside>
  );
}
