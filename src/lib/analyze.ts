export type AnalyzeVerdict = 'clear' | 'warn' | 'abort';

export interface AnalyzeResult {
  verdict: AnalyzeVerdict;
  confidence?: number;
  blast_radius?: number;
  blastRadius?: number;
  contracts?: number;
  contracts_mapped?: number;
  brief?: string;
  recovery?: string;
  demo?: boolean;
  error?: string;
  [key: string]: unknown;
}

export async function analyzeTransaction(
  tx: string,
  network: 'testnet' | 'mainnet' = 'testnet',
): Promise<AnalyzeResult> {
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tx, network }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof data.error === 'string' ? data.error : 'Analyze request failed.',
    );
  }

  return data as AnalyzeResult;
}

export function normalizeVerdict(value: unknown): AnalyzeVerdict | null {
  if (typeof value !== 'string') return null;
  const v = value.toLowerCase();
  if (v === 'clear' || v === 'warn' || v === 'abort') return v;
  return null;
}
