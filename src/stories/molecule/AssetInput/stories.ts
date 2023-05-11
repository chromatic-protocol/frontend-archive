import type { Meta, StoryObj } from "@storybook/react";

import { AssetInput } from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: "Molecule/AssetInput",
  component: AssetInput,
  tags: ["autodocs"],
  argTypes: {},
} satisfies Meta<typeof AssetInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Base Default AssetInput",
  },
};

export const WithAssetImage: Story = {
  args: {
    label: "Base Default AssetInput with Image",
    assetSrc: "src/assets/images/usdc.svg",
  },
};
