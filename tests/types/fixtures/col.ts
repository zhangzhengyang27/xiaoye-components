import type { ColProps } from "xiaoye-components";

const colProps: ColProps = {
  span: 12,
  offset: 2,
  pull: 1,
  push: 3,
  xs: 24,
  sm: {
    span: 12,
    offset: 2
  },
  md: 8,
  lg: {
    span: 6,
    offset: 3,
    pull: 1
  },
  xl: {
    span: 4,
    push: 2
  }
};

void colProps;

const invalidResponsiveType: ColProps = {
  // @ts-expect-error responsive value should be a number or object
  sm: "12"
};

void invalidResponsiveType;

const invalidResponsiveKey: ColProps = {
  lg: {
    // @ts-expect-error unsupported key should be rejected
    order: 1
  }
};

void invalidResponsiveKey;
