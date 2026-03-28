import type { RateProps } from "xiaoye-components";

const props: RateProps = {
  modelValue: 3.5,
  lowThreshold: 2,
  highThreshold: 4,
  max: 5,
  colors: {
    2: "#94a3b8",
    4: "#f59e0b",
    5: "#16a34a"
  },
  voidColor: "#e5e7eb",
  disabledVoidColor: "#cbd5e1",
  icons: ["mdi:star", "mdi:star", "mdi:star", "mdi:star", "mdi:star"],
  voidIcon: "mdi:star-outline",
  disabledVoidIcon: "mdi:star-off-outline",
  allowHalf: true,
  showText: true,
  texts: ["极差", "较差", "一般", "满意", "惊喜"],
  textColor: "#334155",
  scoreTemplate: "{value} 分",
  size: "lg",
  clearable: true,
  ariaLabel: "满意度评分",
  validateEvent: true
};

void props;

const invalidProps: RateProps = {
  // @ts-expect-error max should be a number
  max: "5"
};

void invalidProps;
