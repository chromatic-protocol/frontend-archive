import { isNil } from 'ramda';
import { useMemo } from 'react';
import { useChromaticAccount } from './useChromaticAccount';
import { usePositions } from './usePositions';
import { useSettlementToken } from './useSettlementToken';

export function useMargins() {
  const { currentPositions } = usePositions();
  const { balances } = useChromaticAccount();
  const { currentToken } = useSettlementToken();

  const [totalBalance, totalAsset] = useMemo(() => {
    if (isNil(balances) || isNil(currentToken) || Object.keys(balances).length <= 0) {
      return [0n, 0n];
    }
    const balance = balances[currentToken.address];
    if (isNil(currentPositions)) {
      return [balance, balance];
    }
    const [totalCollateral, totalCollateralAdded] = currentPositions.reduce(
      (record, position) => {
        return [record[0] + position.collateral, record[1] + position.collateral + position.pnl];
      },
      [0n, 0n]
    );
    return [balance + totalCollateral, balance + totalCollateralAdded];
  }, [balances, currentToken, currentPositions]);

  const totalMargin = useMemo(() => {
    if (isNil(balances) || isNil(currentToken)) {
      return 0n;
    }
    return balances[currentToken.address] ?? 0n;
  }, [balances, currentToken]);

  return {
    totalBalance,
    totalAsset,
    totalMargin,
  };
}
