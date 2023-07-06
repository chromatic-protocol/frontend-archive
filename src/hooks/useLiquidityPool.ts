import { utils as ChromaticUtils } from '@chromatic-protocol/sdk';
import { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { useAccount, useProvider } from 'wagmi';
import { poolsAction } from '~/store/reducer/pools';
import { filterIfFulfilled } from '~/utils/array';
import { FEE_RATES } from '../configs/feeRate';
import { useAppDispatch, useAppSelector } from '../store';
import { Bin, LiquidityPool, LiquidityPoolSummary } from '../typings/pools';
import { Logger } from '../utils/log';
import { bigNumberify } from '../utils/number';
import { isValid } from '../utils/valid';
import { useChromaticClient } from './useChromaticClient';
import { useMarket } from './useMarket';
import useOracleVersion from './useOracleVersion';
import { useOwnedLiquidityPools } from './useOwnedLiquidityPools';
import { useSettlementToken } from './useSettlementToken';

const logger = Logger('useLiquidityPool.ts');
const { encodeTokenId, decodeTokenId } = ChromaticUtils;

export const useLiquidityPools = () => {
  const { address: walletAddress } = useAccount();
  const provider = useProvider();
  const { client } = useChromaticClient();

  const { tokens, currentSelectedToken } = useSettlementToken();
  // const selectedMarket = useAppSelector((state) => state.market.selectedMarket);
  const tokenAddresses = useMemo(() => tokens?.map((token) => token.address), [tokens]);
  const { oracleVersions } = useOracleVersion();
  const fetchKey = useMemo(
    () =>
      isValid(walletAddress) && isValid(tokenAddresses)
        ? (['LIQUIDITY_POOL', walletAddress, tokenAddresses] as const)
        : undefined,
    [walletAddress, tokenAddresses]
  );

  function validatePrecondition() {
    if (!isValid(oracleVersions)) {
      logger.info('OracleVersions');
      return false;
    }
    if (!isValid(client)) {
      logger.info('Client');
      return false;
    }
    if (!isValid(provider)) {
      logger.info('Provider');
      return false;
    }
    return true;
  }

  const {
    data: liquidityPools,
    error,
    mutate: fetchLiquidityPools,
  } = useSWR(fetchKey, async ([_, walletAddress, tokenAddresses]) => {
    logger.log('FETCH POOLS');
    if (!validatePrecondition()) {
      return [];
    }
    const factory = client!.marketFactory();
    const baseFeeRates = [...FEE_RATES, ...FEE_RATES.map((rate) => rate * -1)];
    const tokenIds = [
      ...FEE_RATES.map((rate) => encodeTokenId(rate)), // LONG COUNTER
      ...FEE_RATES.map((rate) => encodeTokenId(rate, false)), // SHORT COUNTER
    ];
    const promises = tokenAddresses.map(async (tokenAddress) => {
      const markets = await factory.getMarkets(tokenAddress);
      const promise = markets.map(async ({ address: marketAddress }) => {
        const marketApi = client!.market();
        const lensApi = client!.lens();

        const results = await lensApi.liquidityBins(marketAddress);
        const binsResponse = results.map(async (result, index) => {
          const { name, description, decimals, image } = await marketApi.clbTokenMeta(
            marketAddress,
            tokenIds[index]
          );
          return {
            liquidity: result.liquidity,
            clbTokenValue: result.clbValue,
            freeLiquidity: result.freeLiquidity,
            clbTokenName: name,
            clbTokenImage: image,
            clbTokenDescription: description,
            clbTokenDecimals: decimals,
            baseFeeRate: baseFeeRates[index],
            tokenId: tokenIds[index],
          } satisfies Bin;
        });
        const bins = await filterIfFulfilled(binsResponse);

        return {
          tokenAddress,
          marketAddress,
          bins,
        } satisfies LiquidityPool;
      });
      const response = await Promise.allSettled(promise);
      return response
        .filter((result): result is PromiseFulfilledResult<LiquidityPool> => {
          return result.status === 'fulfilled' && result.value !== undefined;
        })
        .map(({ value }) => value);
    });

    const response = await Promise.allSettled(promises);
    return response
      .filter((result): result is PromiseFulfilledResult<LiquidityPool[]> => {
        return result.status === 'fulfilled';
      })
      .map(({ value }) => value)
      .flat();
  });

  if (error) {
    logger.error(error);
  }

  return { liquidityPools, fetchLiquidityPools } as const;
};

export const useLiquidityPool = () => {
  const market = useAppSelector((state) => state.market.selectedMarket);
  const token = useAppSelector((state) => state.token.selectedToken);
  const { liquidityPools: pools } = useLiquidityPools();
  const dispatch = useAppDispatch();
  const pool = useMemo(() => {
    if (!isValid(market) || !isValid(token) || !isValid(pools)) {
      return;
    }

    return pools.find(
      (pool) => pool.tokenAddress === token.address && pool.marketAddress === market.address
    );
  }, [market, token, pools]);

  const [longTotalMaxLiquidity, longTotalUnusedLiquidity] = useMemo(() => {
    const longCLBTokens = (isValid(pool) ? pool.bins : []).filter((bin) => bin.baseFeeRate > 0);
    return longCLBTokens?.reduce(
      (acc, currentToken) => {
        const max = acc[0].add(currentToken.liquidity);
        const unused = acc[1].add(currentToken.freeLiquidity);
        return [max, unused];
      },
      [bigNumberify(0), bigNumberify(0)] as const
    );
  }, [pool]);
  const [shortTotalMaxLiquidity, shortTotalUnusedLiquidity] = useMemo(() => {
    const shortCLBTokens = (isValid(pool) ? pool.bins : []).filter(
      (clbToken) => clbToken.baseFeeRate < 0
    );
    return shortCLBTokens?.reduce(
      (acc, currentToken) => {
        const max = acc[0].add(currentToken.liquidity);
        const unused = acc[1].add(currentToken.freeLiquidity);
        return [max, unused];
      },
      [bigNumberify(0), bigNumberify(0)] as const
    );
  }, [pool]);
  // logger.info('shortTotalMaxLiq', shortTotalMaxLiquidity)

  useEffect(() => {
    if (isValid(pool)) {
      dispatch(poolsAction.onPoolSelect(pool));
    }
  }, [pool]);

  return {
    pool,
    liquidity: {
      longTotalMaxLiquidity,
      longTotalUnusedLiquidity,
      shortTotalMaxLiquidity,
      shortTotalUnusedLiquidity,
    },
  };
};

export const useLiquidityPoolSummary = () => {
  const { ownedPools: pools } = useOwnedLiquidityPools();
  const { markets } = useMarket();
  const { tokens } = useSettlementToken();
  const token = useAppSelector((state) => state.token.selectedToken);
  const logger = Logger(useLiquidityPoolSummary);
  const poolSummary = useMemo(() => {
    logger.log('pools', pools);
    if (!isValid(pools) || !isValid(token)) {
      return [];
    }
    const array = [] as LiquidityPoolSummary[];
    for (const market of markets ?? []) {
      const marketAddress = market.address;
      const bins = pools[marketAddress] || [];
      logger.info('bins', bins);
      const { description: marketDescription } = market;
      let liquiditySum = bigNumberify(0);

      for (let index = 0; index < bins.length; index++) {
        const bin = bins[index];
        liquiditySum = liquiditySum.add(bin.binValue);
      }
      array.push({
        token: {
          name: token.name,
          decimals: token.decimals,
        },
        market: marketDescription,
        liquidity: liquiditySum,
        bins: bins.length,
      });
    }
    return array;
  }, [pools, markets, tokens]);
  return poolSummary;
};
