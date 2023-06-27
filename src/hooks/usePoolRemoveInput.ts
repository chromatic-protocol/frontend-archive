import { useMemo, useState } from "react";
import { CLB_TOKEN_VALUE_DECIMALS, FEE_RATE_DECIMAL } from "~/configs/decimals";
import { MULTI_ALL, MULTI_TYPE } from "~/configs/pool";
import { useAppSelector } from "~/store";
import { infoLog } from "~/utils/log";
import { bigNumberify, expandDecimals, trimLeftZero } from "~/utils/number";
import { isValid } from "~/utils/valid";

export const usePoolRemoveInput = () => {
  const [amount, setAmount] = useState(0);
  const bins = useAppSelector((state) => state.pools.selectedBins);
  const maxAmount = useMemo(() => {
    if (bins.length <= 0) {
      return;
    }
    return bins.reduce((record, bin) => {
      return (
        record +
        bin.clbTokenBalance.div(expandDecimals(bin.clbTokenDecimals)).toNumber()
      );
    }, 0);
  }, [bins]);

  const onAmountChange = (nextAmount: number | string) => {
    if (typeof nextAmount === "string") {
      const parsed = Number(trimLeftZero(nextAmount));
      if (isNaN(parsed)) {
        return;
      }
      setAmount(parsed);
    } else {
      setAmount(nextAmount);
    }
  };

  const onMaxChange = () => {
    if (isValid(maxAmount)) {
      onAmountChange(Math.floor(maxAmount));
    }
    return;
  };

  return { amount, maxAmount, onAmountChange, onMaxChange };
};

export const useMultiPoolRemoveInput = () => {
  const [type, setType] = useState<MULTI_TYPE>(MULTI_ALL);
  const bins = useAppSelector((state) => state.pools.selectedBins);
  const binDecimals =
    bins.length > 0 ? bins[0].clbTokenDecimals : CLB_TOKEN_VALUE_DECIMALS;
  const { clbTokenBalance, liquidityValue, removableLiquidity } =
    useMemo(() => {
      return bins.reduce(
        (record, bin) => {
          const { clbTokenBalance, clbTokenValue, freeLiquidity } = bin;
          const liquidityValue = clbTokenBalance
            .mul(clbTokenValue)
            .div(expandDecimals(CLB_TOKEN_VALUE_DECIMALS));
          return {
            clbTokenBalance: record.clbTokenBalance.add(clbTokenBalance),
            liquidityValue: record.liquidityValue.add(liquidityValue),
            removableLiquidity: record.removableLiquidity.add(freeLiquidity),
          };
        },
        {
          clbTokenBalance: bigNumberify(0),
          liquidityValue: bigNumberify(0),
          removableLiquidity: bigNumberify(0),
        }
      );
    }, [bins]);
  const removableRate = removableLiquidity
    .mul(expandDecimals(FEE_RATE_DECIMAL))
    .div(liquidityValue.eq(0) ? 1 : liquidityValue);
  const binValue = liquidityValue
    .mul(expandDecimals(CLB_TOKEN_VALUE_DECIMALS))
    .div(clbTokenBalance.eq(0) ? 1 : clbTokenBalance);
  const removable = removableLiquidity.lt(liquidityValue)
    ? removableLiquidity
    : liquidityValue;

  const amount =
    type === MULTI_ALL
      ? clbTokenBalance
      : removable.mul(expandDecimals(CLB_TOKEN_VALUE_DECIMALS)).div(binValue);
  const onAmountChange = (type: MULTI_TYPE) => {
    setType(type);
  };

  return {
    type,
    amount: amount.div(expandDecimals(binDecimals)).toNumber(),
    clbTokenBalance,
    liquidityValue,
    removableLiquidity,
    removableRate,
    onAmountChange,
  };
};
