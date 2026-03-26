import type { AppContext, VNode, VNodeChild } from "vue";

export const messageTypes = ["primary", "success", "info", "warning", "error"] as const;
export const messagePlacements = [
  "top",
  "top-left",
  "top-right",
  "bottom",
  "bottom-left",
  "bottom-right"
] as const;
export const messageCloseReasons = [
  "manual",
  "auto",
  "programmatic",
  "click",
  "escape",
  "close-all"
] as const;

export const MESSAGE_DEFAULT_PLACEMENT = "top";
export const MESSAGE_DEFAULT_TRANSITION = "xy-message-fade";
export const MESSAGE_GROUP_SPACING = 16;

export type MessageType = (typeof messageTypes)[number];
export type MessagePlacement = (typeof messagePlacements)[number];
export type MessageCloseReason = (typeof messageCloseReasons)[number];
export type MessageContent = string | number | VNode | (() => VNodeChild);
export type MessagePlacementLimits = Partial<Record<MessagePlacement, number>>;

export interface MessageCloseFilter {
  type?: MessageType;
  placement?: MessagePlacement;
  target?: string | HTMLElement;
  targetKey?: string;
  groupKey?: string;
}

export interface MessageActionContext {
  id: string;
  type: MessageType;
  placement: MessagePlacement;
  targetKey: string;
  repeatNum: number;
  groupKey?: string;
  reason: MessageCloseReason;
  close: (reason?: MessageCloseReason) => void;
}

export type MessageLifecycleContext = MessageActionContext;
export type MessageClickContext = MessageActionContext & {
  event: MouseEvent;
};
export type MessageLifecycleHandler = (context: MessageActionContext) => void;
export type MessageClickHandler = (context: MessageClickContext) => void;
export type MessageDoneFn = (cancel?: boolean) => void;
export type MessageBeforeCloseFn = (
  done: MessageDoneFn,
  context: MessageActionContext
) => void | Promise<void>;

export interface MessageGlobalConfig {
  max?: number;
  maxByPlacement?: MessagePlacementLimits;
  grouping?: boolean;
  duration?: number;
  offset?: number;
  showClose?: boolean;
  showIcon?: boolean;
  plain?: boolean;
  placement?: MessagePlacement;
  closeOnClick?: boolean;
  closeOnPressEscape?: boolean;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  pauseOnPageHidden?: boolean;
  transition?: string;
  resetOnRepeat?: boolean;
}

export interface MessageProps {
  customClass?: string;
  dangerouslyUseHTMLString?: boolean;
  duration?: number;
  icon?: string;
  id?: string;
  message?: MessageContent;
  render?: () => VNodeChild;
  onClose?: MessageLifecycleHandler;
  onClosed?: MessageLifecycleHandler;
  onClick?: MessageClickHandler;
  showClose?: boolean;
  showIcon?: boolean;
  type?: MessageType;
  plain?: boolean;
  offset?: number;
  placement?: MessagePlacement;
  repeatNum?: number;
  targetKey?: string;
  groupKey?: string;
  zIndex?: number;
  beforeClose?: MessageBeforeCloseFn;
  closeOnClick?: boolean;
  closeOnPressEscape?: boolean;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  pauseOnPageHidden?: boolean;
  transition?: string;
  resetOnRepeat?: boolean;
}

export interface MessageOptions extends Omit<MessageProps, "id" | "repeatNum" | "targetKey"> {
  appendTo?: string | HTMLElement;
  grouping?: boolean;
  max?: number;
}

export type MessageParams = MessageContent | MessageOptions;

export interface MessageOptionsNormalized extends MessageProps {
  appendTo: HTMLElement;
  grouping: boolean;
  placement: MessagePlacement;
  repeatNum: number;
  targetKey: string;
  max: number | null;
}

export type MessageUpdateOptions = Partial<MessageOptions> &
  Partial<Pick<MessageProps, "repeatNum">>;

export interface MessageHandler {
  id: string;
  close(reason?: MessageCloseReason): void;
  update(patch: MessageUpdateOptions): void;
}

export interface MessageSnapshotEntry {
  id: string;
  type: MessageType;
  placement: MessagePlacement;
  targetKey: string;
  repeatNum: number;
  visible: boolean;
  groupKey?: string;
  messageText?: string | number;
  hasRichContent: boolean;
}

export interface MessageSnapshot {
  placements: Partial<Record<MessagePlacement, MessageSnapshotEntry[]>>;
  total: number;
}

export type MessageTypedFn = (
  options?: MessageParams,
  appContext?: AppContext | null
) => MessageHandler;

export interface MessageFn {
  (options?: MessageParams, appContext?: AppContext | null): MessageHandler;
  closeAll(filter?: MessageType | MessageCloseFilter): void;
  closeAllByPlacement(placement: MessagePlacement): void;
  getState(filter?: MessageCloseFilter): MessageSnapshot;
}

export interface Message extends MessageFn {
  primary: MessageTypedFn;
  success: MessageTypedFn;
  info: MessageTypedFn;
  warning: MessageTypedFn;
  error: MessageTypedFn;
  withContext: (appContext?: AppContext | null) => Message;
  _context: AppContext | null;
}

export const MESSAGE_TYPE_ICON_MAP: Record<MessageType, string> = {
  primary: "mdi:information-outline",
  success: "mdi:check-circle-outline",
  info: "mdi:information-outline",
  warning: "mdi:alert-circle-outline",
  error: "mdi:close-circle-outline"
};

export const MESSAGE_CLOSE_ICON = "mdi:close";

export const messageDefaults = {
  customClass: "",
  dangerouslyUseHTMLString: false,
  duration: 3000,
  icon: "",
  message: "",
  render: undefined,
  onClose: undefined,
  onClick: undefined,
  showClose: false,
  showIcon: true,
  type: "info",
  plain: false,
  offset: 16,
  placement: MESSAGE_DEFAULT_PLACEMENT,
  repeatNum: 1,
  targetKey: "",
  groupKey: undefined,
  zIndex: undefined,
  beforeClose: undefined,
  closeOnClick: false,
  closeOnPressEscape: true,
  pauseOnHover: true,
  pauseOnFocus: false,
  pauseOnPageHidden: false,
  transition: MESSAGE_DEFAULT_TRANSITION,
  resetOnRepeat: true,
  appendTo: typeof document !== "undefined" ? document.body : (null as unknown as HTMLElement),
  grouping: false,
  max: null
} satisfies Omit<MessageOptionsNormalized, "id">;

export function invokeMessageBeforeClose(
  beforeClose: MessageBeforeCloseFn | undefined,
  context: MessageActionContext,
  onProceed: () => void
) {
  if (!beforeClose) {
    onProceed();
    return;
  }

  let finished = false;
  const done: MessageDoneFn = (cancel) => {
    if (finished) {
      return;
    }

    finished = true;

    if (cancel) {
      return;
    }

    onProceed();
  };

  try {
    const result = beforeClose(done, context);

    if (result && typeof (result as Promise<void>).catch === "function") {
      void (result as Promise<void>).catch(() => {
        finished = true;
      });
    }
  } catch {
    finished = true;
  }
}
