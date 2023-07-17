import '../../atom/Input/style.css';

import { Button } from '../Button';
import { useMemo } from 'react';

interface LeverageOptionProps {
  value?: number;
  max: number;
  onClick?: (nextValue: number) => unknown;
}

export const LeverageOption = ({ value, max, onClick }: LeverageOptionProps) => {
  const LEVERAGE_LIST = [1, 2, 5, 10, 15, 20];

  const filteredLeverage = useMemo(() => LEVERAGE_LIST.filter((v) => v <= max), [max]);

  return (
    <div className="flex gap-1">
      {filteredLeverage.map((leverage) => {
        return (
          <Button
            key={`${leverage}`}
            className="w-12 shadow-base"
            label={`${leverage}x`}
            size="sm"
            css={value === leverage ? 'active' : 'gray'}
            onClick={() => {
              onClick?.(leverage);
            }}
          />
        );
      })}
    </div>
  );
};
