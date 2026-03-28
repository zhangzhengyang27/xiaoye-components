import { createVNode, isVNode, render } from "vue";
import type { AppContext } from "vue";
import { warnOnce } from "@xiaoye/utils";
import {
  configProviderKey,
  getGlobalMessageConfig,
  getGlobalMessageConfigCount
} from "../../config-provider/src/context";
import MessageConstructor from "./message.vue";
import {
  MESSAGE_DEFAULT_PLACEMENT,
  messageDefaults,
  messagePlacements,
  messageTypes,
  type Message,
  type MessageCloseFilter,
  type MessageCloseReason,
  type MessageGlobalConfig,
  type MessageHandler,
  type MessageOptions,
  type MessageOptionsNormalized,
  type MessageParams,
  type MessagePlacement,
  type MessageType,
  type MessageUpdateOptions
} from "./message";
import {
  getMatchingGroupInstance,
  getMessageSnapshot,
  getOrCreatePlacementInstances,
  getScopedPlacementInstances,
  type MessageContext,
  moveMessageInstance,
  placementInstances,
  removeMessageInstance
} from "./instance";

type MessageCreateProps = MessageOptionsNormalized & {
  id: string;
  onDestroy?: () => void;
  onCloseStart?: (reason: MessageCloseReason) => void;
};

type ProviderLikeConfig = {
  message?: {
    value?: MessageGlobalConfig;
  };
};

let seed = 1;
let targetSeed = 0;

const targetKeyMap = new WeakMap<HTMLElement, string>();
const hasOwn = (target: object, key: PropertyKey) =>
  Object.prototype.hasOwnProperty.call(target, key);

function isMessagePrimitive(value: MessageParams | undefined) {
  return (
    value === undefined ||
    typeof value === "string" ||
    typeof value === "number" ||
    isVNode(value) ||
    typeof value === "function"
  );
}

function nextMessageId() {
  seed += 1;
  return `xy-message-${seed}`;
}

function resolveTargetKey(target: HTMLElement) {
  const cached = targetKeyMap.get(target);

  if (cached) {
    return cached;
  }

  targetSeed += 1;
  const key = `xy-message-target-${targetSeed}`;
  targetKeyMap.set(target, key);
  return key;
}

function normalizeAppendTo(appendTo: MessageOptions["appendTo"], scope = "XyMessage") {
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

function normalizePlacement(placement: MessagePlacement | undefined) {
  if (!placement) {
    return MESSAGE_DEFAULT_PLACEMENT;
  }

  if (!messagePlacements.includes(placement)) {
    warnOnce(
      "XyMessage",
      `无效的 placement：${placement}，已回退到 ${MESSAGE_DEFAULT_PLACEMENT}。`
    );
    return MESSAGE_DEFAULT_PLACEMENT;
  }

  return placement;
}

function normalizeMax(value: number | undefined | null) {
  if (value === undefined || value === null || !Number.isFinite(value)) {
    return null;
  }

  return Math.max(0, Math.trunc(value));
}

function resolveMessageConfig(context?: AppContext | null) {
  if (context) {
    const providedConfig = context.provides?.[configProviderKey as symbol] as
      | ProviderLikeConfig
      | undefined;
    const scopedMessageConfig = providedConfig?.message?.value;

    if (scopedMessageConfig !== undefined) {
      return scopedMessageConfig;
    }
  }

  const globalMessageConfigCount = getGlobalMessageConfigCount();

  if (globalMessageConfigCount <= 1) {
    return getGlobalMessageConfig().value ?? {};
  }

  warnOnce(
    "XyMessage",
    "检测到多个 ConfigProvider.message 同时存在。请改用 $message、XyMessage.withContext(appContext) 或 XyMessage(options, appContext) 来显式指定上下文。当前调用已回退到默认配置。"
  );

  return {};
}

function normalizeOptions(
  params?: MessageParams,
  context?: AppContext | null
): MessageOptionsNormalized | null {
  if (typeof document === "undefined") {
    return null;
  }

  const options: MessageOptions = isMessagePrimitive(params)
    ? { message: params as MessageOptions["message"] }
    : ((params ?? {}) as MessageOptions);
  const globalMessageConfig = resolveMessageConfig(context);
  const appendTo = normalizeAppendTo(options.appendTo);

  if (!appendTo) {
    return null;
  }

  const normalizedPlacement = normalizePlacement(
    hasOwn(options, "placement") ? options.placement : globalMessageConfig.placement
  );

  const placementMax = globalMessageConfig.maxByPlacement?.[normalizedPlacement];
  const normalized = {
    ...messageDefaults,
    ...options,
    appendTo,
    placement: normalizedPlacement,
    targetKey: resolveTargetKey(appendTo),
    max: normalizeMax(
      hasOwn(options, "max") ? options.max : (placementMax ?? globalMessageConfig.max)
    )
  };

  if (!hasOwn(options, "grouping") && typeof globalMessageConfig.grouping === "boolean") {
    normalized.grouping = globalMessageConfig.grouping;
  }

  if (!hasOwn(options, "duration") && typeof globalMessageConfig.duration === "number") {
    normalized.duration = globalMessageConfig.duration;
  }

  if (!hasOwn(options, "offset") && typeof globalMessageConfig.offset === "number") {
    normalized.offset = globalMessageConfig.offset;
  }

  if (!hasOwn(options, "showClose") && typeof globalMessageConfig.showClose === "boolean") {
    normalized.showClose = globalMessageConfig.showClose;
  }

  if (!hasOwn(options, "showIcon") && typeof globalMessageConfig.showIcon === "boolean") {
    normalized.showIcon = globalMessageConfig.showIcon;
  }

  if (!hasOwn(options, "plain") && typeof globalMessageConfig.plain === "boolean") {
    normalized.plain = globalMessageConfig.plain;
  }

  if (!hasOwn(options, "closeOnClick") && typeof globalMessageConfig.closeOnClick === "boolean") {
    normalized.closeOnClick = globalMessageConfig.closeOnClick;
  }

  if (
    !hasOwn(options, "closeOnPressEscape") &&
    typeof globalMessageConfig.closeOnPressEscape === "boolean"
  ) {
    normalized.closeOnPressEscape = globalMessageConfig.closeOnPressEscape;
  }

  if (!hasOwn(options, "pauseOnHover") && typeof globalMessageConfig.pauseOnHover === "boolean") {
    normalized.pauseOnHover = globalMessageConfig.pauseOnHover;
  }

  if (!hasOwn(options, "pauseOnFocus") && typeof globalMessageConfig.pauseOnFocus === "boolean") {
    normalized.pauseOnFocus = globalMessageConfig.pauseOnFocus;
  }

  if (
    !hasOwn(options, "pauseOnPageHidden") &&
    typeof globalMessageConfig.pauseOnPageHidden === "boolean"
  ) {
    normalized.pauseOnPageHidden = globalMessageConfig.pauseOnPageHidden;
  }

  if (!hasOwn(options, "transition") && typeof globalMessageConfig.transition === "string") {
    normalized.transition = globalMessageConfig.transition;
  }

  if (!hasOwn(options, "resetOnRepeat") && typeof globalMessageConfig.resetOnRepeat === "boolean") {
    normalized.resetOnRepeat = globalMessageConfig.resetOnRepeat;
  }

  return normalized;
}

function createNoopHandler(id = `xy-message-noop-${Date.now()}`): MessageHandler {
  return {
    id,
    close() {},
    update() {}
  };
}

function countScopedMessages(placement: MessagePlacement, targetKey: string, excludeId?: string) {
  return getScopedPlacementInstances(placement, targetKey).filter(
    (instance) => instance.id !== excludeId
  ).length;
}

function canMoveToScope(
  instance: MessageContext,
  nextPlacement: MessagePlacement,
  nextTargetKey: string,
  nextMax: number | null
) {
  if (nextMax === null) {
    return true;
  }

  return countScopedMessages(nextPlacement, nextTargetKey, instance.id) < nextMax;
}

function applyMessagePatch(instance: MessageContext, patch: MessageUpdateOptions) {
  const nextTarget = "appendTo" in patch ? normalizeAppendTo(patch.appendTo) : null;
  const nextTargetKey = nextTarget ? resolveTargetKey(nextTarget) : instance.targetKey;
  const nextPlacement =
    "placement" in patch && patch.placement !== undefined
      ? normalizePlacement(patch.placement)
      : (instance.props.placement ?? MESSAGE_DEFAULT_PLACEMENT);
  const nextMax = "max" in patch ? normalizeMax(patch.max) : instance.max;

  if (!canMoveToScope(instance, nextPlacement, nextTargetKey, nextMax)) {
    warnOnce(
      "XyMessage",
      `消息 ${instance.id} 更新后的目标位置已达到上限，已忽略本次 placement / appendTo 变更。`
    );
  } else {
    if (nextTarget) {
      instance.targetKey = nextTargetKey;
      instance.props.targetKey = nextTargetKey;

      const element = instance.vm.proxy?.$el as HTMLElement | undefined;

      if (element && element.parentElement !== nextTarget) {
        nextTarget.appendChild(element);
      }
    }

    if (nextPlacement !== (instance.props.placement ?? MESSAGE_DEFAULT_PLACEMENT)) {
      moveMessageInstance(instance, nextPlacement);
      instance.props.placement = nextPlacement;
    }

    instance.max = nextMax;
  }

  if ("message" in patch && patch.message !== undefined) {
    instance.props.message = patch.message;
  }

  if ("render" in patch) {
    instance.props.render = patch.render;
  }

  if ("customClass" in patch && patch.customClass !== undefined) {
    instance.props.customClass = patch.customClass;
  }

  if ("dangerouslyUseHTMLString" in patch && patch.dangerouslyUseHTMLString !== undefined) {
    instance.props.dangerouslyUseHTMLString = patch.dangerouslyUseHTMLString;
  }

  if ("duration" in patch && patch.duration !== undefined) {
    instance.props.duration = patch.duration;
  }

  if ("icon" in patch && patch.icon !== undefined) {
    instance.props.icon = patch.icon;
  }

  if ("offset" in patch && patch.offset !== undefined) {
    instance.props.offset = patch.offset;
  }

  if ("plain" in patch && patch.plain !== undefined) {
    instance.props.plain = patch.plain;
  }

  if ("repeatNum" in patch && patch.repeatNum !== undefined) {
    instance.props.repeatNum = patch.repeatNum;
  }

  if ("showClose" in patch && patch.showClose !== undefined) {
    instance.props.showClose = patch.showClose;
  }

  if ("showIcon" in patch && patch.showIcon !== undefined) {
    instance.props.showIcon = patch.showIcon;
  }

  if ("type" in patch && patch.type !== undefined) {
    instance.props.type = patch.type;
  }

  if ("zIndex" in patch) {
    instance.props.zIndex = patch.zIndex;
  }

  if ("groupKey" in patch) {
    instance.props.groupKey = patch.groupKey;
  }

  if ("beforeClose" in patch) {
    instance.props.beforeClose = patch.beforeClose;
  }

  if ("onClose" in patch) {
    instance.props.onClose = patch.onClose;
  }

  if ("onClick" in patch) {
    instance.props.onClick = patch.onClick;
  }

  if ("closeOnClick" in patch && patch.closeOnClick !== undefined) {
    instance.props.closeOnClick = patch.closeOnClick;
  }

  if ("closeOnPressEscape" in patch && patch.closeOnPressEscape !== undefined) {
    instance.props.closeOnPressEscape = patch.closeOnPressEscape;
  }

  if ("pauseOnHover" in patch && patch.pauseOnHover !== undefined) {
    instance.props.pauseOnHover = patch.pauseOnHover;
  }

  if ("pauseOnFocus" in patch && patch.pauseOnFocus !== undefined) {
    instance.props.pauseOnFocus = patch.pauseOnFocus;
  }

  if ("pauseOnPageHidden" in patch && patch.pauseOnPageHidden !== undefined) {
    instance.props.pauseOnPageHidden = patch.pauseOnPageHidden;
  }

  if ("transition" in patch && patch.transition !== undefined) {
    instance.props.transition = patch.transition;
  }

  if ("resetOnRepeat" in patch && patch.resetOnRepeat !== undefined) {
    instance.props.resetOnRepeat = patch.resetOnRepeat;
  }
}

function createMessage(
  options: MessageOptionsNormalized,
  context?: AppContext | null
): MessageContext {
  const id = `xy-message-${seed++}`;
  const container = document.createElement("div");
  const instance = {} as MessageContext;

  const props: MessageCreateProps = {
    ...options,
    id,
    onCloseStart: () => {
      removeMessageInstance(instance);
    },
    onDestroy: () => {
      render(null, container);
    }
  };
  const vnode = createVNode(
    MessageConstructor,
    props as MessageCreateProps & Record<string, unknown>
  );
  vnode.appContext = context || message._context;
  render(vnode, container);

  const element = container.firstElementChild;

  if (!element) {
    throw new Error("XyMessage 挂载失败：未生成可用的消息节点。");
  }

  options.appendTo.appendChild(element);

  const vm = vnode.component!;
  const handler: MessageHandler = {
    id,
    close(reason = "programmatic") {
      instance.vm.exposed?.close(reason);
    },
    update(patch) {
      applyMessagePatch(instance, patch);
    }
  };

  Object.assign(instance, {
    id,
    vnode,
    vm: vm as MessageContext["vm"],
    handler,
    props: vm.props as MessageContext["props"],
    targetKey: options.targetKey,
    max: options.max
  });

  return instance;
}

function normalizeCloseFilter(filter?: MessageType | MessageCloseFilter): MessageCloseFilter {
  if (typeof filter === "string") {
    return {
      type: filter
    };
  }

  return filter ?? {};
}

function resolveTargetKeyFromFilter(filter: MessageCloseFilter) {
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
  instance: MessageContext,
  filter: MessageCloseFilter,
  targetKey: string | undefined
) {
  if (filter.type && instance.props.type !== filter.type) {
    return false;
  }

  if (filter.placement && instance.props.placement !== filter.placement) {
    return false;
  }

  if (targetKey && instance.targetKey !== targetKey) {
    return false;
  }

  if (filter.groupKey !== undefined && instance.props.groupKey !== filter.groupKey) {
    return false;
  }

  return true;
}

function bindMessageContext(appContext: AppContext | null): Message {
  const bound = ((options?: MessageParams) => message(options, appContext)) as Message;

  messageTypes.forEach((type) => {
    bound[type] = (options?: MessageParams) => message[type](options, appContext);
  });

  bound.closeAll = message.closeAll;
  bound.closeAllByPlacement = message.closeAllByPlacement;
  bound.getState = message.getState;
  bound.withContext = message.withContext;
  bound._context = appContext;

  return bound;
}

const message = ((options?: MessageParams, context?: AppContext | null) => {
  if (typeof document === "undefined") {
    warnOnce("XyMessage", "XyMessage 仅支持在浏览器环境中使用。");
    return createNoopHandler();
  }

  const normalized = normalizeOptions(options, context);

  if (!normalized) {
    return createNoopHandler();
  }

  if (normalized.grouping) {
    const groupedInstance = getMatchingGroupInstance(normalized.placement, normalized.targetKey, {
      groupKey: normalized.groupKey,
      message: normalized.message
    });

    if (groupedInstance) {
      const nextPatch: MessageUpdateOptions = {
        ...normalized,
        max: normalized.max ?? undefined,
        repeatNum: (groupedInstance.props.repeatNum ?? 1) + 1
      };

      applyMessagePatch(groupedInstance, {
        ...nextPatch
      });
      return groupedInstance.handler;
    }
  }

  if (
    normalized.max !== null &&
    countScopedMessages(normalized.placement, normalized.targetKey) >= normalized.max
  ) {
    return createNoopHandler(nextMessageId());
  }

  const instance = createMessage(normalized, context);
  getOrCreatePlacementInstances(normalized.placement).push(instance);
  return instance.handler;
}) as Message;

messageTypes.forEach((type) => {
  message[type] = (options?: MessageParams, context?: AppContext | null) => {
    if (isMessagePrimitive(options)) {
      return message(
        {
          message: options as MessageOptions["message"],
          type
        },
        context
      );
    }

    const nextOptions = (options ?? {}) as MessageOptions;

    return message(
      {
        ...nextOptions,
        type
      },
      context
    );
  };
});

message.closeAll = (filter?: MessageType | MessageCloseFilter) => {
  const normalizedFilter = normalizeCloseFilter(filter);
  const targetKey = resolveTargetKeyFromFilter(normalizedFilter);

  Object.values(placementInstances).forEach((instances) => {
    [...instances].forEach((instance) => {
      if (matchesFilter(instance, normalizedFilter, targetKey)) {
        instance.handler.close("close-all");
      }
    });
  });
};

message.closeAllByPlacement = (placement: MessagePlacement) => {
  message.closeAll({
    placement
  });
};

message.getState = (filter?: MessageCloseFilter) => {
  const snapshot = getMessageSnapshot();

  if (!filter || Object.keys(filter).length === 0) {
    return snapshot;
  }

  const targetKey = resolveTargetKeyFromFilter(filter);
  const placements: typeof snapshot.placements = {};
  let total = 0;

  Object.entries(snapshot.placements).forEach(([placement, entries]) => {
    const filteredEntries =
      entries?.filter((entry) => {
        if (filter.type && entry.type !== filter.type) {
          return false;
        }

        if (filter.placement && placement !== filter.placement) {
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
      placements[placement as MessagePlacement] = filteredEntries;
      total += filteredEntries.length;
    }
  });

  return {
    placements,
    total
  };
};

message.withContext = (appContext: AppContext | null = null) => bindMessageContext(appContext);
message._context = null;

export default message;
