import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { isNotNil } from 'ramda';
import { Link } from 'react-router-dom';
import { OutlinkIcon } from '~/assets/icons/Icon';
import { useBlockExplorer } from '~/hooks/useBlockExplorer';
import { useMarket } from '~/hooks/useMarket';
import { useMarketLocal } from '~/hooks/useMarketLocal';
import { useTokenLocal } from '~/hooks/useTokenLocal';
import { AddressCopyButton } from '~/stories/atom/AddressCopyButton';
import { Button } from '~/stories/atom/Button';
import { Outlink } from '~/stories/atom/Outlink';
import { Toast } from '~/stories/atom/Toast';
import { ChainModal } from '~/stories/container/ChainModal';
import { PoolProgress } from '~/stories/molecule/PoolProgress';
import { Footer } from '~/stories/template/Footer';
import { Header } from '~/stories/template/Header';
import { MainBar } from '~/stories/template/MainBar';
import { PoolPanel } from '~/stories/template/PoolPanel';
import { trimAddress } from '~/utils/address';
import { copyText } from '~/utils/clipboard';
import './style.css';

const Pool = () => {
  const { currentMarket: selectedMarket, clbTokenAddress } = useMarket();
  useTokenLocal();
  useMarketLocal();

  const blockExplorer = useBlockExplorer();

  return (
    <div className="flex flex-col min-h-[100vh] w-full">
      <Header />
      <section className="flex flex-col grow w-full max-w-[1200px] px-5 mx-auto mb-20">
        <MainBar />
        <div className="flex items-stretch gap-3">
          <div className="flex-auto w-3/5">
            <PoolPanel />
            {/* bottom */}
            <article className="p-5 mx-auto mt-3 border shadow-lg dark:border-transparent dark:shadow-none bg-paper rounded-2xl">
              <div className="flex items-center justify-between w-full gap-1">
                <h4 className="font-bold">Token(ERC-1155) Contract Address</h4>
                <div className="flex gap-2">
                  <AddressCopyButton
                    address={clbTokenAddress && trimAddress(clbTokenAddress, 6, 6)}
                    onClick={() => {
                      if (clbTokenAddress) {
                        copyText(clbTokenAddress);
                      }
                    }}
                  />
                  <Button
                    href={
                      clbTokenAddress && blockExplorer
                        ? `${blockExplorer}/token/${clbTokenAddress}`
                        : undefined
                    }
                    label="view scanner"
                    css="light"
                    size="lg"
                    iconOnly={<OutlinkIcon />}
                  />
                </div>
              </div>
              <div className="mt-3 mb-3 text-base text-left text-primary-lighter">
                When providing liquidity to the liquidity bins of the Chromatic protocol, providers
                are rewarded by minting CLB tokens. CLB tokens follow the ERC-1155 standard and have
                one token contract per market, with each bin having its own unique token ID.{' '}
                <Outlink outLink="https://chromatic-protocol.gitbook.io/docs/tokens/clb-token-erc-1155" />
              </div>
            </article>
            <div className="">
              <Link to={'/trade'}>
                <Button
                  css="light"
                  className="dark:!bg-paper-light dark:hover:!bg-gray-light"
                  label={
                    isNotNil(selectedMarket)
                      ? `Trade on ${selectedMarket.description} Pool`
                      : 'Market loading'
                  }
                  iconRight={<ChevronRightIcon />}
                />
              </Link>
            </div>
          </div>
          <div className="w-2/5 max-w-[500px] min-w-[480px]">
            <PoolProgress />
          </div>
        </div>
      </section>
      <Footer />
      <Toast />
      <ChainModal />
    </div>
  );
};

export default Pool;
