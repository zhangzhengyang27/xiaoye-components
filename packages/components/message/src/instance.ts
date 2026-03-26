import { shallowReactive } from "vue";
import type { ComponentInternalInstance, VNode } from "vue";
import type {
  MessageHandler,
  MessageOptionsNormalized,
  MessagePlacement,
  MessageProps,
  MessageSnapshot,
  MessageSnapshotEntry
} from "./message";

type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

export type MessageExposed = {
  bottom: {
    value: number;
  };
  close: (reason?: Parameters<MessageHandler["close"]>[0]) => void;
  visible: {
    value: boolean;
  };
};

export type MessageContext = {
  id: string;
  vnode: VNode;
  handler: MessageHandler;
  vm: ComponentInternalInstance & {
    exposed: MessageExposed | null;
  };
  props: Mutable<MessageProps>;
  targetKey: string;
  max: number | null;
};

export const placementInstances = shallowReactive({} as Record<MessagePlacement, MessageContext[]>);

function toSnapshotEntry(instance: MessageContext): MessageSnapshotEntry {
  const message = instance.props.message;

  return {
    id: instance.id,
    type: instance.props.type ?? "info",
    placement: instance.props.placement ?? "top",
    targetKey: instance.targetKey,
    repeatNum: instance.props.repeatNum ?? 1,
    visible: instance.vm.exposed?.visible.value ?? false,
    groupKey: instance.props.groupKey,
    messageText: typeof message === "string" || typeof message === "number" ? message : undefined,
    hasRichContent:
      Boolean(instance.props.render) ||
      typeof message === "function" ||
      (typeof message !== "string" && typeof message !== "number" && message != null)
  };
}

export function getMessageSnapshot(): MessageSnapshot {
  const placements: MessageSnapshot["placements"] = {};
  let total = 0;

  Object.entries(placementInstances).forEach(([placement, instances]) => {
    placements[placement as MessagePlacement] = instances.map((instance) =>
      toSnapshotEntry(instance)
    );
    total += instances.length;
  });

  return {
    placements,
    total
  };
}

export function getOrCreatePlacementInstances(placement: MessagePlacement) {
  if (!placementInstances[placement]) {
    placementInstances[placement] = shallowReactive([]);
  }

  return placementInstances[placement];
}

export function removeMessageInstance(instance: MessageContext) {
  const placement = instance.props.placement;

  if (!placement) {
    return;
  }

  const instances = placementInstances[placement];

  if (!instances) {
    return;
  }

  const index = instances.indexOf(instance);

  if (index !== -1) {
    instances.splice(index, 1);
  }
}

export function getMessageInstance(id: string) {
  for (const instances of Object.values(placementInstances)) {
    const matched = instances.find((instance) => instance.id === id);

    if (matched) {
      return matched;
    }
  }

  return null;
}

export function moveMessageInstance(instance: MessageContext, nextPlacement: MessagePlacement) {
  const previousPlacement = instance.props.placement;

  if (previousPlacement === nextPlacement) {
    return;
  }

  if (previousPlacement) {
    removeMessageInstance(instance);
  }

  getOrCreatePlacementInstances(nextPlacement).push(instance);
}

export function getScopedPlacementInstances(placement: MessagePlacement, targetKey: string) {
  const instances = placementInstances[placement] ?? [];

  return instances.filter((instance) => instance.targetKey === targetKey);
}

export function getMatchingGroupInstance(
  placement: MessagePlacement,
  targetKey: string,
  normalized: Pick<MessageOptionsNormalized, "groupKey" | "message">
) {
  const instances = getScopedPlacementInstances(placement, targetKey);

  if (normalized.groupKey !== undefined && normalized.groupKey !== "") {
    return instances.find((instance) => instance.props.groupKey === normalized.groupKey) ?? null;
  }

  if (typeof normalized.message !== "string" && typeof normalized.message !== "number") {
    return null;
  }

  return instances.find((instance) => instance.props.message === normalized.message) ?? null;
}

export function getInstance(id: string, placement: MessagePlacement, targetKey: string) {
  const instances = placementInstances[placement] ?? [];
  let current: MessageContext | undefined;
  let prev: MessageContext | undefined;

  for (const instance of instances) {
    if (instance.targetKey !== targetKey) {
      continue;
    }

    if (instance.id === id) {
      current = instance;
      break;
    }

    prev = instance;
  }

  return {
    current,
    prev
  };
}

export function getLastOffset(id: string, placement: MessagePlacement, targetKey: string) {
  const { prev } = getInstance(id, placement, targetKey);

  if (!prev) {
    return 0;
  }

  return prev.vm.exposed?.bottom.value ?? 0;
}

export function getOffsetOrSpace(
  id: string,
  offset: number,
  placement: MessagePlacement,
  targetKey: string
) {
  const instances = placementInstances[placement] ?? [];
  let matchedBeforeCurrent = 0;

  for (const instance of instances) {
    if (instance.targetKey !== targetKey) {
      continue;
    }

    if (instance.id === id) {
      break;
    }

    matchedBeforeCurrent += 1;
  }

  return matchedBeforeCurrent > 0 ? 16 : offset;
}
