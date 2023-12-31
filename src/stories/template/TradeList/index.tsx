import '~/stories/atom/Tabs/style.css';
import './style.css';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { ArrowTriangleIcon } from '~/assets/icons/Icon';
import { Button } from '~/stories/atom/Button';
import { ResizablePanel } from '~/stories/atom/ResizablePanel';

const tradeListItems = [
  { direction: 'long', price: 2424.1212, amount: 0.1212, time: '10:00:30' },
  { direction: 'short', price: 2424.1212, amount: 0.1212, time: '11:00:00' },
  { direction: 'short', price: 24.1212, amount: 0.12, time: '11:00:00' },
  { direction: 'short', price: 2424.1212, amount: 0.1212, time: '11:00:00' },
  { direction: 'short', price: 2424.1212, amount: 0.1212, time: '11:00:00' },
  { direction: 'short', price: 2424.1212, amount: 0.1212, time: '11:00:00' },
  { direction: 'short', price: 2424.1212, amount: 0.1212, time: '11:00:00' },
];

export interface TradeListProps {}

export const TradeList = (props: TradeListProps) => {
  return (
    <div className="TradeList min-h-[236px]">
      <ResizablePanel
        initialWidth={240}
        initialHeight={242}
        minHeight={120}
        maxHeight={800}
        minWidth={240}
        className="relative flex flex-col pb-2 overflow-hidden panel"
        bottom
      >
        <div className="sticky flex items-stretch flex-none border-b">
          <div className="flex items-center flex-auto px-3">
            <h4>Trades</h4>
          </div>
          <Button iconOnly={<ArrowPathIcon />} css="square" />
        </div>
        <div className="w-full px-3 py-2 text-primary-lighter">
          <div className="tr">
            <span className="td">Price</span>
            <span className="td">Amount</span>
            <span className="td">Time</span>
          </div>
        </div>
        <div className="flex flex-col w-full gap-1 px-3 overflow-y-auto">
          {tradeListItems.map((item, index) => (
            <div key={index} className="tr">
              <span className="td">
                <span className="flex items-center gap-[2px]">
                  {item.price}
                  <span
                    className={
                      item.direction === 'long'
                        ? 'text-price-higher rotate-180'
                        : 'text-price-lower'
                    }
                  >
                    <ArrowTriangleIcon />
                  </span>
                </span>
              </span>
              <span
                className={`td ${
                  item.direction === 'long' ? 'text-price-higher' : 'text-price-lower'
                }`}
              >
                {item.amount}
              </span>
              <span className="td">{item.time}</span>
            </div>
          ))}
        </div>
      </ResizablePanel>
    </div>
  );
};
