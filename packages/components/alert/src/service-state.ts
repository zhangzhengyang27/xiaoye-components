import { reactive } from "vue";
import type {
  AlertCloseReason,
  AlertServiceHandle,
  AlertServiceOptions,
  AlertServiceClosedFn,
  AlertServiceSnapshot,
  AlertServiceSnapshotEntry,
  AlertServiceUpdateOptions
} from "./alert";
import { invokeAlertBeforeClose } from "./alert";

export interface AlertServiceEntry extends AlertServiceOptions {
  id: string;
  renderKey: number;
}

type AlertServiceIdleHandler = () => void;
type AlertServiceCurrentChangeHandler = (entry: AlertServiceEntry | null) => void;

export const alertServiceState = reactive<{
  current: AlertServiceEntry | null;
  queue: AlertServiceEntry[];
}>({
  current: null,
  queue: []
});

let serviceSeed = 0;
let alertServiceIdleHandler: AlertServiceIdleHandler | null = null;
let alertServiceCurrentChangeHandler: AlertServiceCurrentChangeHandler | null = null;

function nextAlertServiceId() {
  serviceSeed += 1;
  return `xy-alert-service-${serviceSeed}`;
}

function normalizeMaxQueue(maxQueue: number | undefined) {
  if (maxQueue === undefined || !Number.isFinite(maxQueue)) {
    return null;
  }

  return Math.max(0, Math.trunc(maxQueue));
}

function hasOwnDurationField(
  patch: AlertServiceOptions | AlertServiceUpdateOptions
) {
  return Object.prototype.hasOwnProperty.call(patch, "duration");
}

function isCurrentEntry(entry: AlertServiceEntry) {
  return alertServiceState.current?.id === entry.id;
}

function toAlertServiceSnapshotEntry(
  entry: AlertServiceEntry
): AlertServiceSnapshotEntry {
  const {
    beforeClose: _beforeClose,
    onClosed: _onClosed,
    renderKey: _renderKey,
    ...snapshotEntry
  } = entry;

  return {
    ...snapshotEntry
  };
}

function invokeAlertServiceClosed(
  entry: AlertServiceEntry,
  reason: AlertCloseReason
) {
  if (!entry.onClosed) {
    return;
  }

  try {
    (entry.onClosed as AlertServiceClosedFn)(reason);
  } catch {
    // Ignore callback errors so the queue state can still advance.
  }
}

function triggerIdleHandler() {
  if (alertServiceState.current || alertServiceState.queue.length > 0) {
    return;
  }

  alertServiceIdleHandler?.();
}

function triggerCurrentChangeHandler() {
  alertServiceCurrentChangeHandler?.(alertServiceState.current);
}

function getEntryById(id: string) {
  if (alertServiceState.current?.id === id) {
    return alertServiceState.current;
  }

  return alertServiceState.queue.find((entry) => entry.id === id) ?? null;
}

function getEntryByGroupKey(groupKey: string) {
  if (alertServiceState.current?.groupKey === groupKey) {
    return alertServiceState.current;
  }

  return alertServiceState.queue.find((entry) => entry.groupKey === groupKey) ?? null;
}

function shiftQueue() {
  alertServiceState.current = alertServiceState.queue.shift() ?? null;
  triggerCurrentChangeHandler();
}

function patchAlertServiceEntry(
  entry: AlertServiceEntry,
  patch: AlertServiceOptions | AlertServiceUpdateOptions
) {
  Object.assign(entry, patch);

  if (isCurrentEntry(entry) && hasOwnDurationField(patch)) {
    entry.renderKey += 1;
  }

  if (isCurrentEntry(entry)) {
    triggerCurrentChangeHandler();
  }
}

function dismissQueuedEntryByIndex(index: number, reason: AlertCloseReason) {
  const [entry] = alertServiceState.queue.splice(index, 1);

  if (!entry) {
    return;
  }

  invokeAlertServiceClosed(entry, reason);
  triggerIdleHandler();
}

function createAlertServiceEntry(options: AlertServiceOptions): AlertServiceEntry {
  return {
    id: nextAlertServiceId(),
    renderKey: 0,
    overflowStrategy: "drop-oldest",
    ...options
  };
}

export function isAlertServiceIdle() {
  return !alertServiceState.current && alertServiceState.queue.length === 0;
}

export function setAlertServiceIdleHandler(handler: AlertServiceIdleHandler | null) {
  alertServiceIdleHandler = handler;
}

export function setAlertServiceCurrentChangeHandler(
  handler: AlertServiceCurrentChangeHandler | null
) {
  alertServiceCurrentChangeHandler = handler;
}

export function getAlertServiceSnapshot(): AlertServiceSnapshot {
  const current = alertServiceState.current
    ? toAlertServiceSnapshotEntry(alertServiceState.current)
    : null;
  const queue = alertServiceState.queue.map((entry) => toAlertServiceSnapshotEntry(entry));

  return {
    current,
    queue,
    queueLength: queue.length,
    total: queue.length + (current ? 1 : 0)
  };
}

export function createAlertServiceHandle(id: string): AlertServiceHandle {
  return {
    id,
    close() {
      requestCloseAlertServiceEntry(id);
    },
    update(patch) {
      updateAlertServiceEntry(id, patch);
    }
  };
}

export function upsertAlertServiceEntry(options: AlertServiceOptions) {
  if (options.groupKey !== undefined) {
    const matchedEntry = getEntryByGroupKey(options.groupKey);

    if (matchedEntry) {
      patchAlertServiceEntry(matchedEntry, options);
      return matchedEntry;
    }
  }

  const entry = createAlertServiceEntry(options);
  const maxQueue = normalizeMaxQueue(options.maxQueue);

  if (!alertServiceState.current) {
    alertServiceState.current = entry;
    triggerCurrentChangeHandler();
    return entry;
  }

  if (maxQueue !== null && alertServiceState.queue.length >= maxQueue) {
    if (entry.overflowStrategy === "drop-oldest" && alertServiceState.queue.length > 0) {
      dismissQueuedEntryByIndex(0, "overflow");
    } else {
      invokeAlertServiceClosed(entry, "overflow");
      return entry;
    }
  }

  if (maxQueue !== null && alertServiceState.queue.length >= maxQueue) {
    invokeAlertServiceClosed(entry, "overflow");
    return entry;
  }

  alertServiceState.queue.push(entry);
  return entry;
}

export function dismissAlertServiceEntry(id: string, reason: AlertCloseReason) {
  if (alertServiceState.current?.id === id) {
    const closingEntry = alertServiceState.current;
    shiftQueue();

    if (closingEntry) {
      invokeAlertServiceClosed(closingEntry, reason);
    }

    triggerIdleHandler();
    return;
  }

  const index = alertServiceState.queue.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return;
  }

  dismissQueuedEntryByIndex(index, reason);
}

export function requestCloseAlertServiceEntry(id: string) {
  const entry = getEntryById(id);

  if (!entry) {
    return;
  }

  invokeAlertBeforeClose(entry.beforeClose, () => {
    dismissAlertServiceEntry(id, "manual");
  });
}

export function updateAlertServiceEntry(id: string, patch: AlertServiceUpdateOptions) {
  const entry = getEntryById(id);

  if (!entry) {
    return;
  }

  patchAlertServiceEntry(entry, patch);
}

export function clearAlertServiceEntries() {
  const currentEntry = alertServiceState.current;
  const queuedEntries = [...alertServiceState.queue];

  alertServiceState.current = null;
  alertServiceState.queue.splice(0, alertServiceState.queue.length);
  triggerCurrentChangeHandler();

  if (currentEntry) {
    invokeAlertServiceClosed(currentEntry, "close-all");
  }

  queuedEntries.forEach((entry) => {
    invokeAlertServiceClosed(entry, "close-all");
  });

  triggerIdleHandler();
}
