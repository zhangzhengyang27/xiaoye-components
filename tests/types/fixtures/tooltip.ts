import { h } from "vue";
import {
  XyTooltip,
  type TooltipEffect,
  type TooltipPopperOptions,
  type TooltipProps,
  type TooltipTrigger
} from "xiaoye-components";

const trigger: TooltipTrigger = "contextmenu";
const effect: TooltipEffect = "light";

const popperOptions: TooltipPopperOptions = {
  strategy: "absolute",
  zIndex: 4096,
  arrowPadding: 10,
  shiftPadding: 16,
  flip: true,
  fallbackPlacements: ["right-start", "bottom-end"]
};

const tooltipProps: TooltipProps = {
  modelValue: false,
  content: "成员状态说明",
  placement: "left-start",
  trigger: ["click", trigger],
  triggerKeys: ["Enter", "F2"],
  effect,
  rawContent: false,
  virtualRef: document.body,
  virtualTriggering: true,
  popperOptions,
  popperClass: "custom-tooltip",
  popperStyle: {
    width: "260px"
  }
};

void tooltipProps;
void popperOptions;

const tooltipVNode = h(XyTooltip, tooltipProps, {
  default: () => h("button", { type: "button" }, "打开提示"),
  content: () => h("span", null, "插槽内容")
});

void tooltipVNode;

const invalidTrigger: TooltipProps = {
  // @ts-expect-error invalid trigger should be rejected
  trigger: "drag"
};

const invalidTriggerList: TooltipProps = {
  // @ts-expect-error invalid trigger array item should be rejected
  trigger: ["hover", "drag"]
};

const invalidEffect: TooltipProps = {
  // @ts-expect-error invalid effect should be rejected
  effect: "primary"
};

const invalidStrategy: TooltipProps = {
  popperOptions: {
    // @ts-expect-error invalid strategy should be rejected
    strategy: "sticky"
  }
};

const invalidRawContent: TooltipProps = {
  // @ts-expect-error rawContent should be boolean
  rawContent: "true"
};

void invalidTrigger;
void invalidTriggerList;
void invalidEffect;
void invalidStrategy;
void invalidRawContent;
