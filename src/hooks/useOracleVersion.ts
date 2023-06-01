import { OracleProvider__factory, USUMMarket__factory } from "@quarkonix/usum";
import { useMarket } from "./useMarket";
import { isValid } from "../utils/valid";
import { useProvider } from "wagmi";
import { useMemo } from "react";
import useSWR from "swr";
import { filterIfFulfilled } from "~/utils/array";
import { errorLog } from "~/utils/log";
import { OracleVersion } from "~/typings/oracleVersion";

const useOracleVersion = () => {
  const [markets] = useMarket();
  const provider = useProvider();
  const fetchKey = useMemo(() => {
    if (isValid(markets) && isValid(provider)) {
      return [markets, provider] as const;
    }
  }, [markets, provider]);

  const {
    data: oracleVersions,
    error,
    mutate: fetchOracleVersions,
  } = useSWR(
    fetchKey,
    async ([markets, provider]) => {
      const promise = markets.map(async (market) => {
        const marketContract = USUMMarket__factory.connect(
          market.address,
          provider
        );
        const oracleProviderAddress = await marketContract.oracleProvider();
        const oracleProvider = OracleProvider__factory.connect(
          oracleProviderAddress,
          provider
        );
        const version = await oracleProvider.currentVersion();
        return {
          address: market.address,
          version: version,
        };
      });
      const response = await filterIfFulfilled(promise);

      return response.reduce((record, { address, version }) => {
        record[address] = version;
        return record;
      }, {} as Record<string, OracleVersion>);
    },
    {
      refreshInterval: 10000,
    }
  );

  if (error) {
    errorLog(error);
  }

  return { oracleVersions, fetchOracleVersions };
};

export default useOracleVersion;
