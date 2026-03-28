import type { SpaceProps } from "xiaoye-components";

const props: SpaceProps = {
  size: 20,
  direction: "vertical",
  wrap: true,
  align: "stretch"
};

void props;

const presetProps: SpaceProps = {
  size: "sm",
  direction: "horizontal",
  wrap: false,
  align: "center"
};

void presetProps;

const invalidProps: SpaceProps = {
  // @ts-expect-error unsupported direction should be rejected
  direction: "grid"
};

void invalidProps;
