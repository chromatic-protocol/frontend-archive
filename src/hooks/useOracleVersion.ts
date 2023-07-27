import { useMemo } from 'react';
import useSWR from 'swr';
import { OracleVersion } from '~/typings/oracleVersion';
import { Logger } from '~/utils/log';
import { useChromaticClient } from './useChromaticClient';
import { useMarket } from './useMarket';
import { useError } from './useError';
import { checkAllProps } from '../utils';
import { isNil } from 'ramda';

const logger = Logger('useOracleVersion');
const useOracleVersion = () => {
  const { markets, currentMarket } = useMarket();
  const { client, walletAddress } = useChromaticClient();

  const marketAddresses = useMemo(() => markets?.map((market) => market.address), [markets]);

  const fetchKeyData = {
    name: 'getOracleVersion',
    type: 'EOA',
    address: walletAddress,
    marketAddresses: marketAddresses,
  };
  const {
    data: oracleVersions,
    error,
    mutate: fetchOracleVersions,
  } = useSWR(
    checkAllProps(fetchKeyData) && fetchKeyData,
    async ({ marketAddresses }) => {
      const marketApi = client.market();

      const oraclePrices = await marketApi.getCurrentPrices(marketAddresses);
      return oraclePrices.reduce((record, { market, value }) => {
        const { version, timestamp, price } = value;
        record[market] = {
          version,
          timestamp,
          price,
          decimals: 18,
        };
        return record;
      }, {} as Record<string, OracleVersion & { decimals: number }>);
    },
    {
      refreshInterval: 1000 * 30,
    }
  );

  const currentMarketOracleVersion = useMemo(() => {
    if (isNil(currentMarket)) return;
    return oracleVersions?.[currentMarket.address];
  }, [oracleVersions, currentMarket]);

  useError({ error, logger });

  return { oracleVersions, fetchOracleVersions, currentMarketOracleVersion };
};

export default useOracleVersion;
