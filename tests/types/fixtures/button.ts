import type { ButtonProps } from "xiaoye-components";

const buttonProps: ButtonProps = {
  variant: "solid",
  status: "primary",
  size: "md"
};

void buttonProps;

const invalidButton: ButtonProps = {
  // @ts-expect-error invalid variant should be rejected
  variant: "filled"
};

void invalidButton;
