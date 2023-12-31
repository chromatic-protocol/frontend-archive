import { isNil } from 'ramda';
import { useMemo } from 'react';
import { parseUnits } from 'viem';

import { useClaimPosition } from '~/hooks/useClaimPosition';
import { useClosePosition } from '~/hooks/useClosePosition';
import { useEntireMarkets } from '~/hooks/useMarket';
import { usePositions } from '~/hooks/usePositions';
import { useSettlementToken } from '~/hooks/useSettlementToken';

import { POSITION_STATUS, Position } from '~/typings/position';

import { abs, divPreserved, formatDecimals, withComma } from '~/utils/number';

import { ORACLE_PROVIDER_DECIMALS, PERCENT_DECIMALS, PNL_RATE_DECIMALS } from '~/configs/decimals';

import { formatTimestamp } from '~/utils/date';
import { comparePrices } from '~/utils/price';
import { PositionItemV2Props } from './index';

interface UsePositionItemV2 extends PositionItemV2Props {}

const emptyPosition = {
  tokenName: '-',
  marketDescription: '-',
  qty: '-',
  collateral: '-',
  leverage: '-',
  stopLoss: '-',
  takeProfit: '-',
  profitPriceTo: '-',
  lossPriceTo: '-',
  pnlPercentage: '-',
  pnl: '-',
  lossPrice: '-',
  profitPrice: '-',
  entryPrice: '-',
  entryTime: '-',
  pnlAmount: '-',
};

export function usePositionItemV2({ position }: UsePositionItemV2) {
  const { markets } = useEntireMarkets();
  const { tokens } = useSettlementToken();
  const { isLoading } = usePositions();

  function priceTo(position: Position, type: 'toProfit' | 'toLoss') {
    const value = formatDecimals(position[type], ORACLE_PROVIDER_DECIMALS - 2, 2);
    const hasProfit = type === 'toProfit' ? position.qty > 0n : position.qty <= 0n;
    if (hasProfit) {
      return `(+${withComma(value)}%)`;
    } else {
      return `(${withComma(value)}%)`;
    }
  }

  /**
   * FIXME
   * Oracle Decimals을 확인해야 함
   */
  const values = useMemo(() => {
    if (isNil(position) || isNil(tokens)) {
      return emptyPosition;
    }
    const { collateral, qty, makerMargin, takerMargin, tokenAddress, marketAddress } = position;
    const currentToken = tokens.find((token) => token.address === tokenAddress);
    const currentMarket = markets?.find((market) => market.address === marketAddress);
    if (isNil(currentToken) || isNil(currentMarket)) {
      return emptyPosition;
    }
    const stopLoss =
      formatDecimals(
        (collateral * 10n ** BigInt(currentToken.decimals)) / qty,
        currentToken.decimals - 2,
        2
      ) + '%';
    const takeProfitRaw =
      abs(qty) === 0n
        ? 0n
        : (makerMargin * parseUnits('1', currentToken.decimals) * 100n * 10000n) /
          parseUnits(String(abs(qty)), currentToken.decimals);
    const takeProfit = formatDecimals(takeProfitRaw, 4, 2) + '%';
    const currentOracleVersion = markets?.find(
      (market) => market.address === position.marketAddress
    )?.oracleValue;
    if (
      isNil(currentOracleVersion) ||
      isNil(currentOracleVersion.version) ||
      currentOracleVersion.version <= position.openVersion
    ) {
      return {
        tokenName: currentToken.name,
        marketDescription: currentMarket.description,
        qty: formatDecimals(abs(qty), currentToken.decimals, 2, true),
        collateral: formatDecimals(collateral, currentToken.decimals, 2, true),
        leverage:
          formatDecimals(
            divPreserved(qty, collateral, currentToken.decimals),
            currentToken.decimals,
            2,
            true
          ) + 'x',
        stopLoss,
        takeProfit,
        profitPriceTo: '-',
        lossPriceTo: '-',
        pnlPercentage: '-',
        pnl: '-',
        lossPrice: '-',
        profitPrice: '-',
        entryPrice: '-',
        entryTime: formatTimestamp(position.openTimestamp),
        pnlAmount: '-',
      };
    }
    const pnlPercentage = divPreserved(
      position.pnl,
      takerMargin,
      PNL_RATE_DECIMALS + PERCENT_DECIMALS
    );
    return {
      tokenName: currentToken.name,
      marketDescription: currentMarket.description,
      qty: formatDecimals(abs(qty), currentToken.decimals, 2, true),
      collateral: formatDecimals(collateral, currentToken.decimals, 2, true),
      leverage:
        formatDecimals(
          divPreserved(qty, collateral, currentToken.decimals),
          currentToken.decimals,
          2,
          true
        ) + 'x',
      takeProfit: withComma(takeProfit),
      stopLoss: withComma(stopLoss),
      profitPriceTo: priceTo(position, 'toProfit'),
      lossPriceTo: priceTo(position, 'toLoss'),
      pnlPercentage: `${pnlPercentage > 0n ? '+' : ''}${formatDecimals(
        pnlPercentage,
        PNL_RATE_DECIMALS,
        2,
        true
      )}%`,
      pnlAmount:
        formatDecimals(position.pnl, currentToken.decimals, 2, true) + ' ' + currentToken.name,
      profitPrice: formatDecimals(abs(position.profitPrice), ORACLE_PROVIDER_DECIMALS, 2, true),
      lossPrice: formatDecimals(abs(position.lossPrice), ORACLE_PROVIDER_DECIMALS, 2, true),
      entryPrice: '$ ' + formatDecimals(position.openPrice, ORACLE_PROVIDER_DECIMALS, 2, true),
      entryTime: formatTimestamp(position.openTimestamp),
    };
  }, [position, tokens, markets]);

  const key = position.id.toString();

  const direction = position.qty > 0n ? 'Long' : 'Short';

  const { onClosePosition } = useClosePosition({
    positionId: position.id,
    marketAddress: position.marketAddress,
  });
  const { onClaimPosition } = useClaimPosition({
    positionId: position.id,
    market: markets?.find((market) => market.address === position.marketAddress),
  });

  const isOpening = position.status === POSITION_STATUS.OPENING;
  const isOpened = position.status === POSITION_STATUS.OPENED;
  const isClosing = position.status === POSITION_STATUS.CLOSING;
  const isClosed = position.status === POSITION_STATUS.CLOSED;

  const tpPriceClass = comparePrices(position, 'toProfit');
  const slPriceClass = comparePrices(position, 'toLoss');
  const pnlClass =
    position.pnl > 0n ? 'text-price-higher' : position.pnl < 0n ? 'text-price-lower' : '';

  return {
    ...values,

    key,

    direction,

    onClosePosition,
    onClaimPosition,

    isLoading,

    isOpening,
    isOpened,
    isClosing,
    isClosed,

    tpPriceClass,
    slPriceClass,
    pnlClass,
  };
}
