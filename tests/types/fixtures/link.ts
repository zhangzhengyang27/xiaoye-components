import type { LinkProps } from "xiaoye-components";

const linkProps: LinkProps = {
  type: "info",
  underline: "always",
  href: "https://example.com",
  target: "_blank",
  icon: "mdi:open-in-new"
};

void linkProps;

const booleanUnderline: LinkProps = {
  underline: true
};

void booleanUnderline;

const invalidType: LinkProps = {
  // @ts-expect-error invalid type should be rejected
  type: "filled"
};

void invalidType;

const invalidUnderline: LinkProps = {
  // @ts-expect-error invalid underline mode should be rejected
  underline: "focus"
};

void invalidUnderline;

const invalidIcon: LinkProps = {
  // @ts-expect-error icon should be a string
  icon: 1
};

void invalidIcon;
