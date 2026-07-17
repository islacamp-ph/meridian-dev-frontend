import {
  GITHUB_ACTION,
  GITHUB_API,
  NPM_CLI,
  NPM_SDK,
  PYPI_SDK,
} from './constants';

export const developerTools = [
  {
    id: 'cli',
    name: 'CLI',
    package: 'meridian-core',
    href: NPM_CLI,
    example: 'meridian analyze <xdr> --network testnet',
  },
  {
    id: 'js',
    name: 'JS SDK',
    package: '@meridian/stellar',
    href: NPM_SDK,
    example: `import { MeridianClient } from '@meridian/stellar';

const client = new MeridianClient({ baseUrl: 'http://localhost:3000' });
const result = await client.analyze({ tx: '<xdr>', network: 'testnet' });`,
  },
  {
    id: 'py',
    name: 'Python',
    package: 'meridian-py',
    href: PYPI_SDK,
    example: `from meridian import MeridianClient

client = MeridianClient("http://localhost:3000")
result = client.analyze({"tx": "<xdr>", "network": "testnet"})`,
  },
  {
    id: 'api',
    name: 'REST API',
    package: '@meridian/api',
    href: GITHUB_API,
    example: `curl -X POST http://localhost:3000/v1/analyze \\
  -H "Content-Type: application/json" \\
  -d '{"tx": "<xdr>", "network": "testnet"}'`,
  },
  {
    id: 'action',
    name: 'GitHub Action',
    package: 'meridian-action',
    href: GITHUB_ACTION,
    example: `- uses: islacamp-ph/meridian-core/packages/meridian-action@main
  with:
    tx-file: tx.xdr
    network: testnet
    fail-on: ABORT`,
  },
] as const;

export const pipelineLayers = [
  { name: 'TRACE', description: 'Simulate execution path' },
  { name: 'FIELD', description: 'Map dependencies & TTL' },
  { name: 'GRAVITY', description: 'Score blast radius' },
  { name: 'BRIEF', description: 'Plain-language verdict' },
] as const;
