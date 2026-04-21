import type { DescriptionsDataItem, DescriptionsProps } from "xiaoye-components";
import { h } from "vue";

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
    },
    {
      label: "预算",
      value: 128000.5,
      valueType: "money"
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
    valueType: "tag",
    options: [
      {
        label: "启用",
        value: "启用",
        status: "success"
      }
    ],
    tag: {
      text: "启用"
    }
  },
  {
    label: "负责人卡片",
    value: "小叶",
    formatter: (_row, _column, value) => `负责人：${String(value ?? "-")}`
  },
  {
    label: "复制字段",
    value: "workspace-token",
    valueType: "copy"
  },
  {
    label: "自定义渲染",
    value: "稳定",
    render: (value) => h("strong", String(value ?? "-"))
  }
];

void props;
void items;

const invalidProps: DescriptionsProps = {
  // @ts-expect-error unsupported direction
  direction: "inline"
};

void invalidProps;
