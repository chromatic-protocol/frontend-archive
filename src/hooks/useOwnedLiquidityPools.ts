import {
  ChromaticLens,
  ChromaticMarket,
  utils as ChromaticUtils,
} from '@chromatic-protocol/sdk-viem';
import { isNil } from 'ramda';
import { useMemo } from 'react';
import useSWR from 'swr';
import { Address } from 'wagmi';
import { LiquidityPoolSummary, OwnedBin } from '~/typings/pools';
import { checkAllProps } from '../utils';
import { divPreserved, mulPreserved } from '../utils/number';
import { PromiseOnlySuccess } from '../utils/promise';
import { useChromaticClient } from './useChromaticClient';
import { useError } from './useError';
import { useMarket } from './useMarket';
import { useSettlementToken } from './useSettlementToken';
import useOracleVersion from './useOracleVersion';

const { encodeTokenId } = ChromaticUtils;

async function getLiquidityPool(
  lensApi: ChromaticLens,
  marketApi: ChromaticMarket,
  address: Address,
  marketAddress: Address,
  tokenAddress: Address
) {
  const bins = await lensApi.ownedLiquidityBins(marketAddress, address);
  const binsResponse = bins.map(async (bin: any) => {
    const tokenId = encodeTokenId(Number(bin.tradingFeeRate));
    const { name, decimals, description, image } = await marketApi.clbTokenMeta(
      marketAddress,
      tokenId
    );
    return {
      liquidity: bin.liquidity,
      freeLiquidity: bin.freeLiquidity,
      removableRate: divPreserved(bin.freeLiquidity, bin.liquidity, decimals),
      clbTokenName: name,
      clbTokenImage: image,
      clbTokenDescription: description,
      clbTokenDecimals: decimals,
      clbTokenBalance: bin.clbBalance,
      clbTokenValue: bin.clbValue,
      clbTotalSupply: bin.clbTotalSupply,
      binValue: bin.binValue,
      clbBalanceOfSettlement: mulPreserved(bin.clbBalance, bin.clbValue, decimals),
      baseFeeRate: bin.tradingFeeRate,
      tokenId: tokenId,
    } satisfies OwnedBin;
  });
  const filteredBins = await PromiseOnlySuccess(binsResponse);
  return { tokenAddress, marketAddress, bins: filteredBins };
}

export const useOwnedLiquidityPools = () => {
  const { client, walletAddress } = useChromaticClient();
  const { currentToken } = useSettlementToken();
  const { markets, currentMarket } = useMarket();
  const { currentMarketOracleVersion } = useOracleVersion();
  const marketAddresses = useMemo(() => markets?.map((market) => market.address), [markets]);

  const fetchKey = {
    name: 'getOwnedPools',
    type: 'EOA',
    address: walletAddress,
    tokenAddress: currentToken?.address,
    marketAddresses: marketAddresses,
    oracleVersion: currentMarketOracleVersion?.version,
  };

  const {
    data: ownedPools,
    error,
    mutate: fetchOwnedPools,
  } = useSWR(
    checkAllProps(fetchKey) ? fetchKey : null,
    async ({ address, marketAddresses, tokenAddress }) => {
      const lensApi = client.lens();
      const marketApi = client.market();

      const poolsResponse = await PromiseOnlySuccess(
        marketAddresses.map(async (marketAddress) => {
          return getLiquidityPool(lensApi, marketApi, address, marketAddress, tokenAddress);
        })
      );
      return poolsResponse;
    }
  );

  function fetchCurrentOwnedPool() {
    fetchOwnedPools(async (ownedPools) => {
      if (isNil(ownedPools) || isNil(walletAddress) || isNil(currentMarket) || isNil(currentToken))
        return ownedPools;

      const filteredPoolData = ownedPools?.filter(
        (pool) => pool.marketAddress !== currentMarket?.address
      );

      const lensApi = client.lens();
      const marketApi = client.market();

      const newPoolData = await getLiquidityPool(
        lensApi,
        marketApi,
        walletAddress,
        currentMarket.address,
        currentToken.address
      );
      return [...filteredPoolData, newPoolData];
    });
  }

  const currentOwnedPool = ownedPools?.find(
    ({ marketAddress }) => marketAddress === currentMarket?.address
  );
  // }, [ownedPools, marketAddresses]);

  const ownedPoolSummary = useMemo(() => {
    if (isNil(currentOwnedPool) || isNil(currentToken) || isNil(markets)) return [];

    const array: LiquidityPoolSummary[] = markets.map((market) => {
      const { description: marketDescription } = market;

      const liquiditySum = currentOwnedPool.bins.reduce(
        (total, bin) => total + bin.clbBalanceOfSettlement,
        0n
      );

      return {
        token: {
          name: currentToken.name,
          decimals: currentToken.decimals,
        },
        market: marketDescription,
        liquidity: liquiditySum,
        bins: currentOwnedPool.bins.length,
      };
    });

    return array;
  }, [ownedPools]);

  useError({ error });

  return {
    ownedPools,
    currentOwnedPool,
    fetchOwnedPools,
    fetchCurrentOwnedPool,
    ownedPoolSummary,
  };
};
