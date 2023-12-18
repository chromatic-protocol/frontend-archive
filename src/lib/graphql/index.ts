import {
  GraphQLClient,
  GraphQLWebSocketClient,
  RequestMiddleware,
  Variables,
} from 'graphql-request';
import { SUBGRAPH_API_URL } from '~/configs/subgraph';

import * as Lp from '~/lib/graphql/sdk/lp';

type UrlMap = {
  operations: string[];
  url: string;
}[];

function getOperations(object: Object) {
  const documentSuffix = 'Document';
  return Object.keys(object)
    .filter((k) => k.endsWith(documentSuffix))
    .map((k) => k.slice(0, -documentSuffix.length));
}

const urlMap: UrlMap = [
  {
    operations: getOperations(Lp),
    url: `${SUBGRAPH_API_URL}/chromatic-lp`,
  },
];

const getRequestMiddleware =
  (urlMap: UrlMap): RequestMiddleware<Variables> =>
  (request) => {
    const url = urlMap.find((url) => url.operations.includes(request.operationName!))?.url;
    if (!url) {
      throw new Error('invalid operation');
    }
    return {
      ...request,
      url,
    };
  };

const graphClient = new GraphQLClient('', {
  requestMiddleware: getRequestMiddleware(urlMap),
});

const lpGraphSdk = Lp.getSdk(graphClient);

const createGraphWSClient = async (url: string) => {
  return new Promise<GraphQLWebSocketClient>((resolve) => {
    const socket = new WebSocket(url, 'graphql-ws');
    const client: GraphQLWebSocketClient = new GraphQLWebSocketClient(socket, {
      onAcknowledged: async (_p) => {
        resolve(client);
      },
    });
  });
};

export { lpGraphSdk };
