import type { Component, VNodeChild } from "vue";
import type { ButtonProps } from "../../button/src/button";
import type { DialogCloseReason, DialogProps } from "./dialog";

export type DialogServiceAction =
  | "confirm"
  | "cancel"
  | "close"
  | "backdrop"
  | "escape"
  | "programmatic";

export interface DialogServiceResult {
  action: DialogServiceAction;
  value?: string;
}

export interface DialogServiceActionContext {
  id: string;
  action: DialogServiceAction;
  value?: string;
  close: (reason?: DialogServiceAction) => void;
}

export interface DialogServiceFooterContext extends DialogServiceActionContext {
  confirm: () => Promise<void>;
  cancel: () => Promise<void>;
  confirming: boolean;
  cancelling: boolean;
  promptError: string;
  setPromptValue: (value: string) => void;
}

export type DialogPromptValidator = (
  value: string
) => string | void | Promise<string | void>;

interface DialogServiceOpenOptionsBase {
  title?: string;
  dialogProps?: Partial<DialogProps>;
  footerRender?: (ctx: DialogServiceFooterContext) => VNodeChild;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonProps?: Partial<ButtonProps>;
  cancelButtonProps?: Partial<ButtonProps>;
  beforeConfirm?: (ctx: DialogServiceActionContext) => void | Promise<void>;
  beforeCancel?: (ctx: DialogServiceActionContext) => void | Promise<void>;
}

export interface DialogServiceOpenOptions extends DialogServiceOpenOptionsBase {
  message?: string;
  render?: () => VNodeChild;
  component?: Component;
  componentProps?: Record<string, unknown>;
}

export type DialogAlertOptions = DialogServiceOpenOptions;

export type DialogConfirmOptions = DialogServiceOpenOptions;

export interface DialogPromptOptions extends DialogServiceOpenOptionsBase {
  message?: string;
  inputValue?: string;
  inputPlaceholder?: string;
  inputType?: "text" | "textarea" | "password";
  inputProps?: Record<string, unknown>;
  inputValidator?: DialogPromptValidator;
}

export type DialogServiceUpdateOptions = Partial<DialogServiceOpenOptions> &
  Partial<Pick<DialogPromptOptions, "inputValue" | "inputPlaceholder" | "inputType" | "inputProps">>;

export interface DialogServiceHandle {
  id: string;
  close: (reason?: DialogServiceAction) => void;
  update: (patch: DialogServiceUpdateOptions) => void;
  result: Promise<DialogServiceResult>;
}

export function mapCloseReasonToServiceAction(reason: DialogCloseReason): DialogServiceAction {
  if (reason === "backdrop") {
    return "backdrop";
  }

  if (reason === "escape") {
    return "escape";
  }

  if (reason === "programmatic") {
    return "programmatic";
  }

  return "close";
}
