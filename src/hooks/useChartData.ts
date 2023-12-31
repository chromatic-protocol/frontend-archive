import { useMemo } from 'react';
import useSWR from 'swr';
import { formatUnits } from 'viem';
import { useLiquidityPool } from '~/hooks/useLiquidityPool';
import { CLBTokenValue, Liquidity } from '~/typings/chart';
import { Logger } from '~/utils/log';
import { checkAllProps } from '../utils';
import { useError } from './useError';
import { useSettlementToken } from './useSettlementToken';

const logger = Logger('useChartData');

export const useChartData = () => {
  const { liquidityPool } = useLiquidityPool();
  const { currentToken } = useSettlementToken();

  const fetchKeyData = {
    name: 'useChartData',
    bins: liquidityPool?.bins,
    decimals: currentToken?.decimals,
  };

  const { data, error } = useSWR(
    checkAllProps(fetchKeyData) && fetchKeyData,
    ({ bins, decimals }) => {
      const chartData = bins.reduce<{
        clbTokenValues: CLBTokenValue[];
        liquidity: Liquidity[];
      }>(
        // 1 => 0.01
        (acc, { liquidity, freeLiquidity, clbTokenValue, baseFeeRate }) => {
          const key = baseFeeRate / 100;
          acc.clbTokenValues.push({
            key,
            value: Number(formatUnits(clbTokenValue, decimals)),
          });

          const available = Number(formatUnits(freeLiquidity, decimals));
          const utilized = Number(formatUnits(liquidity - freeLiquidity, decimals));
          acc.liquidity.push({
            key,
            value: [
              { label: 'utilized', amount: utilized },
              { label: 'available', amount: available },
            ],
          });
          return acc;
        },
        {
          clbTokenValues: [],
          liquidity: [],
        }
      );
      logger.info('chart data', chartData);
      return chartData;
    },
    {
      keepPreviousData: true,
    }
  );

  useError({ error, logger });

  const { negative, positive } = useMemo(() => {
    if (!data?.liquidity) return {};
    const negative = data?.liquidity.filter((liq) => liq.key < 0);
    const positive = data?.liquidity.filter((liq) => liq.key > 0);
    return { negative, positive };
  }, [data?.liquidity]);

  return {
    clbTokenValues: data?.clbTokenValues || [],
    liquidity: data?.liquidity || [],
    negative: negative,
    positive: positive,
  };
};
