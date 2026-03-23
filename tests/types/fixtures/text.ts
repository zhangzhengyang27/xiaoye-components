import type { TextProps } from "xiaoye-components";

const textProps: TextProps = {
  type: "info",
  size: "lg",
  truncated: true,
  lineClamp: 2,
  tag: "p"
};

void textProps;

const invalidType: TextProps = {
  // @ts-expect-error invalid type should be rejected
  type: "neutral"
};

void invalidType;

const invalidSize: TextProps = {
  // @ts-expect-error invalid size should be rejected
  size: "large"
};

void invalidSize;

const invalidLineClamp: TextProps = {
  // @ts-expect-error lineClamp should be string or number
  lineClamp: true
};

void invalidLineClamp;
