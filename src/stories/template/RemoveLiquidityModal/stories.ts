import type { Meta, StoryObj } from '@storybook/react';

import { RemoveLiquidityModal } from '.';

const meta = {
  title: 'Template/Modal/RemoveLiquidityModal',
  component: RemoveLiquidityModal,
  // argTypes: {
  // },
} satisfies Meta<typeof RemoveLiquidityModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedBin: {
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
    token: {
      name: 'USDC',
      address: '0x',
      decimals: 6,
    },
    amount: '1000',
    maxAmount: 20000n,
  },
};
