import { Avatar } from "../Avatar";
import { Button } from "../Button";
import "../../atom/Input/style.css";
import { ChangeEvent, useState } from "react";
import { bigNumberify } from "../../../utils/number";

interface AssetInputProps {
  label?: string;
  value?: string;
  totalValue?: string;
  placeholder?: string;
  assetSrc?: string;
  type?: string;
  size?: "sm" | "base" | "lg";
  css?: "default" | "active";
  align?: "center" | "left" | "right";
  disabled?: boolean;
  onClick?: () => unknown;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => unknown;
  onButtonClick?: (value: string) => unknown;
}

export const AssetInput = ({
  label,
  value,
  totalValue,
  placeholder = "0",
  type,
  assetSrc,
  size = "base",
  css = "default",
  align = "right",
  onChange,
  onButtonClick,
  ...props
}: AssetInputProps) => {
  const [ratio, setRatio] = useState<25 | 50 | 75 | 100>();
  const onClick = (ratio: 25 | 50 | 75 | 100) => {
    const nextValue = bigNumberify(totalValue)?.mul(ratio).div(100).toString();
    setRatio(ratio);
    onButtonClick?.(nextValue ?? "");
  };
  return (
    <div className="inline-flex flex-col">
      <div
        className={`inline-flex gap-3 items-center input input-${size} input-${css}`}
      >
        {assetSrc ? <Avatar className="" src={assetSrc} /> : null}
        <input
          type="number"
          className={`text-${align}`}
          value={value}
          placeholder={placeholder}
          onChange={(event) => {
            setRatio(undefined);
            onChange?.(event);
          }}
        />
      </div>
      <div className="flex gap-1 mt-2">
        {/* 버튼 누르면 값이 input에 입력되면서 active 상태됨, input value가 바뀌면 active 해제됨 */}
        <Button
          className="flex-auto"
          label="25%"
          size="sm"
          css={ratio === 25 ? "active" : undefined}
          onClick={() => {
            onClick(25);
          }}
        />
        <Button
          className="flex-auto"
          label="50%"
          size="sm"
          css={ratio === 50 ? "active" : undefined}
          onClick={() => onClick(50)}
        />
        <Button
          className="flex-auto"
          label="75%"
          size="sm"
          css={ratio === 75 ? "active" : undefined}
          onClick={() => onClick(75)}
        />
        <Button
          className="flex-auto"
          label="Max"
          size="sm"
          css={ratio === 100 ? "active" : undefined}
          onClick={() => onClick(100)}
        />
      </div>
    </div>
  );
};
