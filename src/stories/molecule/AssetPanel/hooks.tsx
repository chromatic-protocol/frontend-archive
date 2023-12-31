import { isEmpty, isNil } from 'ramda';
import { useEffect, useMemo } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { usePublicClient } from 'wagmi';

import { useChromaticAccount } from '~/hooks/useChromaticAccount';
import { useCreateAccount } from '~/hooks/useCreateAccount';
import { useMargins } from '~/hooks/useMargins';
import usePriceFeed from '~/hooks/usePriceFeed';
import { useSettlementToken } from '~/hooks/useSettlementToken';
import { useTokenBalances } from '~/hooks/useTokenBalance';
import useTokenTransaction from '~/hooks/useTokenTransaction';

import { useAppDispatch } from '~/store';
import { accountAction } from '~/store/reducer/account';

import { ACCOUNT_STATUS } from '~/typings/account';

import { formatDecimals, isNotZero, numberFormat } from '~/utils/number';

import { AssetPanelProps } from '.';

interface UseAssetPanelProps extends AssetPanelProps {}

export const useAssetPanel = ({ type }: UseAssetPanelProps) => {
  const {
    accountAddress: chromaticAddress,
    status,
    balances: chromaticBalances,
    isAccountAddressLoading,
  } = useChromaticAccount();
  const { onCreateAccount: onClickCreateAccount } = useCreateAccount();
  const { tokenBalances: walletBalances } = useTokenBalances();
  const { amount, onAmountChange, onDeposit, onWithdraw } = useTokenTransaction();
  const { totalMargin } = useMargins();
  const { currentToken, isTokenLoading } = useSettlementToken();
  const { isFeedLoading } = usePriceFeed();

  const publicClient = usePublicClient();

  const dispatch = useAppDispatch();

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined = undefined;
    if (status === ACCOUNT_STATUS.COMPLETING) {
      timerId = setTimeout(() => {
        dispatch(accountAction.setAccountStatus(ACCOUNT_STATUS.COMPLETED));
      }, 3000);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [status]);

  const addressExplorer = useMemo(() => {
    try {
      const rawUrl = publicClient.chain.blockExplorers?.default?.url;
      if (isNil(rawUrl)) return;
      const origin = new URL(rawUrl).origin;
      if (isNil(origin) || isNil(chromaticAddress)) return;
      return `${origin}/address/${chromaticAddress}`;
    } catch (error) {
      return;
    }
  }, [publicClient, chromaticAddress]);

  const isLoading = isTokenLoading || isFeedLoading || isAccountAddressLoading;

  const isDeposit = type === 'Deposit';

  const isAccountNotExist = status === ACCOUNT_STATUS.NONE;
  const isAccountCreating = status === ACCOUNT_STATUS.CREATING;
  const isAccountCreated = status === ACCOUNT_STATUS.COMPLETING;
  const isAccountExist = status === ACCOUNT_STATUS.COMPLETED;

  const tokenName = currentToken?.name || '-';
  const tokenImage = currentToken?.image;

  const availableMargin = numberFormat(formatUnits(totalMargin, currentToken?.decimals || 0), {
    maxDigits: 5,
    useGrouping: true,
    roundingMode: 'floor',
  });

  const maxAmount =
    currentToken &&
    (isDeposit
      ? formatUnits(walletBalances?.[currentToken.address] ?? 0n, currentToken?.decimals)
      : formatUnits(chromaticBalances?.[currentToken.address] ?? 0n, currentToken?.decimals));
  const minimumAmount = formatDecimals(currentToken?.minimumMargin, currentToken?.decimals);

  const isExceeded = useMemo(() => {
    if (+amount === 0) return false;
    if (isNil(walletBalances) || isNil(chromaticBalances) || isNil(amount) || isNil(currentToken))
      return false;

    return isDeposit
      ? parseUnits(amount, currentToken.decimals) > walletBalances[currentToken.address]
      : parseUnits(amount, currentToken.decimals) > chromaticBalances[currentToken.address];
  }, [amount, type, currentToken, chromaticBalances, walletBalances]);
  const isLess = useMemo(() => {
    return +amount < +minimumAmount && isNotZero(amount);
  }, [amount]);
  const isAmountError = isExceeded || isLess;
  const isSubmitDisabled = isAmountError || isEmpty(amount) || +amount === 0;

  const onClickSubmit = (onPopoverClose?: () => unknown) => {
    if (isDeposit) {
      onDeposit && onDeposit(onPopoverClose);
    } else {
      onWithdraw && onWithdraw(onPopoverClose);
    }
  };
  return {
    isLoading,

    isDeposit,

    isAccountNotExist,
    isAccountCreating,
    isAccountCreated,
    isAccountExist,

    chromaticAddress,
    addressExplorer,
    tokenName,
    tokenImage,
    availableMargin,

    maxAmount,
    minimumAmount,
    isAmountError,
    isSubmitDisabled,
    isExceeded,
    isLess,

    amount,
    onAmountChange,

    onClickCreateAccount,
    onClickSubmit,
  };
};
