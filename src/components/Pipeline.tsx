import { pipelineLayers } from '../lib/developers';

export function Pipeline() {
  return (
    <section id="pipeline" className="section">
      <header className="section-header section-header-tight">
        <h2>How it works</h2>
        <p>Four layers. One call before submit.</p>
      </header>

      <ol className="pipeline-strip">
        {pipelineLayers.map((layer, index) => (
          <li key={layer.name}>
            <span className="pipeline-step" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h3>{layer.name}</h3>
            <p>{layer.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
