import { withInstallFunction } from "@xiaoye/utils";
import message from "./src/method";
import type {
  Message,
  MessageActionContext,
  MessageClickContext,
  MessageClickHandler,
  MessageCloseFilter,
  MessageCloseReason,
  MessageContent,
  MessageFn,
  MessageGlobalConfig,
  MessageHandler,
  MessageLifecycleContext,
  MessageLifecycleHandler,
  MessageOptions,
  MessageOptionsNormalized,
  MessageParams,
  MessagePlacement,
  MessageProps,
  MessageSnapshot,
  MessageSnapshotEntry,
  MessageType,
  MessageTypedFn,
  MessageUpdateOptions
} from "./src/message";

export type {
  Message,
  MessageActionContext,
  MessageClickContext,
  MessageClickHandler,
  MessageCloseFilter,
  MessageCloseReason,
  MessageContent,
  MessageFn,
  MessageGlobalConfig,
  MessageHandler,
  MessageLifecycleContext,
  MessageLifecycleHandler,
  MessageOptions,
  MessageOptionsNormalized,
  MessageParams,
  MessagePlacement,
  MessageProps,
  MessageSnapshot,
  MessageSnapshotEntry,
  MessageType,
  MessageTypedFn,
  MessageUpdateOptions
};

export const XyMessage = withInstallFunction(message, "$message");
export const XyMessageService = XyMessage;

export default XyMessage;
