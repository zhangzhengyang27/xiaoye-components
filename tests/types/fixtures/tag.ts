import type { TagProps } from "xiaoye-components";

const tagProps: TagProps = {
  status: "primary",
  size: "md",
  round: true,
  closable: true,
  icon: "mdi:tag-outline"
};

void tagProps;

const invalidStatus: TagProps = {
  // @ts-expect-error invalid status should be rejected
  status: "info"
};

void invalidStatus;

const invalidIcon: TagProps = {
  // @ts-expect-error icon should be a string
  icon: 1
};

void invalidIcon;
