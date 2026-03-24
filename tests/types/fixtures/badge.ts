import type { BadgeProps, BadgeType } from "xiaoye-components";

const type: BadgeType = "primary";

const badgeProps: BadgeProps = {
  value: 12,
  max: 99,
  isDot: false,
  hidden: false,
  type,
  showZero: true,
  color: "blue",
  badgeStyle: {
    top: "2px"
  },
  offset: [10, 5],
  badgeClass: "custom-badge"
};

void badgeProps;

const invalidType: BadgeProps = {
  // @ts-expect-error invalid type should be rejected
  type: "neutral"
};

void invalidType;

const invalidOffset: BadgeProps = {
  // @ts-expect-error offset should be a tuple of numbers
  offset: ["10", 5]
};

void invalidOffset;
