import type { CardProps, CardShadow, CardVariant } from "xiaoye-components";

const shadow: CardShadow = "hover";
const variant: CardVariant = "muted";

const cardProps: CardProps = {
  size: "sm",
  variant,
  bordered: false,
  header: "卡片标题",
  footer: "卡片底部",
  extra: "最近更新",
  bodyStyle: {
    padding: "24px"
  },
  headerClass: "custom-header",
  bodyClass: "custom-body",
  footerClass: "custom-footer",
  headerDivider: false,
  footerDivider: false,
  shadow,
  loading: false,
  loadingText: "加载中",
  empty: true,
  emptyTitle: "暂无数据",
  emptyDescription: "这里还没有内容"
};

void cardProps;

const invalidShadow: CardProps = {
  // @ts-expect-error invalid shadow should be rejected
  shadow: "focus"
};

void invalidShadow;

const invalidVariant: CardProps = {
  // @ts-expect-error invalid variant should be rejected
  variant: "plain"
};

void invalidVariant;

const invalidSize: CardProps = {
  // @ts-expect-error invalid size should be rejected
  size: "xl"
};

void invalidSize;
