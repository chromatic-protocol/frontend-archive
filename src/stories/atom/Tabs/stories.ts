import type { Meta, StoryObj } from "@storybook/react";

import { Tabs } from ".";

const meta = {
  title: "Atom/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  // argTypes: {
  // },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Tabs",
  },
};

// export const Large: Story = {
//   args: {
//     size: "lg",
//     label: "Tabs",
//   },
// };

// export const Small: Story = {
//   args: {
//     size: "sm",
//     label: "Tabs",
//   },
// };