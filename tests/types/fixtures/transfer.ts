import type { TransferProps } from "xiaoye-components";

const props: TransferProps = {
  modelValue: [1],
  data: [
    { key: 1, label: "控制台" },
    { key: 2, label: "账单中心" }
  ],
  filterable: true
};

void props;

const invalidProps: TransferProps = {
  // @ts-expect-error modelValue should be array
  modelValue: 1,
  data: []
};

void invalidProps;
