import { ref } from "vue";
import type { AppContext, ComponentPublicInstance } from "vue";
import {
  DEFAULT_NAMESPACE,
  configProviderKey,
  getGlobalLoadingConfig
} from "../../config-provider/src/context";
import { warnOnce } from "@xiaoye/utils";
import { createLoadingComponent } from "./loading";
import type { LoadingInstance } from "./loading";
import {
  DEFAULT_LOADING_SVG_VIEW_BOX,
  type LoadingGlobalConfig,
  type LoadingOptions,
  type LoadingOptionsResolved,
  type LoadingParentElement,
  type LoadingText,
  type LoadingUpdatableOptions
} from "./types";

const LOADING_COUNT_ATTR = "data-xy-loading-count";
const LOADING_RELATIVE_COUNT_ATTR = "data-xy-loading-relative-count";
const LOADING_HIDDEN_COUNT_ATTR = "data-xy-loading-hidden-count";
const LOADING_BUSY_COUNT_ATTR = "data-xy-loading-busy-count";
const DEFAULT_Z_INDEX = 2000;

let fullscreenInstance: LoadingInstance | null = null;
let zIndexSeed = 0;

interface ConfigProviderContextLike {
  namespace?: {
    value?: string;
  };
  zIndex?: {
    value?: number;
  };
  loading?: {
    value?: LoadingGlobalConfig;
  };
}

interface LoadingController {
  appContext: AppContext | null;
  currentOptions: LoadingOptionsResolved;
  followerCleanup: (() => void) | null;
  isMounted: boolean;
  isService: boolean;
  isVisible: boolean;
  isClosing: boolean;
  namespace: string;
  pendingCloseTimer: ReturnType<typeof globalThis.setTimeout> | null;
  pendingShowTimer: ReturnType<typeof globalThis.setTimeout> | null;
  rawClose: () => void;
  rawSetText: (text: LoadingText) => void;
  rawUpdate: (patch: LoadingUpdatableOptions) => void;
  shownAt: number | null;
  instance: LoadingInstance;
}

const serviceControllers = new Set<LoadingController>();
const serviceGroupControllers = new Map<string, LoadingController>();

function isClient() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function hasOwn(source: object, key: PropertyKey) {
  return Object.prototype.hasOwnProperty.call(source, key);
}

function toPositiveInteger(value: string | null) {
  return value ? Number.parseInt(value, 10) || 0 : 0;
}

function clampDelay(value: unknown, fallback = 0) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return fallback;
  }

  return Math.max(0, value);
}

function getCount(target: HTMLElement, name: string) {
  return toPositiveInteger(target.getAttribute(name));
}

function setCount(target: HTMLElement, name: string, value: number) {
  if (value > 0) {
    target.setAttribute(name, String(value));
    return;
  }

  target.removeAttribute(name);
}

function incrementCount(target: HTMLElement, name: string) {
  setCount(target, name, getCount(target, name) + 1);
}

function decrementCount(target: HTMLElement, name: string) {
  setCount(target, name, Math.max(0, getCount(target, name) - 1));
}

function updateBusyState(target: HTMLElement, delta: number) {
  const nextCount = Math.max(0, getCount(target, LOADING_BUSY_COUNT_ATTR) + delta);
  setCount(target, LOADING_BUSY_COUNT_ATTR, nextCount);

  if (nextCount > 0) {
    target.setAttribute("aria-busy", "true");
    return;
  }

  target.removeAttribute("aria-busy");
}

function resolveTarget(target: LoadingOptions["target"]) {
  if (!isClient()) {
    return null;
  }

  if (!target) {
    return document.body;
  }

  if (typeof target !== "string") {
    return target;
  }

  try {
    return document.querySelector<HTMLElement>(target) ?? document.body;
  } catch {
    warnOnce(
      "XyLoadingService",
      `XyLoadingService target 选择器无效：${target}，已回退到 document.body。`
    );
    return document.body;
  }
}

function getProvidedConfig(context: AppContext | null) {
  return context?.provides?.[configProviderKey as symbol] as ConfigProviderContextLike | undefined;
}

function resolveNamespace(context: AppContext | null) {
  return getProvidedConfig(context)?.namespace?.value ?? DEFAULT_NAMESPACE;
}

function resolveBaseZIndex(context: AppContext | null) {
  return getProvidedConfig(context)?.zIndex?.value ?? DEFAULT_Z_INDEX;
}

function resolveGlobalLoadingConfig(context: AppContext | null) {
  return getProvidedConfig(context)?.loading?.value ?? getGlobalLoadingConfig().value ?? {};
}

function nextZIndex(baseZIndex: number) {
  zIndexSeed += 1;
  return baseZIndex + zIndexSeed;
}

function resolveOptionValue<T>(
  options: LoadingOptions,
  key: keyof LoadingOptions,
  globalValue: T | undefined,
  fallback: T
) {
  if (hasOwn(options, key)) {
    return options[key] as T;
  }

  return globalValue ?? fallback;
}

function resolveLoadingOptions(
  options: LoadingOptions,
  context: AppContext | null
): LoadingOptionsResolved {
  const globalConfig = resolveGlobalLoadingConfig(context);
  const target = resolveTarget(options.target) ?? document.body;
  const fullscreen =
    target === document.body &&
    resolveOptionValue(options, "fullscreen", globalConfig.fullscreen, true);

  return {
    parent: (target === document.body || options.body
      ? document.body
      : target) as LoadingParentElement,
    background: resolveOptionValue(options, "background", globalConfig.background, ""),
    svg: resolveOptionValue(options, "svg", globalConfig.svg, ""),
    svgViewBox: resolveOptionValue(
      options,
      "svgViewBox",
      globalConfig.svgViewBox,
      DEFAULT_LOADING_SVG_VIEW_BOX
    ),
    spinner: resolveOptionValue(options, "spinner", globalConfig.spinner, ""),
    text: resolveOptionValue(options, "text", globalConfig.text, ""),
    fullscreen,
    lock: resolveOptionValue(options, "lock", globalConfig.lock, false),
    customClass: resolveOptionValue(options, "customClass", undefined, ""),
    visible: resolveOptionValue(options, "visible", undefined, true),
    target,
    delay: clampDelay(resolveOptionValue(options, "delay", globalConfig.delay, 0)),
    minDuration: clampDelay(
      resolveOptionValue(options, "minDuration", globalConfig.minDuration, 0)
    ),
    groupKey: hasOwn(options, "groupKey") ? options.groupKey : undefined,
    beforeClose: options.beforeClose,
    closed: options.closed
  };
}

function applyBodyRect(controller: LoadingController) {
  if (controller.currentOptions.fullscreen || controller.currentOptions.parent !== document.body) {
    return;
  }

  const rect = controller.currentOptions.target.getBoundingClientRect();
  controller.instance.$el.style.top = `${rect.top + window.scrollY}px`;
  controller.instance.$el.style.left = `${rect.left + window.scrollX}px`;
  controller.instance.$el.style.width = `${rect.width}px`;
  controller.instance.$el.style.height = `${rect.height}px`;
}

function initializePosition(controller: LoadingController) {
  if (controller.currentOptions.fullscreen) {
    controller.instance.originalPosition.value = window.getComputedStyle(document.body).position;
    controller.instance.originalOverflow.value = window.getComputedStyle(document.body).overflow;
    return;
  }

  if (controller.currentOptions.parent === document.body) {
    controller.instance.originalPosition.value = window.getComputedStyle(document.body).position;
    applyBodyRect(controller);
    return;
  }

  controller.instance.originalPosition.value = window.getComputedStyle(
    controller.currentOptions.parent
  ).position;
}

function startBodyFollow(controller: LoadingController) {
  if (controller.currentOptions.fullscreen || controller.currentOptions.parent !== document.body) {
    return null;
  }

  let frameId = 0;
  const requestSync = () => {
    if (frameId) {
      return;
    }

    frameId = window.requestAnimationFrame(() => {
      frameId = 0;
      applyBodyRect(controller);
    });
  };

  const resizeObserver =
    typeof ResizeObserver === "function" ? new ResizeObserver(() => requestSync()) : null;

  window.addEventListener("scroll", requestSync, true);
  window.addEventListener("resize", requestSync);
  resizeObserver?.observe(controller.currentOptions.target);
  requestSync();

  return () => {
    if (frameId) {
      window.cancelAnimationFrame(frameId);
    }

    window.removeEventListener("scroll", requestSync, true);
    window.removeEventListener("resize", requestSync);
    resizeObserver?.disconnect();
  };
}

function addParentClassList(controller: LoadingController) {
  const parent = controller.currentOptions.parent;
  const relativeClass = `${controller.namespace}-loading-parent--relative`;
  const hiddenClass = `${controller.namespace}-loading-parent--hidden`;
  const originalPosition = controller.instance.originalPosition.value;

  if (!["absolute", "fixed", "sticky", "relative"].includes(originalPosition)) {
    parent.classList.add(relativeClass);
    incrementCount(parent, LOADING_RELATIVE_COUNT_ATTR);
  }

  if (controller.currentOptions.fullscreen && controller.currentOptions.lock) {
    parent.classList.add(hiddenClass);
    incrementCount(parent, LOADING_HIDDEN_COUNT_ATTR);
  }

  incrementCount(parent, LOADING_COUNT_ATTR);
}

function removeParentClassList(controller: LoadingController) {
  const parent = controller.currentOptions.parent;
  const relativeClass = `${controller.namespace}-loading-parent--relative`;
  const hiddenClass = `${controller.namespace}-loading-parent--hidden`;

  decrementCount(parent, LOADING_COUNT_ATTR);

  if (
    !["absolute", "fixed", "sticky", "relative"].includes(
      controller.instance.originalPosition.value
    )
  ) {
    decrementCount(parent, LOADING_RELATIVE_COUNT_ATTR);

    if (getCount(parent, LOADING_RELATIVE_COUNT_ATTR) === 0) {
      parent.classList.remove(relativeClass);
    }
  }

  if (controller.currentOptions.fullscreen && controller.currentOptions.lock) {
    decrementCount(parent, LOADING_HIDDEN_COUNT_ATTR);

    if (getCount(parent, LOADING_HIDDEN_COUNT_ATTR) === 0) {
      parent.classList.remove(hiddenClass);
    }
  }
}

function detachServiceController(controller: LoadingController) {
  serviceControllers.delete(controller);

  if (controller.currentOptions.groupKey) {
    const activeController = serviceGroupControllers.get(controller.currentOptions.groupKey);

    if (activeController === controller) {
      serviceGroupControllers.delete(controller.currentOptions.groupKey);
    }
  }

  if (fullscreenInstance === controller.instance) {
    fullscreenInstance = null;
  }
}

function finalizeController(controller: LoadingController) {
  if (controller.pendingShowTimer !== null) {
    globalThis.clearTimeout(controller.pendingShowTimer);
    controller.pendingShowTimer = null;
  }

  if (controller.pendingCloseTimer !== null) {
    globalThis.clearTimeout(controller.pendingCloseTimer);
    controller.pendingCloseTimer = null;
  }

  controller.followerCleanup?.();
  controller.followerCleanup = null;

  if (controller.isMounted) {
    removeParentClassList(controller);
    updateBusyState(controller.currentOptions.target, -1);
    controller.isMounted = false;
  }

  controller.isVisible = false;
  controller.isClosing = false;
  controller.shownAt = null;
  detachServiceController(controller);
  controller.currentOptions.closed?.();
}

function mountController(controller: LoadingController) {
  if (controller.isMounted || controller.isClosing) {
    return;
  }

  initializePosition(controller);
  addParentClassList(controller);
  controller.currentOptions.parent.appendChild(controller.instance.$el);
  updateBusyState(controller.currentOptions.target, 1);
  controller.followerCleanup = startBodyFollow(controller);
  controller.isMounted = true;
}

function showController(controller: LoadingController) {
  if (controller.isClosing) {
    return;
  }

  mountController(controller);
  controller.instance.visible.value = true;
  controller.isVisible = true;
  controller.shownAt = Date.now();
}

function scheduleShow(controller: LoadingController) {
  if (!controller.currentOptions.visible || controller.isClosing) {
    return;
  }

  if (controller.pendingShowTimer !== null) {
    globalThis.clearTimeout(controller.pendingShowTimer);
    controller.pendingShowTimer = null;
  }

  if (controller.currentOptions.delay > 0) {
    controller.pendingShowTimer = globalThis.setTimeout(() => {
      controller.pendingShowTimer = null;
      showController(controller);
    }, controller.currentOptions.delay);
    return;
  }

  showController(controller);
}

function scheduleClose(controller: LoadingController) {
  if (controller.isClosing) {
    return;
  }

  controller.isClosing = true;
  detachServiceController(controller);

  if (controller.pendingShowTimer !== null) {
    globalThis.clearTimeout(controller.pendingShowTimer);
    controller.pendingShowTimer = null;
  }

  const elapsed = controller.shownAt == null ? 0 : Date.now() - controller.shownAt;
  const remainingDuration = Math.max(0, controller.currentOptions.minDuration - elapsed);

  const executeClose = () => {
    controller.pendingCloseTimer = null;
    controller.rawClose();
  };

  if (remainingDuration > 0) {
    controller.pendingCloseTimer = globalThis.setTimeout(executeClose, remainingDuration);
    return;
  }

  executeClose();
}

function updateController(controller: LoadingController, patch: LoadingUpdatableOptions) {
  if (controller.isClosing) {
    return;
  }

  const visualPatch: LoadingUpdatableOptions = {};

  if (hasOwn(patch, "background")) {
    controller.currentOptions.background = patch.background ?? "";
    visualPatch.background = controller.currentOptions.background;
  }

  if (hasOwn(patch, "svg")) {
    controller.currentOptions.svg = patch.svg ?? "";
    visualPatch.svg = controller.currentOptions.svg;
  }

  if (hasOwn(patch, "svgViewBox")) {
    controller.currentOptions.svgViewBox = patch.svgViewBox ?? DEFAULT_LOADING_SVG_VIEW_BOX;
    visualPatch.svgViewBox = controller.currentOptions.svgViewBox;
  }

  if (hasOwn(patch, "spinner")) {
    controller.currentOptions.spinner = patch.spinner ?? "";
    visualPatch.spinner = controller.currentOptions.spinner;
  }

  if (hasOwn(patch, "text")) {
    controller.currentOptions.text = patch.text ?? "";
    controller.rawSetText(controller.currentOptions.text);
  }

  if (hasOwn(patch, "customClass")) {
    controller.currentOptions.customClass = patch.customClass ?? "";
    visualPatch.customClass = controller.currentOptions.customClass;
  }

  if (hasOwn(patch, "beforeClose")) {
    controller.currentOptions.beforeClose = patch.beforeClose;
  }

  if (hasOwn(patch, "closed")) {
    controller.currentOptions.closed = patch.closed;
  }

  if (hasOwn(patch, "delay")) {
    controller.currentOptions.delay = clampDelay(patch.delay, 0);
  }

  if (hasOwn(patch, "minDuration")) {
    controller.currentOptions.minDuration = clampDelay(patch.minDuration, 0);
  }

  if (hasOwn(patch, "visible")) {
    controller.currentOptions.visible = Boolean(patch.visible);
  }

  controller.rawUpdate(visualPatch);

  if (!controller.isMounted && controller.currentOptions.visible) {
    scheduleShow(controller);
    return;
  }

  if (controller.currentOptions.parent === document.body && controller.isMounted) {
    applyBodyRect(controller);
  }

  if (hasOwn(patch, "visible") && patch.visible === false) {
    controller.instance.close();
  }
}

function createNoopHandle(): LoadingInstance {
  return {
    background: ref(""),
    svg: ref(""),
    svgViewBox: ref(DEFAULT_LOADING_SVG_VIEW_BOX),
    spinner: ref(""),
    text: ref(""),
    fullscreen: ref(false),
    lock: ref(false),
    customClass: ref(""),
    visible: ref(false),
    originalPosition: ref(""),
    originalOverflow: ref(""),
    zIndex: ref(0),
    setText() {},
    update() {},
    removeLoadingChild() {},
    close() {},
    handleAfterLeave() {},
    vm: {} as ComponentPublicInstance,
    $el: {} as never
  };
}

function openLoading(
  options: LoadingOptions = {},
  context?: AppContext | null,
  trackAsService = true
) {
  if (!isClient()) {
    warnOnce("XyLoadingService", "XyLoadingService 仅支持在浏览器环境中使用。");
    return createNoopHandle();
  }

  const appContext = context ?? XyLoadingService._context;
  const namespace = resolveNamespace(appContext);
  const baseZIndex = resolveBaseZIndex(appContext);
  const resolved = resolveLoadingOptions(options, appContext);

  if (trackAsService && resolved.groupKey) {
    const existing = serviceGroupControllers.get(resolved.groupKey);

    if (existing) {
      const patch: LoadingUpdatableOptions = {};

      if (hasOwn(options, "text")) {
        patch.text = options.text;
      }

      if (hasOwn(options, "background")) {
        patch.background = options.background;
      }

      if (hasOwn(options, "spinner")) {
        patch.spinner = options.spinner;
      }

      if (hasOwn(options, "svg")) {
        patch.svg = options.svg;
      }

      if (hasOwn(options, "svgViewBox")) {
        patch.svgViewBox = options.svgViewBox;
      }

      if (hasOwn(options, "customClass")) {
        patch.customClass = options.customClass;
      }

      if (hasOwn(options, "delay")) {
        patch.delay = options.delay;
      }

      if (hasOwn(options, "minDuration")) {
        patch.minDuration = options.minDuration;
      }

      if (hasOwn(options, "beforeClose")) {
        patch.beforeClose = options.beforeClose;
      }

      if (hasOwn(options, "closed")) {
        patch.closed = options.closed;
      }

      updateController(existing, patch);
      return existing.instance;
    }
  }

  if (trackAsService && !resolved.groupKey && resolved.fullscreen && fullscreenInstance) {
    return fullscreenInstance;
  }

  const controller = {} as LoadingController;

  const instance = createLoadingComponent(
    {
      ...resolved,
      beforeClose: undefined,
      closed: () => finalizeController(controller)
    },
    appContext ?? null,
    nextZIndex(baseZIndex)
  );

  Object.assign(controller, {
    appContext: appContext ?? null,
    currentOptions: resolved,
    followerCleanup: null,
    isMounted: false,
    isService: trackAsService,
    isVisible: false,
    isClosing: false,
    namespace,
    pendingCloseTimer: null,
    pendingShowTimer: null,
    rawClose: instance.close.bind(instance),
    rawSetText: instance.setText.bind(instance),
    rawUpdate: instance.update.bind(instance),
    shownAt: null,
    instance
  });

  instance.setText = (text: LoadingText) => {
    controller.currentOptions.text = text;
    controller.rawSetText(text);
  };
  instance.update = (patch: LoadingUpdatableOptions) => {
    updateController(controller, patch);
  };
  instance.close = () => {
    if (controller.isClosing) {
      return;
    }

    if (controller.currentOptions.beforeClose?.() === false) {
      return;
    }

    scheduleClose(controller);
  };

  if (trackAsService) {
    serviceControllers.add(controller);

    if (resolved.groupKey) {
      serviceGroupControllers.set(resolved.groupKey, controller);
    }

    if (!resolved.groupKey && resolved.fullscreen) {
      fullscreenInstance = instance;
    }
  }

  scheduleShow(controller);
  return instance;
}

export function createDirectiveLoading(options: LoadingOptions = {}, context?: AppContext | null) {
  return openLoading(options, context, false);
}

export interface LoadingService {
  (options?: LoadingOptions, context?: AppContext | null): LoadingInstance;
  closeAll: () => void;
  with: <T>(
    task: Promise<T> | (() => T | Promise<T>),
    options?: LoadingOptions,
    context?: AppContext | null
  ) => Promise<T>;
  _context: AppContext | null;
}

export const XyLoadingService = ((options: LoadingOptions = {}, context?: AppContext | null) => {
  return openLoading(options, context, true);
}) as LoadingService;

XyLoadingService.closeAll = () => {
  Array.from(serviceControllers).forEach((controller) => {
    controller.instance.close();
  });
};

XyLoadingService.with = async <T>(
  task: Promise<T> | (() => T | Promise<T>),
  options?: LoadingOptions,
  context?: AppContext | null
) => {
  const instance = XyLoadingService(options, context);

  try {
    return await (typeof task === "function" ? task() : task);
  } finally {
    instance.close();
  }
};

XyLoadingService._context = null;
