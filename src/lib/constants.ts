export const GITHUB_REPO = 'https://github.com/islacamp-ph/meridian-core';

export const GITHUB_README = `${GITHUB_REPO}#readme`;
export const GITHUB_DOCS_SRC = `${GITHUB_REPO}/tree/main/apps/docs`;
export const GITHUB_EXAMPLES = `${GITHUB_REPO}/tree/main/examples`;
export const GITHUB_MANIFESTS = `${GITHUB_REPO}/tree/main/manifests`;
export const GITHUB_ACTION = `${GITHUB_REPO}/tree/main/packages/meridian-action`;
export const GITHUB_API = `${GITHUB_REPO}/tree/main/packages/api`;

/** In-site quickstart — links to monorepo docs when hosted separately via VITE_DOCS_URL */
export const DOCS_URL = import.meta.env.VITE_DOCS_URL ?? '/docs';

export const NPM_CLI = 'https://www.npmjs.com/package/meridian-core';
export const NPM_SDK = 'https://www.npmjs.com/package/@meridian/stellar';
export const PYPI_SDK = 'https://pypi.org/project/meridian-py/';

export const INSTALL_CLI = 'npm install -g meridian-core';
export const INSTALL_JS = 'npm install @meridian/stellar';
export const INSTALL_PY = 'pip install meridian-py';

export const ANALYZE_CMD = 'meridian analyze <xdr> --network testnet';
export const DIFF_CMD = 'meridian diff --file-a tx-a.xdr --file-b tx-b.xdr --network testnet';
export const MANIFEST_INIT = 'meridian init --name my-ecosystem --network testnet';
export const MANIFEST_VALIDATE = 'meridian manifest validate manifest.json';

export const DOCKER_RUN = `docker run --rm -p 3000:3000 \\
  -e STELLAR_RPC_TESTNET=https://soroban-testnet.stellar.org \\
  meridian-api`;
