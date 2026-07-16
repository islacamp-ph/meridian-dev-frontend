import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_BASE = process.env.MERIDIAN_API_URL ?? process.env.VITE_API_URL ?? 'https://api.meridian.dev';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const tx = typeof req.body?.tx === 'string' ? req.body.tx.trim() : '';
  const network = typeof req.body?.network === 'string' ? req.body.network.trim() : 'testnet';

  if (!tx) {
    return res.status(400).json({ error: 'Paste a transaction XDR to analyze.' });
  }

  if (network !== 'testnet' && network !== 'mainnet') {
    return res.status(400).json({ error: 'Network must be testnet or mainnet.' });
  }

  try {
    const upstream = await fetch(`${API_BASE}/v1/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ tx, network }),
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      const message =
        typeof data.error === 'string'
          ? data.error
          : typeof data.message === 'string'
            ? data.message
            : `Analyze failed (${upstream.status}).`;
      return res.status(upstream.status).json({ error: message, demo: false });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('analyze:proxy_failed', err);
    return res.status(502).json({
      error: 'Could not reach the Meridian API. Try again shortly.',
      demo: false,
    });
  }
}
