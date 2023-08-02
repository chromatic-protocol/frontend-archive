import type { Meta, StoryObj } from '@storybook/react';

import { RemoveMultiLiquidityModal } from '.';

const meta = {
  title: 'Template/Modal/RemoveMultiLiquidityModal',
  component: RemoveMultiLiquidityModal,
  // argTypes: {
  // },
} satisfies Meta<typeof RemoveMultiLiquidityModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedBins: [
      {
        clbTotalSupply: 10000000n,
        tokenId: 100n,
        baseFeeRate: 10,
        clbTokenBalance: 50000000000n,
        binValue: 10000000000n,
        clbBalanceOfSettlement: 50000000000n,
        removableRate: 87500000000000n,
        liquidity: 3000000000n,
        freeLiquidity: 2000000000n,
        clbTokenName: 'LP BIN NAME',
        clbTokenDescription: 'LP BIN DESCRIPTION',
        clbTokenImage: '',
        clbTokenDecimals: 18,
        clbTokenValue: 1000n,
      },
      {
        clbTotalSupply: 10000000n,
        tokenId: 100n,
        baseFeeRate: 10,
        clbTokenBalance: 50000000000n,
        binValue: 10000000000n,
        clbBalanceOfSettlement: 50000000000n,
        removableRate: 87500000000000n,
        liquidity: 3000000000n,
        freeLiquidity: 2000000000n,
        clbTokenName: 'LP BIN NAME',
        clbTokenDescription: 'LP BIN DESCRIPTION',
        clbTokenImage: '',
        clbTokenDecimals: 18,
        clbTokenValue: 1000n,
      },
    ],
    token: {
      name: 'USDC',
      address: '0x',
      decimals: 6,
    },
    amount: 100.23,
  },
};
