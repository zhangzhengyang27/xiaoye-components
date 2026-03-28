import type {
  SplitterCollapseDirection,
  SplitterLayout,
  SplitterPanelProps,
  SplitterProps,
  SplitterSize
} from "xiaoye-components";

const layout: SplitterLayout = "horizontal";
const collapseDirection: SplitterCollapseDirection = "start";
const size: SplitterSize = "320px";

void layout;
void collapseDirection;
void size;

const splitterProps: SplitterProps = {
  layout: "vertical",
  lazy: true
};

void splitterProps;

const panelProps: SplitterPanelProps = {
  min: 120,
  max: "40%",
  size: "320px",
  resizable: true,
  collapsible: true
};

void panelProps;

const invalidProps: SplitterProps = {
  // @ts-expect-error layout should be horizontal or vertical
  layout: "grid"
};

void invalidProps;
