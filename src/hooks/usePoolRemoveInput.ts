import { useMemo, useState } from 'react';
import { MULTI_ALL, MULTI_TYPE } from '~/configs/pool';
import { useAppSelector } from '~/store';
import { expandDecimals, formatDecimals } from '~/utils/number';

export const usePoolRemoveInput = () => {
  const [amount, setAmount] = useState('');
  const bins = useAppSelector((state) => state.pools.selectedBins);
  const maxAmount = useMemo(() => {
    if (bins.length <= 0) {
      return;
    }
    return bins.reduce((record, bin) => {
      return (
        record +
        Number(formatDecimals(bin.clbTokenBalance, bin.clbTokenDecimals, bin.clbTokenDecimals))
      );
    }, 0);
  }, [bins]);

  const onAmountChange = (nextAmount: number | string) => {
    if (typeof nextAmount === 'string') {
      nextAmount = nextAmount.replace(/,/g, '');

      if (isNaN(Number(nextAmount))) {
        return;
      }
      setAmount(nextAmount);
    } else {
      setAmount(String(nextAmount));
    }
    setAmount(String(nextAmount));
  };

  return { amount, maxAmount, onAmountChange };
};

export const useMultiPoolRemoveInput = () => {
  const [type, setType] = useState<MULTI_TYPE>(MULTI_ALL);
  const bins = useAppSelector((state) => state.pools.selectedBins);
  const token = useAppSelector((state) => state.token.selectedToken);
  const clbTokenBalance = useMemo(() => {
    return bins.reduce((balance, bin) => {
      const { clbTokenBalance } = bin;
      return balance + clbTokenBalance;
    }, 0n);
  }, [bins]);

  const amount = useMemo(() => {
    if (type === MULTI_ALL) {
      return Number(formatDecimals(clbTokenBalance, token?.decimals, token?.decimals));
    }
    const removableBalance = bins
      .map(
        (bin) =>
          (bin.clbTokenBalance *
            BigInt(Math.round(bin.removableRate * 10 ** bin.clbTokenDecimals))) /
          expandDecimals(bin.clbTokenDecimals + 2)
      )
      .reduce((balance, removable) => balance + removable, 0n);
    return Number(formatDecimals(removableBalance, token?.decimals, token?.decimals));
  }, [type, token, clbTokenBalance, bins]);

  const onAmountChange = (type: MULTI_TYPE) => {
    setType(type);
  };

  return {
    type,
    amount,
    clbTokenBalance,
    onAmountChange,
  };
};
