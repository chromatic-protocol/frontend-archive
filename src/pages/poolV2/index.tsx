import PlusIcon from '~/assets/icons/PlusIcon';
import { useMarketLocal } from '~/hooks/useMarketLocal';
import { useTokenLocal } from '~/hooks/useTokenLocal';
import { Button } from '~/stories/atom/Button';
import { Toast } from '~/stories/atom/Toast';
import { ChainModal } from '~/stories/container/ChainModal';
import { Footer } from '~/stories/template/Footer';
import { Header } from '~/stories/template/Header';
import { MainBarV2 } from '~/stories/template/MainBarV2';
import { Tag } from '~/stories/atom/Tag';
import { Avatar } from '~/stories/atom/Avatar';
import { PoolPerformance } from '~/stories/template/PoolPerformance';
import { PoolStat } from '~/stories/template/PoolStat';
import { PoolMenu } from '~/stories/template/PoolMenu';
import { PoolPanelV2 } from '~/stories/template/PoolPanelV2';
import { PoolDetail } from '~/stories/template/PoolDetail';
import { PoolBalance } from '~/stories/template/PoolBalance';
import { BookmarkBoard } from '~/stories/template/BookmarkBoard';
import './style.css';

const PoolV2 = () => {
  useTokenLocal();
  useMarketLocal();

  return (
    <div className="flex flex-col min-h-[100vh] min-w-[1280px] w-full relative">
      <Header />
      <BookmarkBoard />
      <section className="sticky top-0">
        <MainBarV2 />
      </section>
      <section className="flex flex-col w-full px-5 mx-auto mb-20 grow max-w-[1400px]">
        <div className="flex items-stretch gap-5">
          <div className="flex-none w-[240px]">
            <h4 className="mt-3 mb-2 text-left">Pools</h4>
            <PoolMenu />
          </div>
          <div className="mt-10">
            <div className="mb-10 text-left">
              <div className="flex items-center mb-5">
                <h2 className="mr-3 text-4xl">ETH-BTC/USD Junior Pool</h2>
                <Tag label={`high risk`} className="tag-risk-high" />
                <Button
                  label="Metamask"
                  iconLeft={<PlusIcon className="w-3 h-3" />}
                  className="ml-4 !pl-2 !pt-[2px] !h-[26px]"
                  gap="1"
                  size="sm"
                />
              </div>
              <p className="text-lg text-primary-light">
                Highest rist and highest APR for the risk tolerant Level LPs. In case of unexpected
                shortfalls resulting from adverse market conditions or other incidents, the Junior
                Tranche bears the highest risk but also earns the largest share of platform profits
              </p>
            </div>
            <div className="flex items-center justify-between mb-3 text-lg text-primary">
              <div>esChroma Rewards: 500 esChroma/day</div>
              <div className="flex gap-2">
                CLP Price: 0.984
                <Avatar label="ETH" size="xs" gap="1" fontSize="lg" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-auto overflow-hidden">
                <PoolPanelV2 />
                {/* <PoolAnalytics /> */}
              </div>
              <div className="flex-none w-[420px] flex flex-col gap-3">
                {/* PoolBalance: To be added later */}
                <PoolBalance />
                <PoolStat />
                <PoolPerformance />
                <PoolDetail />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <Toast />
      <ChainModal />
    </div>
  );
};

export default PoolV2;
