import type { Meta, StoryObj } from '@storybook/react';
import { AssetPopover } from '.';
import { BigNumber } from 'ethers';

const meta = {
  title: 'Molecule/AssetPopover',
  component: AssetPopover,
} satisfies Meta<typeof AssetPopover>;

const tokens = [
  {
    address: '0x8FB1E3fC51F3b789dED7557E680551d93Ea9d892',
    name: 'USDC',
    decimals: 6,
  },
];

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  args: {
    loading: false,
    status: 'COMPLETED',
    account: {
      usumAddress: '0x0000000000111111111122222222223333333333',
      walletAddress: '0x1111111111222222222233333333334444444444',
    },
    selectedToken: tokens[0],
    availableMargin: BigNumber.from(1500000000),
    assetValue: BigNumber.from(2500000000),
    totalBalance: BigNumber.from(2000000000),
  },
};

export const LoggedOut: Story = {};
