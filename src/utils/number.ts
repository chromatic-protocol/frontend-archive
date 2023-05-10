import { BigNumber, BigNumberish } from "ethers";

interface BigNumberify {
  (value: number): BigNumber;
  (value: unknown): BigNumber | undefined;
}
export const bigNumberify: BigNumberify = (value) => {
  if (typeof value === "number") {
    return BigNumber.from(value);
  }
  try {
    return BigNumber.from(value);
  } catch (error) {
    return undefined!;
  }
};

export const withComma = (value: number | string | BigNumber) => {
  const seperator = /\B(?=(\d{3})+(?!\d))/g;
  if (typeof value === "number") {
    const [integer, decimal] = String(value).split(".");
    return String(integer).replace(seperator, ",") + decimal;
  }
  if (typeof value === "string") {
    const [integer, decimal] = value.split(".");
    return integer.replace(seperator, ",") + decimal;
  }
  if (value instanceof BigNumber) {
    const [integer, decimal] = value.toString().split(".");
    return integer.replace(seperator, ",") + decimal;
  }
};

export const applyDecimals = (value: BigNumberish, decimals: number) => {
  const multiplicand = bigNumberify(10).pow(decimals);
  if (typeof value === "number") {
    return bigNumberify(value).mul(multiplicand);
  }

  const multiplier = bigNumberify(value);
  return multiplier?.mul(multiplicand);
};