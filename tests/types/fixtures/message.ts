import { h } from "vue";
import {
  XyMessage,
  XyMessageService,
  type MessageActionContext,
  type MessageClickHandler,
  type MessageCloseFilter,
  type MessageCloseReason,
  type MessageGlobalConfig,
  type MessageHandler,
  type MessageOptions,
  type MessagePlacement,
  type MessageSnapshot,
  type MessageType,
  type MessageUpdateOptions
} from "xiaoye-components";

const type: MessageType = "success";
const placement: MessagePlacement = "top-right";
const closeReason: MessageCloseReason = "manual";

void closeReason;

const globalConfig: MessageGlobalConfig = {
  max: 3,
  maxByPlacement: {
    "top-right": 1
  },
  grouping: true,
  duration: 2_400,
  offset: 24,
  showClose: true,
  showIcon: true,
  plain: false,
  placement: "bottom-right",
  closeOnClick: true,
  closeOnPressEscape: true,
  pauseOnHover: true,
  pauseOnFocus: true,
  pauseOnPageHidden: true,
  transition: "xy-message-fade",
  resetOnRepeat: false
};

void globalConfig;

const onClick: MessageClickHandler = (ctx) => {
  void ctx.event;
};

const options: MessageOptions = {
  message: "保存成功",
  render: () => h("strong", "富文本消息"),
  type,
  placement,
  duration: 3000,
  showClose: true,
  showIcon: true,
  grouping: true,
  groupKey: "publish-sync",
  plain: false,
  customClass: "message-demo",
  appendTo: "#message-shell",
  dangerouslyUseHTMLString: false,
  zIndex: 3200,
  closeOnClick: true,
  closeOnPressEscape: true,
  pauseOnHover: true,
  pauseOnFocus: true,
  pauseOnPageHidden: true,
  transition: "xy-message-fade",
  max: 3,
  resetOnRepeat: false,
  icon: "mdi:bell-outline",
  beforeClose(done, ctx: MessageActionContext) {
    void ctx.reason;
    done();
  },
  onClose(ctx: MessageActionContext) {
    void ctx.reason;
  },
  onClick
};

void options;

const elementOptions: MessageOptions = {
  message: "挂到指定节点",
  appendTo: document.createElement("div")
};

void elementOptions;

const handler: MessageHandler = XyMessage(options);

const updateOptions: MessageUpdateOptions = {
  message: () => h("strong", "已更新"),
  type: "warning",
  placement: "bottom-left",
  repeatNum: 2,
  closeOnClick: false,
  pauseOnPageHidden: false,
  groupKey: "review-sync",
  render: () => h("em", "render update"),
  max: 2
};

handler.update(updateOptions);
handler.close("programmatic");

XyMessage.success("成功");
XyMessage.warning({
  message: () => h("span", "警告"),
  groupKey: "warning-group"
});
XyMessage.closeAll();
XyMessage.closeAll({
  placement: "bottom-right",
  groupKey: "warning-group"
});
XyMessage.closeAllByPlacement("bottom");

const filter: MessageCloseFilter = {
  placement: "top-right",
  groupKey: "publish-sync"
};

void filter;

const snapshot: MessageSnapshot = XyMessage.getState();

void snapshot;

const scopedMessage = XyMessage.withContext(null);
const implicitScopedMessage = XyMessage.withContext();

scopedMessage.info("scoped");
scopedMessage.closeAll({
  placement: "top"
});
implicitScopedMessage.success("implicit-scoped");

const aliasHandler = XyMessageService.error({
  message: "<strong>危险</strong>",
  dangerouslyUseHTMLString: true
});

aliasHandler.close("close-all");

const invalidType: MessageOptions = {
  // @ts-expect-error invalid message type should be rejected
  type: "danger"
};

void invalidType;

const invalidPlacement: MessageOptions = {
  // @ts-expect-error invalid placement should be rejected
  placement: "center"
};

void invalidPlacement;

const invalidShowClose: MessageOptions = {
  // @ts-expect-error showClose should be a boolean
  showClose: "true"
};

void invalidShowClose;

const invalidDuration: MessageOptions = {
  // @ts-expect-error duration should be a number
  duration: "3000"
};

void invalidDuration;

const invalidAppendTo: MessageOptions = {
  // @ts-expect-error appendTo should be a string or HTMLElement
  appendTo: 1
};

void invalidAppendTo;

const invalidCloseReason = () => {
  // @ts-expect-error invalid close reason should be rejected
  handler.close("overflow");
};

void invalidCloseReason;
