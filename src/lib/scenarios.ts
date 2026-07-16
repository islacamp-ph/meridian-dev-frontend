export interface Scenario {
  id: string;
  name: string;
  label: string;
  verdict: 'clear' | 'warn' | 'abort';
  confidence: number;
  blastRadius: number;
  contracts: number;
  recovery: string;
  brief: string;
}

export const scenarios: Scenario[] = [
  {
    id: 'governance',
    name: 'Governance vote',
    label: 'timelock · treasury',
    verdict: 'abort',
    confidence: 28,
    blastRadius: 82,
    contracts: 14,
    recovery: 'PARTIAL',
    brief: 'Timelock auth missing — treasury move would revert. Three protocols exposed.',
  },
  {
    id: 'subscription',
    name: 'Subscription charge',
    label: 'allowance · billing',
    verdict: 'clear',
    confidence: 94,
    blastRadius: 4,
    contracts: 2,
    recovery: 'FULL',
    brief: 'Allowance sufficient. Single-hop transfer — safe to process.',
  },
  {
    id: 'bridge',
    name: 'Bridge deposit',
    label: 'lock · mint · relay',
    verdict: 'warn',
    confidence: 63,
    blastRadius: 61,
    contracts: 11,
    recovery: 'PARTIAL',
    brief: 'Relayer upgraded 2 days ago. Confirm compatibility before depositing.',
  },
  {
    id: 'listing',
    name: 'Marketplace listing',
    label: 'mint · escrow',
    verdict: 'warn',
    confidence: 77,
    blastRadius: 22,
    contracts: 5,
    recovery: 'FULL',
    brief: 'Royalty route hits a deprecated splitter. Update before volume scales.',
  },
];

export const tickerItems = [
  'simulate first',
  'CLEAR · WARN · ABORT',
  'map every contract',
  'score blast radius',
  'know what crosses',
];

export const integrations = [
  {
    title: 'CI / GitHub Action',
    description: 'Block merges on ABORT or WARN.',
    icon: '↻',
  },
  {
    title: 'CLI & SDKs',
    description: 'Same pipeline from terminal or code.',
    icon: '⌘',
  },
  {
    title: 'Wallet pre-sign',
    description: 'Show a verdict before users approve.',
    icon: '◎',
  },
  {
    title: 'Manifests',
    description: 'Enrich blast-radius scoring.',
    icon: '▣',
  },
] as const;
