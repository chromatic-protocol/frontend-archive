import { Progress } from '~/stories/atom/Progress';
import { Avatar } from '~/stories/atom/Avatar';
import { Thumbnail } from '~/stories/atom/Thumbnail';
import { TooltipGuide } from '~/stories/atom/TooltipGuide';
import './style.css';

export interface PoolBalanceProps {}

export const PoolBalance = (props: PoolBalanceProps) => {
  return (
    <div className="p-5 PoolBalance panel">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Thumbnail size="xs" />
            <div className="flex">
              <h5>Assets under Management</h5>
              <TooltipGuide label="asset-under-management" tip="tooltip" />
            </div>
          </div>
          <div className="text-right">
            <Avatar label="101.373 USDC" size="xs" fontSize="lg" />
            <p className="text-sm text-primary-lighter">$101.373</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Thumbnail size="xs" />
            <div className="flex">
              <h5>CLP supply</h5>
              <TooltipGuide label="clp-supply" tip="tooltip" />
            </div>
          </div>
          <div className="text-right">
            <Avatar label="101.373 USDC" size="xs" fontSize="lg" />
            <p className="text-sm text-primary-lighter">$101.373</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-3 mt-3 border-t">
        <div className="flex items-center justify-between">
          <h5>Asset value</h5>
          <h5>$2,101.37</h5>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h5>Utilization</h5>
            <div className="text-right">
              <h5>35.73%</h5>
              <p className="text-sm text-primary-lighter">7,234.23 ETH</p>
            </div>
          </div>
          <Progress value={50} max={100} />
        </div>
      </div>
    </div>
  );
};
