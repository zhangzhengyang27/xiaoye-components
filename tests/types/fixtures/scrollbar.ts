import type { ScrollbarProps } from "xiaoye-components";

const scrollbarProps: ScrollbarProps = {
  distance: 8,
  height: 240,
  maxHeight: "50vh",
  native: false,
  wrapClass: "custom-wrap",
  viewClass: ["view", "view--card"],
  noresize: true,
  tag: "section",
  always: true,
  minSize: 24,
  tabindex: 0,
  id: "demo-scroll",
  role: "region",
  ariaLabel: "结果列表",
  ariaOrientation: "vertical"
};

void scrollbarProps;

const invalidDistance: ScrollbarProps = {
  // @ts-expect-error distance should be a number
  distance: "8"
};

void invalidDistance;

const invalidMinSize: ScrollbarProps = {
  // @ts-expect-error minSize should be a number
  minSize: "20"
};

void invalidMinSize;

const invalidOrientation: ScrollbarProps = {
  // @ts-expect-error unsupported ariaOrientation should be rejected
  ariaOrientation: "both"
};

void invalidOrientation;
