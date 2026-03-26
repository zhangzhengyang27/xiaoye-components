import { createApp, type App } from "vue";
import { warnOnce } from "@xiaoye/utils";
import type { AlertServiceHandle, AlertServiceOptions } from "./alert";
import AlertServiceContainer from "./alert-service-container.vue";
import {
  clearAlertServiceEntries,
  createAlertServiceHandle,
  getAlertServiceSnapshot,
  isAlertServiceIdle,
  setAlertServiceCurrentChangeHandler,
  setAlertServiceIdleHandler,
  upsertAlertServiceEntry
} from "./service-state";

let serviceHost: HTMLDivElement | null = null;
let serviceApp: App<Element> | null = null;

function resolveAlertServiceContainer(appendTo: AlertServiceOptions["appendTo"]) {
  if (typeof document === "undefined") {
    return null;
  }

  if (!appendTo) {
    return document.body;
  }

  if (typeof appendTo !== "string") {
    return appendTo;
  }

  try {
    const target = document.querySelector<HTMLElement>(appendTo);

    if (target) {
      return target;
    }
  } catch {
    warnOnce(
      "XyAlertService",
      `XyAlertService appendTo 选择器无效：${appendTo}，已回退到 document.body。`
    );
    return document.body;
  }

  warnOnce(
    "XyAlertService",
    `XyAlertService 未找到 appendTo 对应节点：${appendTo}，已回退到 document.body。`
  );
  return document.body;
}

function syncAlertServiceHostTarget(appendTo: AlertServiceOptions["appendTo"]) {
  if (!serviceHost || typeof document === "undefined") {
    return;
  }

  const target = resolveAlertServiceContainer(appendTo) ?? document.body;

  if (serviceHost.parentElement === target) {
    return;
  }

  target.appendChild(serviceHost);
}

function teardownAlertService() {
  serviceApp?.unmount();
  serviceApp = null;

  if (serviceHost?.isConnected) {
    serviceHost.remove();
  }

  serviceHost = null;
}

function scheduleAlertServiceTeardown() {
  const teardown = () => {
    if (isAlertServiceIdle()) {
      teardownAlertService();
    }
  };

  if (typeof queueMicrotask === "function") {
    queueMicrotask(teardown);
    return;
  }

  void Promise.resolve().then(teardown);
}

setAlertServiceIdleHandler(scheduleAlertServiceTeardown);
setAlertServiceCurrentChangeHandler((entry) => {
  syncAlertServiceHostTarget(entry?.appendTo);
});

function ensureAlertServiceMounted() {
  if (typeof document === "undefined") {
    warnOnce("XyAlertService", "XyAlertService 仅支持在浏览器环境中使用。");
    return false;
  }

  if (serviceHost && serviceHost.isConnected && serviceApp) {
    return true;
  }

  teardownAlertService();
  serviceHost = document.createElement("div");
  serviceHost.className = "xy-alert-service-host";
  document.body.appendChild(serviceHost);
  serviceApp = createApp(AlertServiceContainer);
  serviceApp.mount(serviceHost);

  return true;
}

function createNoopHandle(): AlertServiceHandle {
  const id = `xy-alert-service-noop-${Date.now()}`;

  return {
    id,
    close() {},
    update() {}
  };
}

export const XyAlertService = {
  open(options: AlertServiceOptions): AlertServiceHandle {
    if (!ensureAlertServiceMounted()) {
      return createNoopHandle();
    }

    const entry = upsertAlertServiceEntry(options);
    return createAlertServiceHandle(entry.id);
  },
  getState() {
    return getAlertServiceSnapshot();
  },
  closeAll() {
    clearAlertServiceEntries();
  }
};
