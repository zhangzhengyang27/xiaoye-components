import type { ProgressProps } from "xiaoye-components";

const lineProps: ProgressProps = {
  percentage: 56,
  status: "warning",
  stripedFlow: true,
  format: (percentage) => `完成 ${percentage}%`
};

void lineProps;

const circleProps: ProgressProps = {
  type: "circle",
  percentage: 72,
  color: [
    { color: "#dc2626", percentage: 30 },
    "#f59e0b",
    "#059669"
  ]
};

void circleProps;

const dynamicColorProps: ProgressProps = {
  percentage: 84,
  color: (percentage) => (percentage > 80 ? "#059669" : "#2563eb")
};

void dynamicColorProps;

const invalidProps: ProgressProps = {
  // @ts-expect-error invalid progress type should be rejected
  type: "radial"
};

void invalidProps;
