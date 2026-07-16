export const developerTools = [
  {
    id: 'cli',
    name: 'CLI',
    package: 'meridian-core',
    install: 'npm install -g meridian-core',
    description: 'Full pipeline from your terminal.',
    example: 'meridian analyze <xdr> --network testnet',
    docsPath: '/guides/cli/',
  },
  {
    id: 'js',
    name: 'JS SDK',
    package: '@meridian/stellar',
    install: 'npm install @meridian/stellar',
    description: 'Node client for the REST API.',
    example: `import { MeridianClient } from '@meridian/stellar';

const client = new MeridianClient({ baseUrl: 'http://localhost:3000' });
const result = await client.analyze({ tx: '<xdr>', network: 'testnet' });`,
    docsPath: '/guides/sdks/',
  },
  {
    id: 'py',
    name: 'Python',
    package: 'meridian-py',
    install: 'pip install meridian-py',
    description: 'Python client for hosted API.',
    example: `from meridian import MeridianClient

client = MeridianClient("http://localhost:3000")
result = client.analyze({"tx": "<xdr>", "network": "testnet"})`,
    docsPath: '/guides/sdks/',
  },
  {
    id: 'api',
    name: 'REST API',
    package: '@meridian/api',
    install: 'npm run dev --workspace=@meridian/api',
    description: 'Hosted analyze endpoint.',
    example: `curl -X POST http://localhost:3000/v1/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"tx": "<xdr>", "network": "testnet"}'`,
    docsPath: '/guides/api/',
  },
  {
    id: 'action',
    name: 'GitHub Action',
    package: 'meridian-action',
    install: 'uses: ./packages/meridian-action',
    description: 'Block merges on ABORT.',
    example: `- uses: ./packages/meridian-action
  with:
    tx-file: tx.xdr
    network: testnet
    fail-on: ABORT`,
    docsPath: '/guides/github-action/',
  },
] as const;
