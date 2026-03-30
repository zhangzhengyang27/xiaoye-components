import type { DescriptionsProps } from "xiaoye-components";

const props: DescriptionsProps = {
  column: 2,
  border: true,
  title: "成员信息",
  extra: "只读",
  labelWidth: 120,
  direction: "vertical"
};

void props;

const invalidProps: DescriptionsProps = {
  // @ts-expect-error unsupported direction
  direction: "inline"
};

void invalidProps;
