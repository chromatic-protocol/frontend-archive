import {
  GraphQLClient,
  GraphQLWebSocketClient,
  RequestMiddleware,
  Variables,
} from 'graphql-request';
import { HASURA_API_URL, SUBGRAPH_API_URL } from '~/configs/subgraph';

import * as Lp from '~/lib/graphql/sdk/lp';
import * as Hasura from '~/lib/graphql/sdk/hasura';
import * as Pricefeed from '~/lib/graphql/sdk/pricefeed';
import * as PricefeedWS from '~/lib/graphql/sdk/pricefeed_ws';

type UrlMap = {
  operations: string[];
  url: string;
}[];

function getOperations(object: Object) {
  return Object.keys(object)
    .filter((k) => k.endsWith('Document'))
    .map((k) => k.slice(0, -'Docuemnt'.length));
}

const urlMap: UrlMap = [
  {
    operations: getOperations(Lp),
    url: `https://${SUBGRAPH_API_URL}/chromatic-lp`,
  },
  {
    operations: getOperations(Pricefeed),
    url: `https://${SUBGRAPH_API_URL}/chainlink-pricefeed`,
  },
  {
    operations: getOperations(Hasura),
    url: `https://${HASURA_API_URL}`,
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

const hasuraGraphSdk = Hasura.getSdk(graphClient);
const lpGraphSdk = Lp.getSdk(graphClient);
const pricefeedGraphSdk = Pricefeed.getSdk(graphClient);

const websocketClient = new WebSocket(`wss://${SUBGRAPH_API_URL}/chainlink-pricefeed`);
const graphWSClient = new GraphQLWebSocketClient(websocketClient, {});

const pricefeedGraphSubSdk = PricefeedWS.getSdk(graphWSClient);

export { hasuraGraphSdk, lpGraphSdk, pricefeedGraphSdk, pricefeedGraphSubSdk };
