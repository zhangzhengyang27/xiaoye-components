import { createVNode, isVNode, nextTick, render } from "vue";
import type { AppContext, ComponentInternalInstance, VNode } from "vue";
import { warnOnce } from "@xiaoye/utils";
import {
  configProviderKey,
  getGlobalNotificationConfig,
  getGlobalNotificationConfigCount
} from "../../config-provider/src/context";
import NotificationComponent from "./notification.vue";
import {
  NOTIFICATION_DEFAULT_DURATION,
  NOTIFICATION_DEFAULT_POSITION,
  NOTIFICATION_DEFAULT_Z_INDEX,
  NOTIFICATION_GAP,
  notificationCloseReasons,
  notificationPositions,
  notificationServiceDefaults,
  notificationTypes,
  notificationOverflowStrategies,
  type NotificationCloseFilter,
  type NotificationCloseReason,
  type NotificationContent,
  type NotificationGlobalConfig,
  type NotificationHandler,
  type NotificationParams,
  type NotificationParamsTyped,
  type NotificationPosition,
  type NotificationProps,
  type NotificationService,
  type NotificationServiceCloseReason,
  type NotificationServiceOptions,
  type NotificationServiceOptionsNormalized,
  type NotificationSnapshot,
  type NotificationSnapshotEntry,
  type NotificationType,
  type NotificationUpdateOptions
} from "./notification";

type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

type NotificationEmits = {
  onClick?: (event: MouseEvent) => void;
  onClose?: (reason: NotificationCloseReason) => void;
  onClosed?: (reason: NotificationCloseReason) => void;
};

type NotificationRuntimeProps = Mutable<NotificationProps & NotificationEmits>;

type NotificationExposed = {
  close: (reason?: NotificationCloseReason) => void;
  visible: {
    value: boolean;
  };
};

type ProviderLikeConfig = {
  notification?: {
    value?: NotificationGlobalConfig;
  };
};

interface NotificationContext {
  id: string;
  host: HTMLDivElement;
  vnode: VNode;
  vm: ComponentInternalInstance & {
    exposed: NotificationExposed | null;
    props: NotificationRuntimeProps;
  };
  props: NotificationRuntimeProps;
  handler: NotificationHandler;
  bucketKey: string;
  position: NotificationPosition;
  targetKey: string;
  groupKey?: string;
  baseOffset: number;
  currentOffset: number;
  max: number | null;
  overflowStrategy: NotificationServiceOptionsNormalized["overflowStrategy"];
  closeReason: NotificationServiceCloseReason;
  onClosed?: NotificationServiceOptionsNormalized["onClosed"];
  onClick?: NotificationServiceOptionsNormalized["onClick"];
  status: "active" | "closing" | "closed";
}

interface NotificationBucket {
  key: string;
  targetKey: string;
  target: HTMLElement;
  position: NotificationPosition;
  instances: NotificationContext[];
}

const notificationBuckets = new Map<string, NotificationBucket>();
const targetKeyMap = new WeakMap<HTMLElement, string>();
const hasOwn = (target: object, key: PropertyKey) =>
  Object.prototype.hasOwnProperty.call(target, key);

let notificationSeed = 0;
let targetSeed = 0;
let zIndexSeed = 0;

function nextNotificationId() {
  notificationSeed += 1;
  return `xy-notification-${notificationSeed}`;
}

function createNoopHandler(id = `xy-notification-noop-${Date.now()}`): NotificationHandler {
  return {
    id,
    close() {},
    update() {}
  };
}

function isNotificationPrimitive(value: NotificationParams | undefined) {
  return (
    value === undefined ||
    typeof value === "string" ||
    typeof value === "function" ||
    isVNode(value)
  );
}

function toNotificationOptions(
  options?: NotificationParams | NotificationParamsTyped,
  type?: NotificationType
): NotificationServiceOptions {
  const resolved = isNotificationPrimitive(options)
    ? { message: options as NotificationContent }
    : { ...((options ?? {}) as NotificationServiceOptions) };

  if (type) {
    resolved.type = type;
  }

  return resolved;
}

function resolveTargetKey(target: HTMLElement) {
  const cached = targetKeyMap.get(target);

  if (cached) {
    return cached;
  }

  targetSeed += 1;
  const nextKey = `xy-notification-target-${targetSeed}`;
  targetKeyMap.set(target, nextKey);
  return nextKey;
}

function normalizeAppendTo(
  appendTo: NotificationServiceOptions["appendTo"],
  scope = "XyNotification"
) {
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
    warnOnce(scope, `appendTo 选择器无效：${appendTo}，已回退到 document.body。`);
    return document.body;
  }

  warnOnce(scope, `未找到 appendTo 对应节点：${appendTo}，已回退到 document.body。`);
  return document.body;
}

function normalizePosition(position: NotificationServiceOptions["position"]) {
  if (!position) {
    return NOTIFICATION_DEFAULT_POSITION;
  }

  if (!notificationPositions.includes(position)) {
    warnOnce(
      "XyNotification",
      `无效的 position：${position}，已回退到 ${NOTIFICATION_DEFAULT_POSITION}。`
    );
    return NOTIFICATION_DEFAULT_POSITION;
  }

  return position;
}

function normalizeOverflowStrategy(strategy: NotificationServiceOptions["overflowStrategy"]) {
  if (!strategy) {
    return notificationServiceDefaults.overflowStrategy;
  }

  if (!notificationOverflowStrategies.includes(strategy)) {
    warnOnce(
      "XyNotification",
      `无效的 overflowStrategy：${strategy}，已回退到 ${notificationServiceDefaults.overflowStrategy}。`
    );
    return notificationServiceDefaults.overflowStrategy;
  }

  return strategy;
}

function normalizeOffset(offset: NotificationServiceOptions["offset"]) {
  if (offset === undefined || !Number.isFinite(offset)) {
    return notificationServiceDefaults.offset;
  }

  return Math.max(0, Math.trunc(offset));
}

function normalizeMax(max: NotificationServiceOptions["max"] | null | undefined) {
  if (max === undefined || max === null) {
    return null;
  }

  if (!Number.isFinite(max)) {
    return null;
  }

  return Math.max(0, Math.trunc(max));
}

function normalizeDuration(duration: NotificationServiceOptions["duration"]) {
  if (duration === undefined || !Number.isFinite(duration)) {
    return NOTIFICATION_DEFAULT_DURATION;
  }

  return Math.max(0, Math.trunc(duration));
}

function nextNotificationZIndex() {
  zIndexSeed += 1;
  return NOTIFICATION_DEFAULT_Z_INDEX + zIndexSeed;
}

function resolveNotificationConfig(context?: AppContext | null) {
  if (context) {
    const providedConfig = context.provides?.[configProviderKey as symbol] as
      | ProviderLikeConfig
      | undefined;
    const scopedNotificationConfig = providedConfig?.notification?.value;

    if (scopedNotificationConfig !== undefined) {
      return scopedNotificationConfig;
    }
  }

  const globalNotificationConfigCount = getGlobalNotificationConfigCount();

  if (globalNotificationConfigCount <= 1) {
    return getGlobalNotificationConfig().value ?? {};
  }

  warnOnce(
    "XyNotification",
    "检测到多个 ConfigProvider.notification 同时存在。请改用 $notify、XyNotificationService.withContext(appContext) 或 XyNotificationService(options, appContext) 来显式指定上下文。当前调用已回退到默认配置。"
  );

  return {};
}

function normalizeOptions(
  params?: NotificationParams,
  context?: AppContext | null
): NotificationServiceOptionsNormalized | null {
  if (typeof document === "undefined") {
    return null;
  }

  const options: NotificationServiceOptions = isNotificationPrimitive(params)
    ? { message: params as NotificationContent }
    : ((params ?? {}) as NotificationServiceOptions);
  const globalNotificationConfig = resolveNotificationConfig(context);
  const appendTo = normalizeAppendTo(
    hasOwn(options, "appendTo") ? options.appendTo : globalNotificationConfig.appendTo
  );

  if (!appendTo) {
    return null;
  }

  const position = normalizePosition(
    hasOwn(options, "position") ? options.position : globalNotificationConfig.position
  );
  const normalized: NotificationServiceOptionsNormalized = {
    ...notificationServiceDefaults,
    ...options,
    appendTo,
    targetKey: resolveTargetKey(appendTo),
    position,
    offset: normalizeOffset(
      hasOwn(options, "offset") ? options.offset : globalNotificationConfig.offset
    ),
    duration: normalizeDuration(
      hasOwn(options, "duration") ? options.duration : globalNotificationConfig.duration
    ),
    showClose:
      hasOwn(options, "showClose") && options.showClose !== undefined
        ? options.showClose
        : (globalNotificationConfig.showClose ?? notificationServiceDefaults.showClose),
    zIndex:
      hasOwn(options, "zIndex") && options.zIndex !== undefined
        ? options.zIndex
        : globalNotificationConfig.zIndex,
    max: normalizeMax(hasOwn(options, "max") ? options.max : globalNotificationConfig.max),
    overflowStrategy: normalizeOverflowStrategy(
      hasOwn(options, "overflowStrategy")
        ? options.overflowStrategy
        : globalNotificationConfig.overflowStrategy
    ),
    dangerouslyUseHTMLString:
      hasOwn(options, "dangerouslyUseHTMLString") && options.dangerouslyUseHTMLString !== undefined
        ? options.dangerouslyUseHTMLString
        : (globalNotificationConfig.dangerouslyUseHTMLString ??
          notificationServiceDefaults.dangerouslyUseHTMLString),
    title: options.title ?? notificationServiceDefaults.title,
    message: options.message ?? notificationServiceDefaults.message,
    type: options.type ?? notificationServiceDefaults.type,
    customClass: options.customClass ?? notificationServiceDefaults.customClass,
    icon: options.icon ?? notificationServiceDefaults.icon,
    closeIcon: options.closeIcon ?? notificationServiceDefaults.closeIcon,
    groupKey: options.groupKey,
    onClosed: options.onClosed,
    onClick: options.onClick,
    timerKey: notificationServiceDefaults.timerKey
  };

  return normalized;
}

function getBucketKey(targetKey: string, position: NotificationPosition) {
  return `${targetKey}:${position}`;
}

function getOrCreateBucket(position: NotificationPosition, targetKey: string, target: HTMLElement) {
  const bucketKey = getBucketKey(targetKey, position);
  const existing = notificationBuckets.get(bucketKey);

  if (existing) {
    existing.target = target;
    return existing;
  }

  const bucket: NotificationBucket = {
    key: bucketKey,
    targetKey,
    target,
    position,
    instances: []
  };

  notificationBuckets.set(bucketKey, bucket);
  return bucket;
}

function cleanupBucket(bucketKey: string) {
  const bucket = notificationBuckets.get(bucketKey);

  if (bucket && bucket.instances.length === 0) {
    notificationBuckets.delete(bucketKey);
  }
}

function getHostHeight(instance: NotificationContext) {
  return (
    instance.host.getBoundingClientRect().height ||
    instance.host.firstElementChild?.getBoundingClientRect().height ||
    0
  );
}

function applyHostStyle(instance: NotificationContext) {
  instance.host.className = [
    "xy-notification-service-host",
    `xy-notification-service-host--${instance.position}`
  ].join(" ");
  instance.host.style.top = instance.position.startsWith("top")
    ? `${instance.currentOffset}px`
    : "";
  instance.host.style.bottom = instance.position.startsWith("bottom")
    ? `${instance.currentOffset}px`
    : "";
  instance.host.style.zIndex = String(instance.props.zIndex ?? "");
}

function updateBucketOffsets(bucketKey: string, startingOffset?: number) {
  const bucket = notificationBuckets.get(bucketKey);

  if (!bucket || bucket.instances.length === 0) {
    cleanupBucket(bucketKey);
    return;
  }

  let currentOffset = startingOffset ?? bucket.instances[0]!.baseOffset + NOTIFICATION_GAP;

  bucket.instances.forEach((instance) => {
    instance.currentOffset = currentOffset;
    applyHostStyle(instance);
    currentOffset += getHostHeight(instance) + NOTIFICATION_GAP;
  });
}

function toSnapshotEntry(instance: NotificationContext): NotificationSnapshotEntry {
  const message = instance.props.message;

  return {
    id: instance.id,
    type: instance.props.type ?? "",
    position: instance.position,
    targetKey: instance.targetKey,
    visible: instance.vm.exposed?.visible.value ?? false,
    groupKey: instance.groupKey,
    title: instance.props.title || undefined,
    messageText: typeof message === "string" ? message : undefined,
    hasRichContent:
      typeof message === "function" || (typeof message !== "string" && message != null)
  };
}

function getNotificationSnapshot(): NotificationSnapshot {
  const positions: NotificationSnapshot["positions"] = {};
  let total = 0;

  notificationBuckets.forEach((bucket) => {
    positions[bucket.position] = (positions[bucket.position] ?? []).concat(
      bucket.instances.map((instance) => toSnapshotEntry(instance))
    );
    total += bucket.instances.length;
  });

  return {
    positions,
    total
  };
}

function countScopedNotifications(
  position: NotificationPosition,
  targetKey: string,
  excludeId?: string
) {
  const bucket = notificationBuckets.get(getBucketKey(targetKey, position));

  if (!bucket) {
    return 0;
  }

  return bucket.instances.filter((instance) => instance.id !== excludeId).length;
}

function canMoveToScope(
  instance: NotificationContext,
  nextPosition: NotificationPosition,
  nextTargetKey: string,
  nextMax: number | null
) {
  if (nextMax === null) {
    return true;
  }

  return countScopedNotifications(nextPosition, nextTargetKey, instance.id) < nextMax;
}

function reassignNotificationScope(
  instance: NotificationContext,
  nextTarget: HTMLElement,
  nextTargetKey: string,
  nextPosition: NotificationPosition
) {
  const previousBucketKey = instance.bucketKey;
  const previousBucket = notificationBuckets.get(previousBucketKey);

  if (previousBucket) {
    const index = previousBucket.instances.indexOf(instance);

    if (index !== -1) {
      previousBucket.instances.splice(index, 1);
    }
  }

  if (instance.host.parentElement !== nextTarget) {
    nextTarget.appendChild(instance.host);
  }

  const nextBucket = getOrCreateBucket(nextPosition, nextTargetKey, nextTarget);
  nextBucket.instances.push(instance);

  instance.bucketKey = nextBucket.key;
  instance.position = nextPosition;
  instance.targetKey = nextTargetKey;

  if (previousBucketKey !== nextBucket.key) {
    void nextTick().then(() => {
      updateBucketOffsets(previousBucketKey);
      updateBucketOffsets(nextBucket.key);
    });
  } else {
    void nextTick().then(() => {
      updateBucketOffsets(nextBucket.key);
    });
  }

  cleanupBucket(previousBucketKey);
}

function patchNotificationInstance(
  instance: NotificationContext,
  patch: NotificationUpdateOptions,
  options?: {
    resetTimer?: boolean;
  }
) {
  const currentBucket = notificationBuckets.get(instance.bucketKey);
  const nextTarget = "appendTo" in patch ? normalizeAppendTo(patch.appendTo) : null;
  const resolvedTarget =
    nextTarget ?? currentBucket?.target ?? instance.host.parentElement ?? document.body;
  const nextTargetKey = resolveTargetKey(resolvedTarget);
  const nextPosition =
    "position" in patch && patch.position !== undefined
      ? normalizePosition(patch.position)
      : instance.position;
  const nextMax = "max" in patch ? normalizeMax(patch.max) : instance.max;
  const nextOverflowStrategy =
    "overflowStrategy" in patch
      ? normalizeOverflowStrategy(patch.overflowStrategy)
      : instance.overflowStrategy;

  if (!canMoveToScope(instance, nextPosition, nextTargetKey, nextMax)) {
    warnOnce(
      "XyNotification",
      `通知 ${instance.id} 更新后的目标位置已达到上限，已忽略本次 position / appendTo 变更。`
    );
  } else if (nextTargetKey !== instance.targetKey || nextPosition !== instance.position) {
    reassignNotificationScope(instance, resolvedTarget, nextTargetKey, nextPosition);
  }

  if ("title" in patch && patch.title !== undefined) {
    instance.props.title = patch.title;
  }

  if ("message" in patch && patch.message !== undefined) {
    instance.props.message = patch.message;
  }

  if ("type" in patch && patch.type !== undefined) {
    instance.props.type = patch.type;
  }

  if ("showClose" in patch && patch.showClose !== undefined) {
    instance.props.showClose = patch.showClose;
  }

  if ("customClass" in patch && patch.customClass !== undefined) {
    instance.props.customClass = patch.customClass;
  }

  if ("icon" in patch && patch.icon !== undefined) {
    instance.props.icon = patch.icon;
  }

  if ("closeIcon" in patch && patch.closeIcon !== undefined) {
    instance.props.closeIcon = patch.closeIcon;
  }

  if ("dangerouslyUseHTMLString" in patch && patch.dangerouslyUseHTMLString !== undefined) {
    instance.props.dangerouslyUseHTMLString = patch.dangerouslyUseHTMLString;
  }

  if ("duration" in patch && patch.duration !== undefined) {
    instance.props.duration = normalizeDuration(patch.duration);

    if (options?.resetTimer) {
      instance.props.timerKey = (instance.props.timerKey ?? 0) + 1;
    }
  }

  if ("zIndex" in patch && patch.zIndex !== undefined) {
    instance.props.zIndex = patch.zIndex;
    applyHostStyle(instance);
  }

  if ("offset" in patch && patch.offset !== undefined) {
    instance.baseOffset = normalizeOffset(patch.offset);
  }

  if ("groupKey" in patch) {
    instance.groupKey = patch.groupKey;
  }

  if ("max" in patch) {
    instance.max = nextMax;
  }

  if ("overflowStrategy" in patch) {
    instance.overflowStrategy = nextOverflowStrategy;
  }

  if ("onClosed" in patch) {
    instance.onClosed = patch.onClosed;
  }

  if ("onClick" in patch) {
    instance.onClick = patch.onClick;
  }

  void nextTick().then(() => {
    updateBucketOffsets(instance.bucketKey);
  });
}

function finalizeNotificationInstance(
  instance: NotificationContext,
  reason: NotificationCloseReason
) {
  if (instance.status === "closed") {
    return;
  }

  instance.status = "closed";
  const finalReason = instance.closeReason ?? reason;

  try {
    instance.onClosed?.(finalReason);
  } catch {
    // Ignore callback errors to keep teardown stable.
  }

  render(null, instance.host);

  if (instance.host.isConnected) {
    instance.host.remove();
  }

  cleanupBucket(instance.bucketKey);
}

function detachNotificationInstance(
  instance: NotificationContext,
  reason: NotificationServiceCloseReason
) {
  if (instance.status === "closed") {
    return;
  }

  instance.closeReason = reason;

  const bucket = notificationBuckets.get(instance.bucketKey);

  if (!bucket) {
    instance.status = "closing";
    return;
  }

  const index = bucket.instances.indexOf(instance);

  if (index !== -1) {
    bucket.instances.splice(index, 1);
    const nextOffset = index === 0 ? instance.currentOffset : undefined;

    void nextTick().then(() => {
      updateBucketOffsets(instance.bucketKey, nextOffset);
    });
  }

  instance.status = "closing";
  cleanupBucket(instance.bucketKey);
}

function toComponentCloseReason(reason: NotificationServiceCloseReason) {
  if (notificationCloseReasons.includes(reason as NotificationCloseReason)) {
    return reason as NotificationCloseReason;
  }

  return "programmatic";
}

function requestCloseNotification(
  instance: NotificationContext,
  reason: NotificationServiceCloseReason
) {
  if (instance.status !== "active") {
    return;
  }

  detachNotificationInstance(instance, reason);
  instance.vm.exposed?.close(toComponentCloseReason(reason));
}

function createNotificationInstance(
  normalized: NotificationServiceOptionsNormalized,
  context?: AppContext | null
) {
  const id = nextNotificationId();
  const host = document.createElement("div");
  const instance = {} as NotificationContext;

  const bucket = getOrCreateBucket(normalized.position, normalized.targetKey, normalized.appendTo);
  const previous = bucket.instances.at(-1);
  const currentOffset = previous
    ? previous.currentOffset + getHostHeight(previous) + NOTIFICATION_GAP
    : normalized.offset + NOTIFICATION_GAP;

  const vnode = createVNode(NotificationComponent, {
    title: normalized.title,
    message: normalized.message,
    type: normalized.type,
    duration: normalized.duration,
    showClose: normalized.showClose,
    customClass: normalized.customClass,
    icon: normalized.icon,
    closeIcon: normalized.closeIcon,
    dangerouslyUseHTMLString: normalized.dangerouslyUseHTMLString,
    zIndex: normalized.zIndex ?? nextNotificationZIndex(),
    timerKey: normalized.timerKey,
    onClick: (event: MouseEvent) => {
      void event;
      instance.onClick?.();
    },
    onClose: (reason: NotificationCloseReason) => {
      if (instance.status === "active") {
        detachNotificationInstance(instance, reason);
      }
    },
    onClosed: (reason: NotificationCloseReason) => {
      finalizeNotificationInstance(instance, reason);
    }
  });
  vnode.appContext = context ?? notification._context;
  render(vnode, host);

  const vm = vnode.component;

  if (!vm) {
    throw new Error("XyNotification 挂载失败：未生成可用的通知实例。");
  }

  host.className = "xy-notification-service-host";
  normalized.appendTo.appendChild(host);

  const handler: NotificationHandler = {
    id,
    close(reason = "programmatic") {
      requestCloseNotification(instance, reason);
    },
    update(patch) {
      patchNotificationInstance(instance, patch, {
        resetTimer: hasOwn(patch, "duration")
      });
    }
  };

  Object.assign(instance, {
    id,
    host,
    vnode,
    vm: vm as NotificationContext["vm"],
    props: vm.props as NotificationContext["props"],
    handler,
    bucketKey: bucket.key,
    position: normalized.position,
    targetKey: normalized.targetKey,
    groupKey: normalized.groupKey,
    baseOffset: normalized.offset,
    currentOffset,
    max: normalized.max,
    overflowStrategy: normalized.overflowStrategy,
    closeReason: "programmatic",
    onClosed: normalized.onClosed,
    onClick: normalized.onClick,
    status: "active"
  });

  bucket.instances.push(instance);
  applyHostStyle(instance);
  return instance;
}

function findGroupInstance(bucket: NotificationBucket, groupKey: string) {
  return bucket.instances.find((instance) => instance.groupKey === groupKey) ?? null;
}

function normalizeCloseFilter(
  filter?: NotificationType | NotificationCloseFilter
): NotificationCloseFilter {
  if (typeof filter === "string") {
    return {
      type: filter
    };
  }

  return filter ?? {};
}

function resolveTargetKeyFromFilter(filter: NotificationCloseFilter) {
  if (filter.targetKey) {
    return filter.targetKey;
  }

  if (!("target" in filter) || !filter.target) {
    return undefined;
  }

  const target = normalizeAppendTo(filter.target);

  return target ? resolveTargetKey(target) : undefined;
}

function matchesFilter(
  instance: NotificationContext,
  filter: NotificationCloseFilter,
  targetKey: string | undefined
) {
  if (filter.type && instance.props.type !== filter.type) {
    return false;
  }

  if (filter.position && instance.position !== filter.position) {
    return false;
  }

  if (targetKey && instance.targetKey !== targetKey) {
    return false;
  }

  if (filter.groupKey !== undefined && instance.groupKey !== filter.groupKey) {
    return false;
  }

  return true;
}

function openNotification(options?: NotificationParams, context?: AppContext | null) {
  if (typeof document === "undefined") {
    warnOnce("XyNotification", "XyNotification 仅支持在浏览器环境中使用。");
    return createNoopHandler();
  }

  const rawOptions = toNotificationOptions(options);
  const normalized = normalizeOptions(rawOptions, context);

  if (!normalized) {
    return createNoopHandler();
  }

  const bucket = getOrCreateBucket(normalized.position, normalized.targetKey, normalized.appendTo);

  if (normalized.groupKey) {
    const grouped = findGroupInstance(bucket, normalized.groupKey);

    if (grouped) {
      const normalizedPatch: NotificationUpdateOptions = {
        ...normalized,
        max: normalized.max ?? undefined
      };

      patchNotificationInstance(grouped, normalizedPatch, {
        resetTimer: hasOwn(rawOptions, "duration")
      });
      return grouped.handler;
    }
  }

  if (normalized.max !== null && bucket.instances.length >= normalized.max) {
    if (normalized.overflowStrategy === "drop-oldest" && bucket.instances.length > 0) {
      requestCloseNotification(bucket.instances[0]!, "overflow");
    } else {
      normalized.onClosed?.("overflow");
      return createNoopHandler(nextNotificationId());
    }
  }

  if (normalized.max !== null && bucket.instances.length >= normalized.max) {
    normalized.onClosed?.("overflow");
    return createNoopHandler(nextNotificationId());
  }

  const instance = createNotificationInstance(normalized, context);

  void nextTick().then(() => {
    updateBucketOffsets(instance.bucketKey);
  });

  return instance.handler;
}

function bindNotificationContext(appContext: AppContext | null): NotificationService {
  const bound = ((options?: NotificationParams) =>
    openNotification(options, appContext)) as NotificationService;

  bound.open = (options?: NotificationParams) => openNotification(options, appContext);

  notificationTypes.forEach((type) => {
    bound[type] = (options?: NotificationParamsTyped) => {
      const nextOptions = toNotificationOptions(options, type);
      return openNotification(nextOptions, appContext);
    };
  });

  bound.closeAll = notification.closeAll;
  bound.getState = notification.getState;
  bound.updateOffsets = notification.updateOffsets;
  bound.withContext = notification.withContext;
  bound._context = appContext;

  return bound;
}

const notification = ((options?: NotificationParams, context?: AppContext | null) =>
  openNotification(options, context)) as NotificationService;

notification.open = (options?: NotificationParams, context?: AppContext | null) =>
  openNotification(options, context);

notificationTypes.forEach((type) => {
  notification[type] = (options?: NotificationParamsTyped, context?: AppContext | null) => {
    const nextOptions = toNotificationOptions(options, type);
    return openNotification(nextOptions, context);
  };
});

notification.closeAll = (filter?: NotificationType | NotificationCloseFilter) => {
  const normalizedFilter = normalizeCloseFilter(filter);
  const targetKey = resolveTargetKeyFromFilter(normalizedFilter);

  notificationBuckets.forEach((bucket) => {
    [...bucket.instances].forEach((instance) => {
      if (matchesFilter(instance, normalizedFilter, targetKey)) {
        requestCloseNotification(instance, "close-all");
      }
    });
  });
};

notification.getState = (filter?: NotificationCloseFilter) => {
  const snapshot = getNotificationSnapshot();

  if (!filter || Object.keys(filter).length === 0) {
    return snapshot;
  }

  const targetKey = resolveTargetKeyFromFilter(filter);
  const positions: NotificationSnapshot["positions"] = {};
  let total = 0;

  Object.entries(snapshot.positions).forEach(([position, entries]) => {
    const filteredEntries =
      entries?.filter((entry) => {
        if (filter.type && entry.type !== filter.type) {
          return false;
        }

        if (filter.position && position !== filter.position) {
          return false;
        }

        if (targetKey && entry.targetKey !== targetKey) {
          return false;
        }

        if (filter.groupKey !== undefined && entry.groupKey !== filter.groupKey) {
          return false;
        }

        return true;
      }) ?? [];

    if (filteredEntries.length > 0) {
      positions[position as NotificationPosition] = filteredEntries;
      total += filteredEntries.length;
    }
  });

  return {
    positions,
    total
  };
};

notification.updateOffsets = (position?: NotificationPosition) => {
  notificationBuckets.forEach((bucket) => {
    if (position && bucket.position !== position) {
      return;
    }

    updateBucketOffsets(bucket.key);
  });
};

notification.withContext = (appContext: AppContext | null = null) =>
  bindNotificationContext(appContext);
notification._context = null;

export default notification;
