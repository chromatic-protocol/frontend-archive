import { Popover } from '@headlessui/react';
import { ChevronDoubleUpIcon } from '@heroicons/react/24/outline';
import { OutlinkIcon } from '~/assets/icons/Icon';
import { CompleteLgIcon, CreateLgIcon, LoadingLgIcon } from '~/assets/icons/CreateAccountIcon';
import { Avatar } from '~/stories/atom/Avatar';
import { Button } from '~/stories/atom/Button';
import { Loading } from '~/stories/atom/Loading';
import { OptionInput } from '~/stories/atom/OptionInput';
import { Outlink } from '~/stories/atom/Outlink';
import { SkeletonElement } from '~/stories/atom/SkeletonElement';
import { TooltipAlert } from '~/stories/atom/TooltipAlert';
import { TooltipGuide } from '~/stories/atom/TooltipGuide';

import { useAssetPanel } from './hooks';

export interface AssetPanelProps {
  type: 'Deposit' | 'Withdraw';
}

export const AssetPanel = (props: AssetPanelProps) => {
  const {
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
  } = useAssetPanel(props);
  const { type } = props;

  return (
    <Popover>
      {({ open, close }) => (
        <>
          {/* <Popover.Button
            className={`btn btn-light btn-sm ${
              open ? '!border-primary dark:!border-transparent dark:!bg-gray-dark' : ''
            }`}
          > */}
          <Popover.Button className={`btn btn-line btn-sm ${open ? '!border-primary-light' : ''}`}>
            {type}
          </Popover.Button>

          {/* 1. create account */}
          {isAccountNotExist && (
            <Popover.Panel className="popover-panel">
              <div className="w-full gap-2 pt-2 text-center">
                <article className="inner-box">
                  <CreateLgIcon />
                  <div>
                    {isDeposit ? 'To make a deposit' : 'To withdraw an asset'}
                    , you need to <br />
                    create account first.
                  </div>
                </article>
                <div className="my-7">
                  <p className="text-primary-light">
                    This process may take approximately 10 seconds or so.
                  </p>
                </div>
                <div className="text-center">
                  <Button
                    label="Create Account"
                    size="xl"
                    css="active"
                    className="w-full"
                    onClick={onClickCreateAccount}
                  />
                  <Button
                    iconOnly={<ChevronDoubleUpIcon />}
                    size="sm"
                    css="unstyled"
                    className="w-full my-2"
                    onClick={close}
                  />
                </div>
              </div>
            </Popover.Panel>
          )}

          {/* 2. loading to generate account */}
          {isAccountCreating && (
            <Popover.Panel className="popover-panel">
              <div className="w-full gap-2 pt-2 text-center">
                <article className="inner-box">
                  <span className="animate-spin-slow">
                    <LoadingLgIcon />
                  </span>
                  <p>
                    The account address is being generated <br /> on the chain.
                  </p>
                </article>
                <div className="my-7">
                  <p className="text-primary-light">
                    This process may take approximately 10 seconds or so. Please wait a moment.
                  </p>
                </div>
                <div className="text-center">
                  <Button
                    label="Create Account"
                    iconRight={<Loading />}
                    size="xl"
                    css="active"
                    className="w-full"
                    disabled
                  />
                  <Button
                    iconOnly={<ChevronDoubleUpIcon />}
                    size="sm"
                    css="unstyled"
                    className="w-full my-2"
                    onClick={close}
                  />
                </div>
              </div>
            </Popover.Panel>
          )}

          {/* 3. complete to create account */}
          {isAccountCreated && (
            <Popover.Panel className="popover-panel">
              <div className="w-full gap-2 pt-2 text-center">
                <article className="inner-box">
                  <CompleteLgIcon />
                  <p>Account has been created</p>
                </article>
                <div className="text-center">
                  <Button
                    iconOnly={<ChevronDoubleUpIcon />}
                    size="sm"
                    css="unstyled"
                    className="w-full my-2"
                    onClick={close}
                  />
                </div>
              </div>
            </Popover.Panel>
          )}

          {isAccountExist && (
            <Popover.Panel className="popover-panel">
              <div className="w-full gap-2 pt-2">
                <article className="relative flex items-center gap-4 p-4 overflow-hidden border dark:border-transparent rounded-xl bg-paper-light">
                  <p className="flex-none pr-4 border-r text-primary-lighter">My Account</p>
                  <div className="w-[calc(100%-140px)] overflow-hidden overflow-ellipsis text-left">
                    {chromaticAddress}
                  </div>
                  <Button
                    href={addressExplorer}
                    size="base"
                    css="unstyled"
                    className="absolute right-2"
                    iconOnly={<OutlinkIcon />}
                  />
                </article>
                <section className="flex mt-5 text-left">
                  <article className="flex flex-col items-start w-2/5 min-w-[140px] gap-3">
                    <h4 className="text-lg font-semibold">{type}</h4>
                    <div className="py-2 pl-2 pr-3 border rounded-full">
                      <Avatar size="xs" label={tokenName} gap="1" src={tokenImage} />
                    </div>
                    <div>
                      <div className="flex mb-1 text-primary-lighter">
                        Available Margin
                        <TooltipGuide
                          label="available-margin"
                          tip="Available Margin is the amount that can be immediately withdrawn. Available Margin = Balance - Taker Margin"
                        />
                      </div>
                      <div>
                        <SkeletonElement isLoading={isLoading} width={80}>
                          {availableMargin} {tokenName}
                        </SkeletonElement>
                      </div>
                    </div>
                    {/* 
                      Temporary commented out 
                      https://github.com/chromatic-protocol/frontend/issues/290
                    */}
                    {/* <div>
                      <div className="flex mb-1 text-primary-lighter">
                        Asset Value
                        <TooltipGuide
                          label="asset-value"
                          tip="This is the total sum of the asset in my account, including the amount collateralized by taker margin and unrealized PnL."
                        />
                      </div>
                      <p>
                        <SkeletonElement isLoading={isLoading} width={80}>
                          {formatDecimals(assetValue, token?.decimals, 5)} {token?.name}
                        </SkeletonElement>
                      </p>
                    </div> */}
                  </article>
                  <article className="flex flex-col w-3/5 gap-3 border-l ml-7 pl-7">
                    <h4 className="text-lg font-semibold">Amount</h4>
                    <div className="tooltip-input-amount">
                      <OptionInput
                        value={amount}
                        maxValue={maxAmount}
                        onChange={onAmountChange}
                        className="w-full"
                        error={isAmountError}
                      />
                      {isExceeded && (
                        <TooltipAlert
                          label="input-amount"
                          tip={
                            isDeposit
                              ? 'Exceeded your wallet balance.'
                              : 'Exceeded the available margin.'
                          }
                        />
                      )}
                      {isLess && (
                        <TooltipAlert
                          label="input-amount"
                          tip={`Less than minimum amount. (${minimumAmount})`}
                        />
                      )}
                    </div>
                    <div className="text-sm">
                      <div className="mb-1 text-primary-lighter">
                        To open a position in the Chromatic Protocol, you need to deposit the
                        required amount of settlement assets into your account.{' '}
                        <Outlink outLink="https://chromatic-protocol.gitbook.io/docs/trade/settlement" />
                      </div>
                    </div>
                  </article>
                </section>
                <div className="mt-6 text-center">
                  <Button
                    label={type}
                    size="xl"
                    css="active"
                    className="w-full"
                    onClick={() => onClickSubmit(close)}
                    disabled={isSubmitDisabled}
                  />
                  <Button
                    iconOnly={<ChevronDoubleUpIcon />}
                    size="sm"
                    css="unstyled"
                    className="w-full my-2"
                    onClick={close}
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
