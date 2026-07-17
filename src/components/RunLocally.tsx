import {
  ANALYZE_CMD,
  DOCKER_RUN,
  DOCS_URL,
  GITHUB_EXAMPLES,
  INSTALL_CLI,
} from '../lib/constants';

export function RunLocally() {
  return (
    <section className="section section-bordered run-locally" aria-labelledby="local-heading">
      <header className="section-header section-header-tight">
        <h2 id="local-heading">Run locally</h2>
        <p className="section-sub">
          Self-host the API or use the CLI against your own stack. The hosted playground
          is optional — see <a href={DOCS_URL}>Quickstart</a> for full setup.
        </p>
      </header>

      <div className="run-locally-grid">
        <div className="run-locally-block">
          <h3>CLI</h3>
          <pre className="developer-snippet"><code>{INSTALL_CLI}</code></pre>
          <pre className="developer-snippet"><code>{ANALYZE_CMD}</code></pre>
        </div>

        <div className="run-locally-block">
          <h3>Docker</h3>
          <pre className="developer-snippet"><code>{DOCKER_RUN}</code></pre>
        </div>
      </div>

      <p className="run-locally-foot">
        Example ecosystem:{' '}
        <a href={GITHUB_EXAMPLES} target="_blank" rel="noopener noreferrer">
          ScholarSeal &amp; more in examples/
        </a>
      </p>
    </section>
  );
}
