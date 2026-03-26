import { h } from "vue";
import type { ComponentCustomProperties } from "vue";
import type {
  NotificationCloseFilter,
  NotificationCloseReason,
  NotificationContent,
  NotificationGlobalConfig,
  NotificationHandler,
  NotificationOverflowStrategy,
  NotificationParams,
  NotificationPosition,
  NotificationProps,
  NotificationSnapshot,
  NotificationService,
  NotificationServiceCloseReason,
  NotificationServiceOptions,
  NotificationUpdateOptions,
  NotificationType
} from "xiaoye-components";
import { XyNotification, XyNotificationService } from "xiaoye-components";

const type: NotificationType = "warning";
const position: NotificationPosition = "bottom-left";
const closeReason: NotificationCloseReason = "manual";
const serviceCloseReason: NotificationServiceCloseReason = "overflow";
const overflowStrategy: NotificationOverflowStrategy = "drop-oldest";
const content: NotificationContent = () => h("span", "通知内容");
const closeFilter: NotificationCloseFilter = {
  type: "warning",
  position,
  groupKey: "sync-job",
  target: "#notify-target"
};
const notificationGlobalConfig: NotificationGlobalConfig = {
  duration: 2600,
  position: "top-right",
  offset: 24,
  showClose: false,
  zIndex: 3200,
  max: 2,
  overflowStrategy,
  appendTo: "#notify-target",
  dangerouslyUseHTMLString: true
};
const updateOptions: NotificationUpdateOptions = {
  title: "已更新通知",
  message: "新的通知内容",
  position: "top-left",
  appendTo: document.createElement("div"),
  max: 1
};

void closeReason;
void serviceCloseReason;
void closeFilter;
void notificationGlobalConfig;
void updateOptions;

const props: NotificationProps = {
  modelValue: true,
  title: "通知标题",
  message: content,
  type,
  duration: 3000,
  showClose: true,
  customClass: "custom-notification",
  icon: "mdi:bell-outline",
  closeIcon: "mdi:close-circle-outline",
  dangerouslyUseHTMLString: false
};

void props;

const serviceOptions: NotificationServiceOptions = {
  title: "服务通知",
  message: "<strong>自定义 HTML</strong>",
  type: "success",
  duration: 2400,
  showClose: true,
  customClass: "service-notification",
  icon: "mdi:check-circle-outline",
  closeIcon: "mdi:close",
  dangerouslyUseHTMLString: true,
  appendTo: "#notify-target",
  offset: 24,
  position,
  zIndex: 3200,
  onClick() {},
  onClosed(reason) {
    const currentReason: NotificationServiceCloseReason = reason;
    void currentReason;
  },
  groupKey: "sync-job",
  max: 3,
  overflowStrategy
};

void serviceOptions;

const serviceOptionsWithElement: NotificationServiceOptions = {
  title: "元素挂载",
  appendTo: document.createElement("div")
};

void serviceOptionsWithElement;

const handler: NotificationHandler = XyNotificationService.open(serviceOptions);

handler.close();
handler.close("manual");
handler.update(updateOptions);

const params: NotificationParams = "一条通知";

void params;

XyNotificationService.success("快捷成功");
XyNotificationService.warning({
  title: "警告通知",
  groupKey: "warn-job"
});
XyNotificationService.updateOffsets("top-right");
XyNotificationService.closeAll();
XyNotificationService.closeAll(closeFilter);

const snapshot: NotificationSnapshot = XyNotificationService.getState(closeFilter);

void snapshot;

const notify: NotificationService = XyNotificationService;
const globals = {} as ComponentCustomProperties;
const notifyFromGlobal = globals.$notify!;
const scopedNotify = XyNotificationService.withContext(null);
const scopedNotificationService: NotificationService = XyNotificationService.withContext(null);

notify.open({
  title: "来自 service.open"
});
scopedNotify.success("来自 scoped notify");
scopedNotificationService.open({
  title: "来自 scoped service.open"
});
notifyFromGlobal.withContext().info("来自 $notify.withContext()");
notifyFromGlobal({
  title: "来自 $notify",
  position: "top-left"
});

const vnode = h(XyNotification, {
  title: "VNode 通知",
  message: () => h("span", "内容")
});

void vnode;

const invalidType: NotificationProps = {
  // @ts-expect-error invalid notification type should be rejected
  type: "danger"
};

void invalidType;

const invalidDuration: NotificationProps = {
  // @ts-expect-error duration should be a number
  duration: "3000"
};

void invalidDuration;

const invalidPosition: NotificationServiceOptions = {
  // @ts-expect-error invalid position should be rejected
  position: "center"
};

void invalidPosition;

const invalidOverflow: NotificationServiceOptions = {
  // @ts-expect-error invalid overflowStrategy should be rejected
  overflowStrategy: "replace-current"
};

void invalidOverflow;

const invalidAppendTo: NotificationServiceOptions = {
  // @ts-expect-error appendTo should be string or HTMLElement
  appendTo: 1
};

void invalidAppendTo;

const invalidClosed: NotificationServiceOptions = {
  // @ts-expect-error onClosed should be a function
  onClosed: "closed"
};

void invalidClosed;

const invalidFilter: NotificationCloseFilter = {
  // @ts-expect-error filter position should be supported values
  position: "center"
};

void invalidFilter;

const invalidGlobalConfig: NotificationGlobalConfig = {
  // @ts-expect-error global config max should be a number
  max: "2"
};

void invalidGlobalConfig;

const invalidUpdate: NotificationUpdateOptions = {
  // @ts-expect-error update patch appendTo should be string or HTMLElement
  appendTo: 1
};

void invalidUpdate;
