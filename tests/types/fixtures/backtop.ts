import type { BacktopInstance, BacktopProps } from "xiaoye-components";

const backtopProps: BacktopProps = {
  visibilityHeight: 180,
  target: ".drawer-body",
  right: 24,
  bottom: 32
};

void backtopProps;

const backtopRef = null as BacktopInstance | null;

void backtopRef;

const invalidVisibilityHeight: BacktopProps = {
  // @ts-expect-error visibilityHeight should be a number
  visibilityHeight: "200"
};

void invalidVisibilityHeight;

const invalidTarget: BacktopProps = {
  // @ts-expect-error target should be a string
  target: document.body
};

void invalidTarget;

const invalidRight: BacktopProps = {
  // @ts-expect-error right should be a number
  right: "24px"
};

void invalidRight;
