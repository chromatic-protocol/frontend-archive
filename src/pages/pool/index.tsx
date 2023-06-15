import React from "react";
import { Header } from "../../stories/template/Header";
import { MainBar } from "../../stories/template/MainBar";
import { PoolPanel } from "../../stories/template/PoolPanel";
import { PoolProgress } from "~/stories/molecule/PoolProgress";
import { Footer } from "../../stories/template/Footer";
import { Button } from "../../stories/atom/Button";
import { Square2StackIcon } from "@heroicons/react/24/outline";
import "./style.css";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import useConnectOnce from "~/hooks/useConnectOnce";
import { useUsumAccount } from "~/hooks/useUsumAccount";
import {
  useSelectedToken,
  useSettlementToken,
} from "~/hooks/useSettlementToken";
import { useMarket, useSelectedMarket } from "~/hooks/useMarket";
import {
  useUsumBalances,
  useUsumMargins,
  useWalletBalances,
} from "~/hooks/useBalances";
import usePriceFeed from "~/hooks/usePriceFeed";
import {
  useLiquidityPoolSummary,
  useSelectedLiquidityPool,
} from "~/hooks/useLiquidityPool";
import useTokenTransaction from "~/hooks/useTokenTransaction";
import { copyText } from "~/utils/clipboard";
import { useFeeRate } from "~/hooks/useFeeRate";
import { Link } from "react-router-dom";
import { trimAddress } from "~/utils/address";
import usePoolInput from "~/hooks/usePoolInput";
import { useAppSelector } from "~/store";
import usePoolReceipt from "~/hooks/usePoolReceipt";
import { usePoolRemoveInput } from "~/hooks/usePoolRemoveInput";

const Pool = () => {
  useConnectOnce();
  const { connectAsync } = useConnect();
  const { address: walletAddress } = useAccount();
  const [usumAccount, createUsumAccount] = useUsumAccount();
  const [tokens] = useSettlementToken();
  const [markets] = useMarket();
  const [selectedToken, onTokenSelect] = useSelectedToken();
  const [selectedMarket, onMarketSelect] = useSelectedMarket();
  const feeRate = useFeeRate();
  const [walletBalances] = useWalletBalances();
  const { usumBalances } = useUsumBalances();
  const [priceFeed] = usePriceFeed();
  const pools = useLiquidityPoolSummary();
  const { disconnectAsync } = useDisconnect();
  const [balanceAmount, onBalanceAmountChange, onDeposit, onWithdraw] =
    useTokenTransaction();
  const selectedBins = useAppSelector((state) => state.pools.selectedBins);
  const { receipts, onClaimCLBTokens, onClaimCLBTokensBatch } =
    usePoolReceipt();
  const [
    pool,
    [
      longTotalMaxLiquidity,
      longTotalUnusedLiquidity,
      shortTotalMaxLiquidity,
      shortTotalUnusedLiquidity,
    ],
    onRemoveLiquidity,
  ] = useSelectedLiquidityPool();
  const {
    amount,
    indexes,
    rates,
    bins,
    averageBin,
    onAmountChange,
    onRangeChange,
    onFullRangeSelect,
    onAddLiquidity,
  } = usePoolInput();
  const {
    amount: removeAmount,
    maxAmount: maxRemoveAmount,
    onAmountChange: onRemoveAmountChange,
    onMaxChange: onRemoveMaxAmountChange,
  } = usePoolRemoveInput();
  const { totalBalance, totalAsset, totalMargin } = useUsumMargins();

  return (
    <div className="flex flex-col min-h-[100vh] w-full">
      <Header
        account={{ walletAddress, usumAddress: usumAccount?.address }}
        tokens={tokens}
        markets={markets}
        priceFeed={priceFeed}
        balances={walletBalances}
        pools={pools}
        onConnect={connectAsync}
        onCreateAccount={createUsumAccount}
        onDisconnect={disconnectAsync}
        onWalletCopy={copyText}
        onUsumCopy={copyText}
      />
      <section className="flex flex-col grow max-w-[1400px] px-5 mx-auto mb-20">
        <MainBar
          account={{ walletAddress, usumAddress: usumAccount?.address }}
          tokens={tokens}
          markets={markets}
          selectedToken={selectedToken}
          selectedMarket={selectedMarket}
          feeRate={feeRate}
          walletBalances={walletBalances}
          usumBalances={usumBalances}
          amount={balanceAmount}
          totalBalance={totalBalance}
          availableMargin={totalMargin}
          assetValue={totalAsset}
          onTokenSelect={(token) => {
            onTokenSelect(token);
          }}
          onMarketSelect={(market) => {
            onMarketSelect(market);
          }}
          onAmountChange={onBalanceAmountChange}
          onDeposit={onDeposit}
          onWithdraw={onWithdraw}
          onConnect={connectAsync}
        />
        <div className="flex items-stretch gap-5">
          <div className="flex-auto w-3/5">
            <PoolPanel
              token={selectedToken}
              market={selectedMarket}
              balances={walletBalances}
              pool={pool}
              amount={amount}
              indexes={indexes}
              rates={rates}
              bins={bins}
              averageBin={averageBin}
              longTotalMaxLiquidity={longTotalMaxLiquidity}
              longTotalUnusedLiquidity={longTotalUnusedLiquidity}
              shortTotalMaxLiquidity={shortTotalMaxLiquidity}
              shortTotalUnusedLiquidity={shortTotalUnusedLiquidity}
              selectedBins={selectedBins}
              onAmountChange={onAmountChange}
              onRangeChange={onRangeChange}
              onFullRangeSelect={onFullRangeSelect}
              onAddLiquidity={onAddLiquidity}
              receipts={receipts}
              onClaimCLBTokens={onClaimCLBTokens}
              onClaimCLBTokensBatch={onClaimCLBTokensBatch}
              removeAmount={removeAmount}
              maxRemoveAmount={maxRemoveAmount}
              onRemoveAmountChange={onRemoveAmountChange}
              onRemoveMaxAmountChange={onRemoveMaxAmountChange}
              onRemoveLiquidity={onRemoveLiquidity}
            />
            {/* bottom */}
            <article className="px-5 pt-5 pb-6 mx-auto mt-5 border rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <p>Token(ERC-1155) Contract Address</p>
                  {/* tooltip */}
                </div>
                <div className="flex items-center gap-1">
                  {/* address */}
                  {selectedToken && (
                    <p>{trimAddress(selectedToken.address, 6, 6)}</p>
                  )}
                  <Button iconOnly={<Square2StackIcon />} />
                </div>
              </div>
              <div>
                <p className="mt-6 text-left text-black/30">
                  Please set additional values to apply to the basic formula in
                  Borrow Fee. Calculated based on open Interest and stop
                  profit/Loss rate.
                </p>
                <Link to={"/trade"}>
                  <Button label="Trade on this ETH/USDC Pool" />
                </Link>
              </div>
            </article>
          </div>
          <div className="w-2/5 max-w-[500px] min-w-[480px]">
            <PoolProgress
              token={selectedToken}
              market={selectedMarket}
              receipts={receipts}
              onReceiptClaim={(id) => {
                onClaimCLBTokens(id);
              }}
              onReceiptClaimBatch={() => {
                onClaimCLBTokensBatch();
              }}
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pool;
