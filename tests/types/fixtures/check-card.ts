import type {
  CheckCardAvatar,
  CheckCardGroupOption,
  CheckCardGroupProps,
  CheckCardProps,
  CheckCardSingleValue,
  CheckCardTag
} from "xiaoye-components";

const avatar: CheckCardAvatar = {
  text: "审",
  icon: "mdi:view-grid-outline",
  src: "https://example.com/cover.png",
  alt: "avatar",
  srcSet: "https://example.com/cover.png 1x",
  fit: "cover",
  shape: "square",
  size: "lg"
};

void avatar;

const tag: CheckCardTag = {
  text: "推荐",
  props: {
    status: "primary",
    round: true
  }
};

void tag;

const checkCardProps: CheckCardProps = {
  modelValue: true,
  size: "md",
  disabled: false,
  title: "工作台",
  description: "承接卡片式选择场景",
  extra: "详情",
  avatar,
  tag,
  ariaLabel: "工作台"
};

void checkCardProps;

const groupOption: CheckCardGroupOption = {
  value: "dashboard",
  title: "工作台",
  description: "默认首页入口",
  avatar,
  tag
};

void groupOption;

const singleValue: CheckCardSingleValue = "dashboard";

void singleValue;

const checkCardGroupProps: CheckCardGroupProps = {
  modelValue: ["dashboard"],
  options: [groupOption],
  size: "sm",
  disabled: false,
  multiple: true,
  ariaLabel: "入口选择"
};

void checkCardGroupProps;

const invalidSize: CheckCardProps = {
  // @ts-expect-error invalid size should be rejected
  size: "xl"
};

void invalidSize;

const invalidValue: CheckCardGroupOption = {
  // @ts-expect-error value should only accept string or number
  value: true
};

void invalidValue;
