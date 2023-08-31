import './style.css';

import { Popover } from '@headlessui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { Avatar } from '~/stories/atom/Avatar';
import { SkeletonElement } from '~/stories/atom/SkeletonElement';
import { TooltipGuide } from '~/stories/atom/TooltipGuide';
import { BookmarkButton } from '~/stories/atom/BookmarkButton';

import { useMarketSelectV2 } from './hooks';

export function MarketSelectV2() {
  const {
    isLoading,
    tokenName,
    marketDescription,
    tokens,
    markets,
    price,
    priceClass,
    interestRate,
  } = useMarketSelectV2();

  return (
    <>
      <div className="relative MarketSelectV2 panel">
        <div className="flex items-center gap-3">
          <BookmarkButton size="lg" />
          <Popover>
            <Popover.Button className="flex items-center h-20 gap-3">
              <div className="pr-3 border-r">
                <div className="flex items-center gap-1">
                  <SkeletonElement isLoading={isLoading} circle width={24} height={24} />
                  <SkeletonElement isLoading={isLoading} width={60} containerClassName="text-2xl">
                    <Avatar label={tokenName} fontSize="2xl" gap="1" size="sm" />
                  </SkeletonElement>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <SkeletonElement isLoading={isLoading} circle width={24} height={24} />
                  <SkeletonElement isLoading={isLoading} width={80} containerClassName="text-2xl">
                    <Avatar label={marketDescription} fontSize="2xl" gap="1" size="sm" />
                  </SkeletonElement>
                </div>
              </div>
              <ChevronDownIcon
                className="w-5 h-5 transition duration-150 ease-in-out"
                aria-hidden="true"
              />
            </Popover.Button>
            <Popover.Panel className="popover-panel">
              <p className="text-primary-lighter">Select Market</p>
              <section className="flex flex-auto w-full py-3">
                <article className="flex flex-col pr-6 mr-6 border-r">
                  {tokens.map(({ key, isSelectedToken, onClickToken, name }) => (
                    <button
                      key={key}
                      className={`flex items-center gap-2 px-4 py-2 ${
                        isSelectedToken && 'border bg-paper-lighter rounded-lg' // the token selected
                      }`}
                      onClick={onClickToken}
                      title={name}
                    >
                      <Avatar label={name} fontSize="lg" gap="2" size="sm" />
                      {isSelectedToken && <ChevronRightIcon className="w-4" />}
                    </button>
                  ))}
                </article>

                <article className="flex flex-col flex-auto">
                  {markets.map(({ key, isSelectedMarket, onClickMarket, description, price }) => (
                    <div className="relative flex items-center w-full">
                      <BookmarkButton className="absolute left-0 ml-2" />
                      <button
                        key={key}
                        className={`w-full flex items-center justify-between gap-4 pl-8 py-2 pr-2 ${
                          isSelectedMarket && 'border bg-paper-lighter rounded-lg'
                        }`}
                        onClick={onClickMarket}
                      >
                        <Avatar label={description} fontSize="lg" gap="2" size="sm" />
                        <span>${price}</span>
                      </button>
                    </div>
                  ))}
                </article>
              </section>
            </Popover.Panel>
          </Popover>
        </div>
        <div className="flex items-center gap-5 mr-10">
          <h2 className={`text-3xl ${priceClass}`}>
            <SkeletonElement isLoading={isLoading} width={80}>
              ${price}
            </SkeletonElement>
          </h2>
          <div className="flex flex-col gap-1 pl-5 text-left border-l text-primary-light">
            <h4>
              <SkeletonElement isLoading={isLoading} width={80}>
                {interestRate}%/h
              </SkeletonElement>
            </h4>
            <div className="flex">
              <p>Interest Rate</p>
              <TooltipGuide
                label="interest-rate"
                tip="This is the rate of Borrow Fee that needs to be paid to the LP while the position is open. The Interest Rate is determined by the Dao for each settlement asset."
                outLink="https://chromatic-protocol.gitbook.io/docs/fee/interest"
                className="mr-0"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
