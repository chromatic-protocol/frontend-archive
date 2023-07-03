import './style.css';
import { Popover } from '@headlessui/react';
import {
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  ChevronDoubleUpIcon,
} from '@heroicons/react/24/outline';
import { BigNumber } from 'ethers';
import { isNotNil } from 'ramda';
import { Loading } from '~/stories/atom/Loading';
import { Outlink } from '~/stories/atom/Outlink';
import { TooltipGuide } from '~/stories/atom/TooltipGuide';
import {
  ACCOUNT_COMPLETED,
  ACCOUNT_COMPLETING,
  ACCOUNT_CREATING,
  ACCOUNT_NONE,
  ACCOUNT_STATUS,
  Account,
} from '../../../typings/account';
import { Token } from '../../../typings/market';
import { bigNumberify, expandDecimals, formatDecimals, withComma } from '../../../utils/number';
import { Avatar } from '../../atom/Avatar';
import { Button } from '../../atom/Button';
import { OptionInput } from '../../atom/OptionInput';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface AssetPopoverProps {
  // onClick?: () => void;
  account?: Account;
  status?: ACCOUNT_STATUS;
  selectedToken?: Token;
  walletBalances?: Record<string, BigNumber>;
  usumBalances?: Record<string, BigNumber>;
  amount?: string;
  totalBalance?: BigNumber;
  availableMargin?: BigNumber;
  assetValue?: BigNumber;
  loading?: boolean;
  onAmountChange?: (value: string) => unknown;
  onDeposit?: () => unknown;
  onWithdraw?: () => unknown;
  onConnect?: () => void;
  onStatusUpdate?: () => unknown;
}

export const AssetPopover = ({
  account,
  status,
  selectedToken,
  walletBalances,
  usumBalances,
  amount,
  totalBalance,
  availableMargin,
  assetValue,
  loading,
  onAmountChange,
  onDeposit,
  onWithdraw,
  onConnect,
  onStatusUpdate,
  ...props
}: AssetPopoverProps) => {
  const isLoaded = isNotNil(account) && isNotNil(selectedToken);

  return (
    <>
      <div className="AssetPopover relative flex items-center justify-between gap-6 border rounded-2xl min-h-[100px] bg-white shadow-lg">
        <div className="ml-10">
          <Avatar size="sm" fontSize="lg" label="Asset balance" gap="2" />
        </div>
        <div className="flex flex-col gap-2 mr-10 text-right">
          {isLoaded ? (
            <>
              <h2 className="text-2xl">
                {loading && <Skeleton width={120} />}
                <span className={loading ? 'hidden' : ''}>
                  {totalBalance &&
                    withComma(formatDecimals(totalBalance, selectedToken.decimals, 2))}
                </span>
              </h2>
              <Popover.Group className="flex gap-3">
                <AssetPanel
                  title="Deposit"
                  account={account}
                  status={status}
                  token={selectedToken}
                  walletBalances={walletBalances}
                  usumBalances={usumBalances}
                  amount={amount}
                  availableMargin={availableMargin}
                  assetValue={assetValue}
                  onAmountChange={onAmountChange}
                  onDeposit={onDeposit}
                  onWithdraw={onWithdraw}
                  onStatusUpdate={onStatusUpdate}
                  loading={loading}
                />
                <AssetPanel
                  title="Withdraw"
                  account={account}
                  status={status}
                  token={selectedToken}
                  walletBalances={walletBalances}
                  usumBalances={usumBalances}
                  amount={amount}
                  availableMargin={availableMargin}
                  assetValue={assetValue}
                  onAmountChange={onAmountChange}
                  onDeposit={onDeposit}
                  onWithdraw={onWithdraw}
                  onStatusUpdate={onStatusUpdate}
                  loading={loading}
                />
              </Popover.Group>
            </>
          ) : (
            <>
              <Button label="Connect Wallet" size="sm" />
            </>
          )}
        </div>
      </div>
    </>
  );
};

interface AssetPanelProps {
  account?: Account;
  status?: ACCOUNT_STATUS;
  token?: Token;
  walletBalances?: Record<string, BigNumber>;
  usumBalances?: Record<string, BigNumber>;
  amount?: string;
  availableMargin?: BigNumber;
  assetValue?: BigNumber;
  loading?: boolean;
  onAmountChange?: (value: string) => unknown;
  onDeposit?: () => unknown;
  onWithdraw?: () => unknown;
  onStatusUpdate?: () => unknown;
  title: string;
}

const AssetPanel = (props: AssetPanelProps) => {
  const {
    title,
    account,
    status,
    token,
    walletBalances,
    usumBalances,
    amount,
    availableMargin = bigNumberify(0),
    assetValue = bigNumberify(0),
    loading,
    onAmountChange,
    onDeposit,
    onWithdraw,
    onStatusUpdate,
  } = props;

  return (
    <Popover>
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`btn btn-default btn-sm ${open ? 'border-black !text-black' : ''}`}
          >
            {title}
          </Popover.Button>
          {/* account 없을 때 */}
          {/* 1. create account */}
          {status === ACCOUNT_NONE && (
            <Popover.Panel className="popover-panel">
              <div className="w-full gap-2 pt-2 text-center">
                <article className="relative flex flex-col items-center gap-4 px-5 pt-6 pb-8 overflow-hidden border rounded-xl bg-grayL/20">
                  <img src="/src/assets/images/i_create_account_xl.svg" alt="create account" />
                  <p>
                    To make a deposit, you need to <br />
                    create account first
                  </p>
                </article>
                <div className="my-7">
                  <p className="text-black/50">
                    This process may take approximately 10 seconds or more.
                  </p>
                </div>
                <div className="text-center">
                  <Button
                    label="Create Account"
                    size="xl"
                    css="active"
                    className="w-full"
                    onClick={() => {
                      onStatusUpdate?.();
                    }}
                  />
                  <Button
                    iconOnly={<ChevronDoubleUpIcon />}
                    size="sm"
                    css="unstyled"
                    className="w-full my-2"
                    onClick={() => {
                      close();
                    }}
                  />
                </div>
              </div>
            </Popover.Panel>
          )}

          {/* account 없을 때 */}
          {/* 2. loading to generate account */}
          {status === ACCOUNT_CREATING && (
            <Popover.Panel className="popover-panel">
              <div className="w-full gap-2 pt-2 text-center">
                <article className="relative flex flex-col items-center gap-4 px-5 pt-6 pb-8 overflow-hidden border rounded-xl bg-grayL/20">
                  <img
                    src="/src/assets/images/i_loading_xl.svg"
                    alt="creating account"
                    className="animate-spin-slow"
                  />
                  <p>
                    The account addtress is being generated <br /> on the chain
                  </p>
                </article>
                <div className="my-7">
                  <p className="text-black/50">
                    This process may take approximately 10 seconds or more.
                  </p>
                </div>
                <div className="text-center">
                  <Button
                    label="Create Account"
                    iconRight={<Loading />}
                    size="xl"
                    css="active"
                    className="w-full"
                    disabled={true}
                  />
                  <Button
                    iconOnly={<ChevronDoubleUpIcon />}
                    size="sm"
                    css="unstyled"
                    className="w-full my-2"
                    onClick={() => {
                      close();
                    }}
                  />
                </div>
              </div>
            </Popover.Panel>
          )}

          {/* account 없을 때 */}
          {/* 3. complete to create account */}
          {/* todo: 3초 정도 보여지고, account 있을 때의 UI로 자연스럽게 전환됨 */}
          {status === ACCOUNT_COMPLETING && (
            <Popover.Panel className="popover-panel">
              <div className="w-full gap-2 pt-2 text-center">
                <article className="relative flex flex-col items-center gap-4 px-5 pt-6 pb-8 overflow-hidden border rounded-xl bg-grayL/20">
                  <img src="/src/assets/images/i_check_xl.svg" alt="creating account" />
                  <p>Account has been created</p>
                </article>
                <div className="py-8"></div>
                <div className="text-center">
                  <Button
                    label="Create Account"
                    iconRight={<CheckIcon />}
                    size="xl"
                    css="active"
                    className="w-full"
                    disabled={true}
                  />
                  <Button
                    iconOnly={<ChevronDoubleUpIcon />}
                    size="sm"
                    css="unstyled"
                    className="w-full my-2"
                    onClick={() => {
                      close();
                    }}
                  />
                </div>
              </div>
            </Popover.Panel>
          )}

          {/* account 있을 때 */}
          {status === ACCOUNT_COMPLETED && (
            <Popover.Panel className="popover-panel">
              <div className="w-full gap-2 pt-2">
                <article className="relative flex items-center gap-4 p-4 overflow-hidden border rounded-xl bg-grayL/20">
                  <p className="flex-none pr-4 border-r text-black/30">My Account</p>
                  <div className="w-[calc(100%-140px)] overflow-hidden overflow-ellipsis">
                    {account?.usumAddress}
                  </div>
                  <Button
                    size="base"
                    css="unstyled"
                    className="absolute right-2"
                    iconOnly={<ArrowTopRightOnSquareIcon />}
                  />
                </article>
                <section className="flex mt-5 text-left">
                  <article className="flex flex-col items-start w-2/5 min-w-[140px] gap-3">
                    <h4 className="text-lg font-semibold">{title}</h4>
                    <div className="px-3 py-2 border rounded-full">
                      <Avatar size="xs" label={token?.name} gap="1" />
                    </div>
                    <div>
                      <p className="flex mb-1 text-black/30">
                        Available Margin
                        <TooltipGuide
                          label="available-margin"
                          tip="Available Margin is the amount that can be immediately withdrawn. Available Margin = Balance - Taker Margin"
                        />
                      </p>
                      <p>
                        {loading && <Skeleton width={80} />}
                        <span className={loading ? 'hidden' : ''}>
                          {formatDecimals(availableMargin, token?.decimals, 2)} {token?.name}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="flex mb-1 text-black/30">
                        Asset Value
                        <TooltipGuide
                          label="asset-value"
                          tip="This is the total sum of the asset in my account, including the amount collateralized by taker margin and unrealized PnL."
                        />
                      </p>
                      <p>
                        {loading && <Skeleton width={80} />}
                        <span className={loading ? 'hidden' : ''}>
                          {formatDecimals(assetValue, token?.decimals, 2)} {token?.name}
                        </span>
                      </p>
                    </div>
                  </article>
                  <article className="flex flex-col w-3/5 gap-3 border-l ml-7 pl-7">
                    <h4 className="text-lg font-semibold">Amount</h4>
                    <OptionInput
                      value={amount}
                      maxValue={
                        token &&
                        (title === 'Deposit'
                          ? walletBalances?.[token.name]
                              ?.div(expandDecimals(token.decimals))
                              .toString()
                          : usumBalances?.[token.name]
                              ?.div(expandDecimals(token.decimals))
                              .toString())
                      }
                      onChange={(event) => {
                        event.preventDefault();
                        onAmountChange?.(event.target.value);
                      }}
                      onButtonClick={(value) => {
                        onAmountChange?.(value);
                      }}
                    />
                    <div>
                      <p className="mb-1 text-xs text-black/30">
                        To open a position in the Chromatic Protocol, you need to deposit the
                        required amount of settlement assets into your account.
                      </p>
                      <Outlink outLink="#" />
                    </div>
                  </article>
                </section>
                <div className="mt-6 text-center">
                  <Button
                    label={title}
                    size="xl"
                    css="active"
                    className="w-full"
                    onClick={() => {
                      if (title === 'Deposit') {
                        onDeposit && onDeposit();
                      } else {
                        onWithdraw && onWithdraw();
                      }
                    }}
                  />
                  <Button
                    iconOnly={<ChevronDoubleUpIcon />}
                    size="sm"
                    css="unstyled"
                    className="w-full my-2"
                    onClick={() => {
                      close();
                    }}
                  />
                </div>
              </div>
            </Popover.Panel>
          )}
        </>
      )}
    </Popover>
  );
};
