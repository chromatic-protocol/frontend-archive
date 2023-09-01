import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useMarketLocal } from '~/hooks/useMarketLocal';
import { useTokenLocal } from '~/hooks/useTokenLocal';
import { Button } from '~/stories/atom/Button';
import { Outlink } from '~/stories/atom/Outlink';
import { Toast } from '~/stories/atom/Toast';
import { ChainModal } from '~/stories/container/ChainModal';
import { Header } from '~/stories/template/Header';
import { TradeBar } from '~/stories/template/TradeBar';
import { TradePanelV2 } from '~/stories/template/TradePanelV2';
import { MainBarV2 } from '~/stories/template/MainBarV2';
import { TradeList } from '~/stories/template/TradeList';
import { TradeLiquidity } from '~/stories/template/TradeLiquidity';
import { TradeChartView } from '~/stories/template/TradeChartView';
import { BookmarkBoard } from '~/stories/template/BookmarkBoard';
import './style.css';

function TradeV2() {
  useTokenLocal();
  useMarketLocal();

  return (
    <div className="flex flex-col min-h-[100vh] w-full">
      <div className="absolute top-0 h-[70px] opacity-80 p-1">[v2]</div>
      <Header />
      <section className="flex flex-col grow w-full max-w-[1600px] items-stretch px-5 mx-auto mb-20">
        <BookmarkBoard />
        <MainBarV2 accountPopover />
        <div className="flex w-full gap-1">
          <article className="flex-auto w-full">
            <TradeChartView />
            <div className="my-6 text-left text-primary-lighter">
              The Trade Fee is calculated by summing up the different fees from the Liquidity Bins
              that accept the positions. The EST. Trade Fee is calculated based on the current
              oracle price, and the actual fee paid is determined by the next oracle price.
            </div>
          </article>
          <article className="w-[240px] flex-none flex flex-col gap-1">
            <TradeLiquidity />
            <TradeList />
          </article>
          <article className="w-[480px] flex-none">
            <TradePanelV2 />
            <div className="my-6 text-left text-primary-lighter">
              The Trade Fee is calculated by summing up the different fees from the Liquidity Bins
              that accept the positions. The EST. Trade Fee is calculated based on the current
              oracle price, and the actual fee paid is determined by the next oracle price.{' '}
              <Outlink outLink="https://chromatic-protocol.gitbook.io/docs/fee/trading-fee" />
            </div>
          </article>
        </div>
      </section>
      <TradeBar />
      <Toast />
      <ChainModal />
    </div>
  );
}

export default TradeV2;
