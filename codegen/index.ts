import type { CodegenConfig } from '@graphql-codegen/cli';

import { HASURA_API_URL, SUBGRAPH_API_URL } from '../src/configs/subgraph';

const GENERATED_PATH = 'src/lib/graphql/sdk';

const PLUGINS = ['typescript', 'typescript-operations', 'typescript-graphql-request'];

const CONFIG = {
  scalars: {
    Bytes: {
      input: '`0x${string}`',
      output: '`0x${string}`',
    },
    BigInt: {
      input: 'string',
      output: 'string',
    },
  },
};

const config: CodegenConfig = {
  overwrite: true,
  noSilentErrors: true,
  generates: {
    [`${GENERATED_PATH}/lp.ts`]: {
      documents: 'codegen/lp.ts',
      schema: `${SUBGRAPH_API_URL}/chromatic-lp`,
      plugins: PLUGINS,
      config: CONFIG,
    },
  },
};

export default config;
