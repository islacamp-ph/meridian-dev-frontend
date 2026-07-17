import { FormEvent, useState } from 'react';
import { SiteHeader } from '../components/SiteHeader';
import { Footer } from '../components/Footer';
import { PAGE_LINKS } from '../lib/nav';
import {
  ANALYZE_CMD,
  DOCKER_RUN,
  DOCS_URL,
  INSTALL_CLI,
} from '../lib/constants';
import {
  analyzeTransaction,
  normalizeVerdict,
  type AnalyzeResult,
} from '../lib/analyze';

const PAGE_LINKS_WITH_PLAYGROUND = PAGE_LINKS;

const SAMPLE_XDR =
  'AAAAAgAAAABqJpVIr1RYeFFT0qjGcymwWKeuWvGdq3eBgXw3beH8twAAAGQABPEIAAAAAQAAAAEAAAAAAAAAAAAAAABn8mJgAAAAAAAAAAEAAAAAAAAACwAAAAtIZWxsbyBXb3JsZAAAAAAAAAAAAA==';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function Playground() {
  const [tx, setTx] = useState('');
  const [network, setNetwork] = useState<'testnet' | 'mainnet'>('testnet');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalyzeResult | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setResult(null);
    setStatus('loading');

    try {
      const data = await analyzeTransaction(tx, network);
      setResult(data);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Analyze failed.');
    }
  }

  const verdict = result ? normalizeVerdict(result.verdict) : null;

  return (
    <div className="page content-page">
      <SiteHeader links={PAGE_LINKS} />

      <main className="content-main playground-main">
        <article className="content-article playground-article">
          <p className="content-eyebrow">Playground</p>
          <h1>Paste XDR. Get a verdict.</h1>
          <p className="content-lead">
            Run a live analysis against Meridian. Early beta — results depend on API availability.
          </p>

          <form className="playground-form" onSubmit={handleSubmit}>
            <label className="playground-label" htmlFor="playground-xdr">
              Transaction XDR
            </label>
            <textarea
              id="playground-xdr"
              className="playground-textarea"
              value={tx}
              onChange={(e) => setTx(e.target.value)}
              placeholder="Paste base64 transaction XDR…"
              rows={8}
              required
              spellCheck={false}
              disabled={status === 'loading'}
            />

            <div className="playground-toolbar">
              <div className="playground-network" role="group" aria-label="Network">
                <button
                  type="button"
                  className={network === 'testnet' ? 'active' : ''}
                  onClick={() => setNetwork('testnet')}
                  disabled={status === 'loading'}
                >
                  Testnet
                </button>
                <button
                  type="button"
                  className={network === 'mainnet' ? 'active' : ''}
                  onClick={() => setNetwork('mainnet')}
                  disabled={status === 'loading'}
                >
                  Mainnet
                </button>
              </div>

              <div className="playground-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setTx(SAMPLE_XDR)}
                  disabled={status === 'loading'}
                >
                  Use sample
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={status === 'loading' || !tx.trim()}
                >
                  {status === 'loading' ? 'Analyzing…' : 'Analyze'}
                </button>
              </div>
            </div>
          </form>

          {status === 'error' && error && (
            <p className="playground-error" role="alert">
              {error}
            </p>
          )}

          {status === 'success' && result && (
            <div className="playground-result" role="status">
              <div className="playground-result-head">
                <h2>Result</h2>
                {verdict && (
                  <span className={`tag tag-${verdict}`}>{verdict.toUpperCase()}</span>
                )}
              </div>
              <dl className="playground-fields">
                <ResultRow label="Confidence" value={formatConfidence(result)} />
                <ResultRow label="Blast radius" value={formatBlast(result)} />
                <ResultRow label="Contracts" value={formatContracts(result)} />
                {result.recovery != null && (
                  <ResultRow label="Recovery" value={String(result.recovery)} />
                )}
              </dl>
              {typeof result.brief === 'string' && result.brief && (
                <p className="playground-brief">{result.brief}</p>
              )}
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="playground-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function formatConfidence(result: AnalyzeResult): string | null {
  const raw = result.confidence;
  if (typeof raw !== 'number') return null;
  return raw <= 1 ? `${Math.round(raw * 100)}%` : `${Math.round(raw)}%`;
}

function formatBlast(result: AnalyzeResult): string | null {
  const raw = result.blast_radius ?? result.blastRadius;
  return typeof raw === 'number' ? String(raw) : null;
}

function formatContracts(result: AnalyzeResult): string | null {
  const raw = result.contracts ?? result.contracts_mapped;
  return typeof raw === 'number' ? String(raw) : null;
}
