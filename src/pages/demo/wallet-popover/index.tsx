import { useAccount, useDisconnect } from "wagmi";
import { WalletPopover } from "../../../stories/molecule/WalletPopover";
import { useUsumAccount } from "../../../hooks/useUsumAccount";
import { copyText } from "../../../utils/clipboard";
import usePriceFeed from "../../../hooks/usePriceFeed";
import useConnectOnce from "../../../hooks/useConnectOnce";
import { useLiquidityPool } from "../../../hooks/useLiquidityPool";
import { useSettlementToken } from "../../../hooks/useSettlementToken";
import { useUsumBalances, useWalletBalances } from "../../../hooks/useBalances";
import { useMarket } from "../../../hooks/useMarket";
import useOracleVersion from "../../../hooks/useOracleVersion";

const WalletPopoverDemo = () => {
  useConnectOnce();
  const { address: walletAddress } = useAccount();
  const [tokens] = useSettlementToken();
  const [markets] = useMarket();
  const [usumAddress] = useUsumAccount();
  const [walletBalances] = useWalletBalances();
  const [pools] = useLiquidityPool();
  const { disconnectAsync } = useDisconnect();
  const [feed] = usePriceFeed();
  useOracleVersion();

  return (
    <>
      <WalletPopover
        account={{ walletAddress, usumAddress: usumAddress?.address }}
        tokens={tokens}
        markets={markets}
        balances={walletBalances}
        pools={pools}
        priceFeed={feed}
        onUsumCopy={copyText}
        onWalletCopy={copyText}
        onDisconnect={() => {
          disconnectAsync?.();
        }}
      />
    </>
  );
};

export default WalletPopoverDemo;
