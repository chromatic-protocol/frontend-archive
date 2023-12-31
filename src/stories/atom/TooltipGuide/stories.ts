import type { Meta, StoryObj } from "@storybook/react";
import { TooltipGuide } from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: "Atom/TooltipGuide",
  component: TooltipGuide,
  tags: ["autodocs"],
  argTypes: {
    // backgroundColor: { control: "color" },
  },
} satisfies Meta<typeof TooltipGuide>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    label: "hover",
    tip: "tooltip",
  },
};

export const WithLink: Story = {
  args: {
    label: "hover",
    tip: "tooltip",
    outLink: "/trade",
  },
};

export const WithLinkAbout: Story = {
  args: {
    label: "hover",
    tip: "tooltip",
    outLink: "/trade",
    outLinkAbout: "Example",
  },
};
