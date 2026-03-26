import { reactive } from "vue";
import type { VNodeChild } from "vue";
import type { DialogCloseReason } from "./dialog";
import type {
  DialogAlertOptions,
  DialogConfirmOptions,
  DialogPromptOptions,
  DialogServiceAction,
  DialogServiceHandle,
  DialogServiceOpenOptions,
  DialogServiceResult,
  DialogServiceUpdateOptions
} from "./dialog-service";
import type { DialogProps } from "./dialog";
import { mapCloseReasonToServiceAction } from "./dialog-service";

type DialogServiceMode = "open" | "alert" | "confirm" | "prompt";

export interface DialogServiceEntry {
  id: string;
  mode: DialogServiceMode;
  title: string;
  visible: boolean;
  dialogProps?: Partial<DialogProps>;
  message?: string;
  render?: () => VNodeChild;
  component?: DialogServiceOpenOptions["component"];
  componentProps?: Record<string, unknown>;
  footerRender?: DialogServiceOpenOptions["footerRender"];
  showCancelButton: boolean;
  confirmButtonText: string;
  cancelButtonText: string;
  confirmButtonProps?: DialogServiceOpenOptions["confirmButtonProps"];
  cancelButtonProps?: DialogServiceOpenOptions["cancelButtonProps"];
  beforeConfirm?: DialogServiceOpenOptions["beforeConfirm"];
  beforeCancel?: DialogServiceOpenOptions["beforeCancel"];
  pendingAction: DialogServiceAction;
  confirming: boolean;
  cancelling: boolean;
  promptValue: string;
  promptError: string;
  inputPlaceholder: string;
  inputType: "text" | "textarea" | "password";
  inputProps: Record<string, unknown>;
  inputValidator?: DialogPromptOptions["inputValidator"];
  result: Promise<DialogServiceResult>;
  resolveResult: (result: DialogServiceResult) => void;
}

export interface DialogServiceState {
  current: DialogServiceEntry | null;
  queue: DialogServiceEntry[];
}

export const dialogServiceState: DialogServiceState = reactive({
  current: null,
  queue: []
});

let dialogServiceSeed = 0;

function nextDialogServiceId() {
  dialogServiceSeed += 1;
  return `xy-dialog-service-${dialogServiceSeed}`;
}

function createResultPromise() {
  let resolveResult = (_result: DialogServiceResult) => {};
  const result = new Promise<DialogServiceResult>((resolve) => {
    resolveResult = resolve;
  });

  return {
    result,
    resolveResult
  };
}

function normalizeEntry(
  mode: DialogServiceMode,
  options: DialogServiceOpenOptions | DialogAlertOptions | DialogConfirmOptions | DialogPromptOptions
) {
  const { result, resolveResult } = createResultPromise();

  return {
    id: nextDialogServiceId(),
    mode,
    title: options.title ?? "",
    visible: true,
    dialogProps: { ...(options.dialogProps ?? {}) },
    message: options.message,
    render: "render" in options ? options.render : undefined,
    component: "component" in options ? options.component : undefined,
    componentProps: "componentProps" in options ? options.componentProps : undefined,
    footerRender: options.footerRender,
    showCancelButton: options.showCancelButton ?? mode !== "alert",
    confirmButtonText:
      options.confirmButtonText ?? (mode === "alert" ? "知道了" : "确认"),
    cancelButtonText: options.cancelButtonText ?? "取消",
    confirmButtonProps: options.confirmButtonProps,
    cancelButtonProps: options.cancelButtonProps,
    beforeConfirm: options.beforeConfirm,
    beforeCancel: options.beforeCancel,
    pendingAction: "programmatic" as DialogServiceAction,
    confirming: false,
    cancelling: false,
    promptValue: "inputValue" in options ? options.inputValue ?? "" : "",
    promptError: "",
    inputPlaceholder: "inputPlaceholder" in options ? options.inputPlaceholder ?? "" : "",
    inputType: "inputType" in options ? options.inputType ?? "text" : "text",
    inputProps: "inputProps" in options ? options.inputProps ?? {} : {},
    inputValidator: "inputValidator" in options ? options.inputValidator : undefined,
    result,
    resolveResult
  } satisfies DialogServiceEntry;
}

function getEntryById(id: string) {
  if (dialogServiceState.current?.id === id) {
    return dialogServiceState.current;
  }

  return dialogServiceState.queue.find((entry) => entry.id === id) ?? null;
}

function shiftQueue() {
  dialogServiceState.current = dialogServiceState.queue.shift() ?? null;
}

function resolveEntry(entry: DialogServiceEntry, action: DialogServiceAction) {
  entry.resolveResult({
    action,
    value: entry.mode === "prompt" ? entry.promptValue : undefined
  });
}

export function createDialogServiceHandle(
  id: string,
  result: Promise<DialogServiceResult>
): DialogServiceHandle {
  return {
    id,
    close(reason = "programmatic") {
      requestCloseDialogServiceEntry(id, reason);
    },
    update(patch) {
      updateDialogServiceEntry(id, patch);
    },
    result
  };
}

export function enqueueDialogServiceEntry(
  mode: DialogServiceMode,
  options: DialogServiceOpenOptions | DialogAlertOptions | DialogConfirmOptions | DialogPromptOptions
) {
  const entry = normalizeEntry(mode, options);

  if (dialogServiceState.current) {
    dialogServiceState.queue.push(entry);
  } else {
    dialogServiceState.current = entry;
  }

  return entry;
}

export function requestCloseDialogServiceEntry(id: string, action: DialogServiceAction) {
  const entry = getEntryById(id);

  if (!entry) {
    return;
  }

  entry.pendingAction = action;

  if (dialogServiceState.current?.id === id) {
    dialogServiceState.current.visible = false;
    return;
  }

  resolveEntry(entry, action);
  dialogServiceState.queue.splice(
    dialogServiceState.queue.findIndex((item) => item.id === id),
    1
  );
}

export function finishDialogServiceEntry(id: string) {
  const entry = getEntryById(id);

  if (!entry) {
    return;
  }

  resolveEntry(entry, entry.pendingAction);

  if (dialogServiceState.current?.id === id) {
    shiftQueue();
    return;
  }

  const index = dialogServiceState.queue.findIndex((item) => item.id === id);

  if (index !== -1) {
    dialogServiceState.queue.splice(index, 1);
  }
}

export function updateDialogServiceEntry(id: string, patch: DialogServiceUpdateOptions) {
  const entry = getEntryById(id);

  if (!entry) {
    return;
  }

  if ("dialogProps" in patch && patch.dialogProps) {
    entry.dialogProps = {
      ...(entry.dialogProps ?? {}),
      ...patch.dialogProps
    };
  }

  if ("title" in patch && patch.title !== undefined) {
    entry.title = patch.title;
  }

  if ("showCancelButton" in patch && patch.showCancelButton !== undefined) {
    entry.showCancelButton = patch.showCancelButton;
  }

  if ("confirmButtonText" in patch && patch.confirmButtonText !== undefined) {
    entry.confirmButtonText = patch.confirmButtonText;
  }

  if ("cancelButtonText" in patch && patch.cancelButtonText !== undefined) {
    entry.cancelButtonText = patch.cancelButtonText;
  }

  if ("confirmButtonProps" in patch && patch.confirmButtonProps !== undefined) {
    entry.confirmButtonProps = patch.confirmButtonProps;
  }

  if ("cancelButtonProps" in patch && patch.cancelButtonProps !== undefined) {
    entry.cancelButtonProps = patch.cancelButtonProps;
  }

  if ("beforeConfirm" in patch && patch.beforeConfirm !== undefined) {
    entry.beforeConfirm = patch.beforeConfirm;
  }

  if ("beforeCancel" in patch && patch.beforeCancel !== undefined) {
    entry.beforeCancel = patch.beforeCancel;
  }

  if ("footerRender" in patch) {
    entry.footerRender = patch.footerRender;
  }

  if ("message" in patch) {
    entry.message = patch.message;
    entry.render = undefined;
    entry.component = undefined;
    entry.componentProps = undefined;
  } else if ("render" in patch) {
    entry.render = patch.render;
    entry.message = undefined;
    entry.component = undefined;
    entry.componentProps = undefined;
  } else if ("component" in patch) {
    entry.component = patch.component;
    entry.componentProps = patch.componentProps ?? entry.componentProps;
    entry.message = undefined;
    entry.render = undefined;
  } else if ("componentProps" in patch && patch.componentProps !== undefined) {
    entry.componentProps = patch.componentProps;
  }

  if ("inputValue" in patch && patch.inputValue !== undefined) {
    entry.promptValue = patch.inputValue;
    entry.promptError = "";
  }

  if ("inputPlaceholder" in patch && patch.inputPlaceholder !== undefined) {
    entry.inputPlaceholder = patch.inputPlaceholder;
  }

  if ("inputType" in patch && patch.inputType !== undefined) {
    entry.inputType = patch.inputType;
  }

  if ("inputProps" in patch && patch.inputProps !== undefined) {
    entry.inputProps = patch.inputProps;
  }
}

export function closeAllDialogServiceEntries() {
  if (dialogServiceState.current) {
    resolveEntry(dialogServiceState.current, "programmatic");
  }

  dialogServiceState.queue.forEach((entry) => {
    resolveEntry(entry, "programmatic");
  });

  dialogServiceState.current = null;
  dialogServiceState.queue.splice(0, dialogServiceState.queue.length);
}

export function setDialogServiceEntryPendingAction(
  entry: DialogServiceEntry,
  reason: DialogCloseReason | DialogServiceAction
) {
  if (reason === "confirm" || reason === "cancel" || reason === "programmatic") {
    entry.pendingAction = reason;
    return;
  }

  entry.pendingAction = mapCloseReasonToServiceAction(reason as DialogCloseReason);
}
