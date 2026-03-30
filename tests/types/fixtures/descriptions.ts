import type { DescriptionsDataItem, DescriptionsProps } from "xiaoye-components";

const props: DescriptionsProps = {
  column: 2,
  border: true,
  title: "成员信息",
  extra: "只读",
  labelWidth: 120,
  direction: "vertical",
  collapse: true,
  items: [
    {
      label: "状态",
      value: "已通过",
      tag: {
        text: "已通过",
        props: {
          status: "success"
        }
      }
    },
    {
      label: "详情页",
      value: "查看详情",
      link: {
        href: "https://example.com/detail"
      },
      className: "item-class"
    }
  ]
};

const items: DescriptionsDataItem[] = [
  {
    label: "负责人",
    value: "小叶",
    icon: "mdi:account"
  },
  {
    label: "状态",
    value: "启用",
    tag: {
      text: "启用"
    }
  }
];

void props;
void items;

const invalidProps: DescriptionsProps = {
  // @ts-expect-error unsupported direction
  direction: "inline"
};

void invalidProps;
