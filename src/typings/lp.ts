import { Address } from 'wagmi';
import { Market, Token } from './market';

export interface ChromaticLp {
  address: Address;
  name: string;
  tag: string;
  balance: bigint;
  decimals: number;
  image: string;
  totalSupply: bigint;
  totalValue: bigint;
  holdingValue: bigint;
  pendingValue: bigint;
  holdingClbValue: bigint;
  pendingClbValue: bigint;
  utilization: number;

  price: bigint;
  settlementToken: Token;
  market: Market;

  clpName: string;
  clpSymbol: string;
  clpDecimals: number;
}

export interface LpReceipt {
  key: string;
  id: bigint;
  lpAddress: Address;
  amount: bigint;
  mintedAmount: bigint;
  burnedAmount: bigint;
  remainedAmount: bigint;
  hasReturnedValue: boolean;
  isIssued: boolean;
  isSettled: boolean;
  recipient: Address;
  action: 'minting' | 'burning';
  status: 'standby' | 'completed';
  message: string;
  detail: [string, string | undefined];
  token: {
    name?: string;
    decimals?: number;
    logo?: string;
  };
  blockNumber: bigint;
  blockTimestamp: bigint;
}

export interface LpToken {
  name: string;
  image: string;
  symbol: string;
  decimals: number;
  address: Address;
}

export type LpReceiptPartial = Pick<
  LpReceipt,
  'action' | 'isIssued' | 'isSettled' | 'id' | 'recipient'
>;
