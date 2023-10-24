import { GraphQLClient } from 'graphql-request';
import { useMemo } from 'react';
import useSWR from 'swr';
import { useAccount } from 'wagmi';
import { getSdk } from '~/__generated__/request';
import { SUBGRAPH_API_URL } from '~/configs/lp';
import { checkAllProps } from '~/utils';
import { useChromaticLp } from './useChromaticLp';
import { useError } from './useError';

export const useLpReceiptCount = () => {
  const { address: walletAddress } = useAccount();
  const { lpList, isLpLoading } = useChromaticLp();
  const lpAddresses = useMemo(() => {
    return lpList?.map((lp) => lp.address);
  }, [lpList]);
  const graphClient = new GraphQLClient(SUBGRAPH_API_URL);
  const graphSdk = getSdk(graphClient);

  const fetchKey = {
    key: 'getLpReceiptCount',
    lpAddresses,
    walletAddress,
  };
  const {
    data: count,
    error,
    isLoading: isCountLoading,
  } = useSWR(checkAllProps(fetchKey) ? fetchKey : null, async ({ lpAddresses, walletAddress }) => {
    let mintings = 0;
    let burnings = 0;
    let inProgresses = 0;
    for (let index = 0; index < lpAddresses.length; index++) {
      const lpAddress = lpAddresses[index];

      const { addLiquidities } = await graphSdk.AddLiquidityCount({ walletAddress, lpAddress });
      const { addLiquiditySettleds } = await graphSdk.AddLiquiditySettledCount({ lpAddress });
      const { removeLiquidities } = await graphSdk.RemoveLiquidityCount({
        walletAddress,
        lpAddress,
      });
      const { removeLiquiditySettleds } = await graphSdk.RemoveLiquiditySettledCount({ lpAddress });

      mintings += addLiquidities.length;
      burnings += removeLiquidities.length;
      inProgresses +=
        addLiquidities.length +
        removeLiquidities.length -
        (addLiquiditySettleds.length + removeLiquiditySettleds.length);
    }
    return {
      mintings,
      burnings,
      inProgresses,
    };
  });

  useError({ error });

  return {
    count,
    isCountLoading,
  };
};