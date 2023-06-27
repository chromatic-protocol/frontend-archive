import { BigNumber } from 'ethers';

export interface Bin {
  liquidity: BigNumber;
  freeLiquidity: BigNumber;
  clbTokenName: string;
  clbTokenImage: string;
  clbTokenDescription: string;
  clbTokenDecimals: number;
  clbTokenValue: number;
  baseFeeRate: number;
  tokenId: BigNumber;
}

export interface OwnedBin extends Bin {
  clbTokenBalance: BigNumber;
  clbTotalSupply: BigNumber;
  binValue: BigNumber;
  removableRate: number;
}

export interface LiquidityPool<T = Bin> {
  tokenAddress: string;
  marketAddress: string;
  bins: Array<T>;
}

export interface CLBTokenMetadata {
  name: string;
  description: string;
  image: string;
  decimals: number;
}

export interface LiquidityPoolSummary {
  token: { name: string; decimals: number };
  market: string;
  liquidity: BigNumber;
  bins: number;
  thumbnail?: string;
}

export type ADD_LIQUIDITY_STATUS = 'IDLE' | 'PENDING' | 'FINISHED';
export type REMOVE_LIQUIDITY_STATUS = 'IDLE' | 'PENDING' | 'FINISHED';
