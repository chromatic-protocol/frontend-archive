import { isValid } from '~/utils/valid';
import './style.css';

interface ProgressProps {
  value?: number;
  max?: number;
  css?: 'default' | 'sm';
}

export const Progress = (props: ProgressProps) => {
  const { value, max, css = 'default' } = props;
  const progressPercent = isValid(value) && isValid(max) ? (value / max) * 100 : 0;

  return (
    <div className={`progress progress-${css} w-full h-1 overflow-hidden rounded`}>
      {css === 'sm' ? (
        <div className="h-full rounded bg-grayL2 dark:bg-grayD2">
          <div
            className={`h-full bg-black1 dark:bg-white1 rounded`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      ) : (
        <div
          className={`h-full bg-black1 dark:bg-white1 rounded`}
          style={{ width: `${progressPercent}%` }}
        />
      )}
    </div>
  );
};
