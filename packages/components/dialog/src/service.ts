import { createApp } from "vue";
import { warnOnce } from "@xiaoye/utils";
import DialogServiceContainer from "./dialog-service-container.vue";
import {
  closeAllDialogServiceEntries,
  createDialogServiceHandle,
  enqueueDialogServiceEntry
} from "./service-state";
import type {
  DialogAlertOptions,
  DialogConfirmOptions,
  DialogPromptOptions,
  DialogServiceHandle,
  DialogServiceOpenOptions
} from "./dialog-service";

let serviceHost: HTMLDivElement | null = null;

function ensureDialogServiceMounted() {
  if (typeof document === "undefined") {
    warnOnce("XyDialogService", "XyDialogService 仅支持在浏览器环境中使用。");
    return false;
  }

  if (serviceHost && serviceHost.isConnected) {
    return true;
  }

  serviceHost = document.createElement("div");
  serviceHost.className = "xy-dialog-service-host";
  document.body.appendChild(serviceHost);
  createApp(DialogServiceContainer).mount(serviceHost);
  return true;
}

function createNoopHandle(): DialogServiceHandle {
  const id = `xy-dialog-service-noop-${Date.now()}`;

  return {
    id,
    close() {},
    update() {},
    result: Promise.resolve({
      action: "programmatic"
    })
  };
}

export const XyDialogService = {
  open(options: DialogServiceOpenOptions): DialogServiceHandle {
    if (!ensureDialogServiceMounted()) {
      return createNoopHandle();
    }

    const entry = enqueueDialogServiceEntry("open", options);
    return createDialogServiceHandle(entry.id, entry.result);
  },
  alert(options: DialogAlertOptions) {
    if (!ensureDialogServiceMounted()) {
      return Promise.resolve();
    }

    const entry = enqueueDialogServiceEntry("alert", {
      ...options,
      showCancelButton: false
    });

    return createDialogServiceHandle(entry.id, entry.result).result.then(() => undefined);
  },
  confirm(options: DialogConfirmOptions) {
    if (!ensureDialogServiceMounted()) {
      return Promise.resolve(false);
    }

    const entry = enqueueDialogServiceEntry("confirm", options);

    return createDialogServiceHandle(entry.id, entry.result).result.then(
      (result) => result.action === "confirm"
    );
  },
  prompt(options: DialogPromptOptions) {
    if (!ensureDialogServiceMounted()) {
      return Promise.resolve({
        confirmed: false,
        value: options.inputValue ?? ""
      });
    }

    const entry = enqueueDialogServiceEntry("prompt", options);

    return createDialogServiceHandle(entry.id, entry.result).result.then((result) => ({
      confirmed: result.action === "confirm",
      value: result.value ?? ""
    }));
  },
  closeAll() {
    closeAllDialogServiceEntries();
  }
};
