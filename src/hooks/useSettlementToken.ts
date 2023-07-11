import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { useAccount } from 'wagmi';
import { useAppDispatch, useAppSelector } from '~/store';
import { tokenAction } from '~/store/reducer/token';
import { Token } from '~/typings/market';
import { errorLog } from '~/utils/log';
import { useChromaticClient } from './useChromaticClient';
import useLocalStorage from './useLocalStorage';
import { toast } from 'react-toastify';
import { isValid } from '~/utils/valid';

export const useSettlementToken = () => {
  const { address } = useAccount();
  const { client } = useChromaticClient();
  const currentSelectedToken = useAppSelector((state) => state.token.selectedToken);
  const marketFactoryApi = useMemo(() => client?.marketFactory(), [client]);

  const dispatch = useAppDispatch();
  const { setState: setStoredToken } = useLocalStorage('usum:token');
  const fetchKey = useMemo(() => {
    if (isValid(address) && isValid(marketFactoryApi)) {
      return ['SETTLEMENT_TOKENS', address, 'MARKET_FACTORY'] as const;
    }
    return;
  }, [address, marketFactoryApi]);
  const {
    data: tokens,
    error,
    mutate: fetchTokens,
    isLoading: isTokenLoading,
  } = useSWR(fetchKey, async () => {
    if (!marketFactoryApi) {
      return;
    }
    const tokens = await marketFactoryApi.registeredSettlementTokens();
    return tokens;
  });

  if (error) {
    errorLog(error);
  }
  const onTokenSelect = useCallback(
    (token: Token) => {
      dispatch(tokenAction.onTokenSelect(token));
      setStoredToken(token.name);
      toast('Settlement token is now selected.');
    },
    [dispatch]
  );
  return { tokens, currentSelectedToken, isTokenLoading, fetchTokens, onTokenSelect };
};
