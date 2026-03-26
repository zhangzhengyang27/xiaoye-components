import { h } from "vue";
import type {
  DividerBorderStyle,
  DividerContentPosition,
  DividerDirection,
  DividerProps
} from "xiaoye-components";
import { XyDivider } from "xiaoye-components";

const direction: DividerDirection = "vertical";
const contentPosition: DividerContentPosition = "left";
const borderStyle: DividerBorderStyle = "dashed";

const dividerProps: DividerProps = {
  direction,
  contentPosition,
  borderStyle,
  size: "lg",
  status: "warning"
};

void direction;
void contentPosition;
void borderStyle;
void dividerProps;

const vnode = h(
  XyDivider,
  {
    contentPosition: "right",
    borderStyle: "double",
    status: "primary"
  },
  {
    default: () => "阶段节点"
  }
);

void vnode;

const invalidDirection: DividerProps = {
  // @ts-expect-error invalid direction should be rejected
  direction: "inline"
};

void invalidDirection;

const invalidContentPosition: DividerProps = {
  // @ts-expect-error invalid content position should be rejected
  contentPosition: "top"
};

void invalidContentPosition;

const invalidSize: DividerProps = {
  // @ts-expect-error invalid size should be rejected
  size: "xl"
};

void invalidSize;

const invalidStatus: DividerProps = {
  // @ts-expect-error invalid status should be rejected
  status: "info"
};

void invalidStatus;

const invalidBorderStyle: DividerProps = {
  // @ts-expect-error borderStyle should be a string
  borderStyle: 1
};

void invalidBorderStyle;
