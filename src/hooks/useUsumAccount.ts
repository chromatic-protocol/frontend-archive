import { ethers } from 'ethers';
import { fromPairs, isNil } from 'ramda';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useAccount } from 'wagmi';
import {
  ACCOUNT_COMPLETED,
  ACCOUNT_COMPLETING,
  ACCOUNT_CREATING,
  ACCOUNT_NONE,
  ACCOUNT_STATUS,
} from '~/typings/account';
import { AppError } from '~/typings/error';
import { Logger } from '~/utils/log';
import { isValid } from '~/utils/valid';
import { useChromaticClient } from './useChromaticClient';
import { useSettlementToken } from './useSettlementToken';
const logger = Logger('useUsumAccount');
export const useUsumAccount = () => {
  const { address } = useAccount();
  const [status, setStatus] = useState<ACCOUNT_STATUS>(ACCOUNT_NONE);
  const { tokens, currentSelectedToken } = useSettlementToken();
  const { client } = useChromaticClient();
  // const accountApi = useMemo(() => client?.account(), [client]);

  const signerKey = isValid(client?.walletClient) ? 'WALLET_CLIENT' : undefined;
  const fetchKey =
    isValid(address) && isValid(signerKey) ? ['USUM_ACCOUNT', address, signerKey] : undefined;

  const {
    data: accountAddress,
    error,
    isLoading,
  } = useSWR(
    fetchKey,
    async ([_, address]) => {
      if (!client || !client.walletClient) {
        return;
      }
      const accountApi = client?.account();
      if (isNil(accountApi)) {
        return;
      }
      try {
        const accountAddress = await accountApi.getAccount();
        if (isNil(accountAddress) || accountAddress === ethers.constants.AddressZero) {
          return;
        } else {
          return accountAddress;
        }
      } catch (error) {
        logger.error(error);
        return;
      }
    },
    {
      keepPreviousData: false,
    }
  );

  const {
    data: balances,
    error: balanceError,
    mutate: fetchBalances,
    isLoading: isChromaticBalanceLoading,
  } = useSWR(['ChromaticAccBal', address, signerKey], async () => {
    const accountApi = client?.account();
    if (
      isNil(tokens) ||
      isNil(accountApi) ||
      isNil(address) ||
      address === ethers.constants.AddressZero
    ) {
      return {};
    }
    const result = await accountApi.balances(tokens.map((token) => token.address));
    return fromPairs(result?.map((balance) => [balance.token, balance.balance] as const) || []);
  });

  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    if (status === ACCOUNT_COMPLETING) {
      logger.info('account is now created');
      timerId = setTimeout(() => {
        setStatus(ACCOUNT_COMPLETED);
      }, 3000);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [status]);

  useEffect(() => {
    if (isNil(accountAddress) || accountAddress === ethers.constants.AddressZero) {
      setStatus(ACCOUNT_NONE);
      return;
    }
    if (isValid(accountAddress) && accountAddress !== ethers.constants.AddressZero) {
      setStatus(ACCOUNT_COMPLETED);
      return;
    }
  }, [accountAddress]);

  if (error) {
    logger.error(error);
  }

  const createAccount = async () => {
    const accountApi = client?.account();
    if (isNil(accountApi)) {
      return AppError.reject('no accountApi', 'createAcccount');
    }

    try {
      logger.info('Creating accounts');
      setStatus(ACCOUNT_CREATING);
      await accountApi.createAccount();
      setStatus(ACCOUNT_COMPLETING);
    } catch (error) {
      setStatus(ACCOUNT_NONE);
      logger.error(error);

      return AppError.reject(error, 'createAccount');
    }
  };

  return {
    accountAddress,
    balances,
    status,
    isChromaticBalanceLoading,
    createAccount,
    setStatus,
    fetchBalances,
  };
};
