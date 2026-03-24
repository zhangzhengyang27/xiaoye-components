import { h } from "vue";
import type {
  ResultIconType,
  ResultProps,
  ResultStatus,
  ResultVariant
} from "xiaoye-components";
import { XyResult } from "xiaoye-components";

const icon: ResultIconType = "success";
const status: ResultStatus = "primary";
const variant: ResultVariant = "card";

const resultProps: ResultProps = {
  title: "提交成功",
  subTitle: "兼容旧描述字段",
  description: "推荐使用的新描述字段",
  icon,
  status,
  size: "lg",
  variant,
  iconSize: 96
};

void resultProps;

const vnode = h(
  XyResult,
  {
    title: "等待补充",
    description: "还需要补齐负责人"
  },
  {
    icon: () => "icon",
    title: () => "title",
    description: () => "description",
    "sub-title": () => "sub-title",
    default: () => "content",
    extra: () => "extra"
  }
);

void vnode;

const invalidStatus: ResultProps = {
  // @ts-expect-error invalid result status should be rejected
  status: "info"
};

void invalidStatus;

const invalidVariant: ResultProps = {
  // @ts-expect-error invalid variant should be rejected
  variant: "panel"
};

void invalidVariant;

const invalidSize: ResultProps = {
  // @ts-expect-error invalid size should be rejected
  size: "xl"
};

void invalidSize;
