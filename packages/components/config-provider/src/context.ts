import { computed, shallowRef } from "vue";
import type { ComputedRef, InjectionKey, MaybeRef } from "vue";
import type { ComponentSize } from "@xiaoye/utils";
import type { DialogGlobalConfig } from "../../dialog/src/dialog";
import type { LoadingGlobalConfig } from "../../loading/src/types";
import type { MessageGlobalConfig } from "../../message/src/message";
import type { NotificationGlobalConfig } from "../../notification/src/notification";

export interface ConfigProviderContext {
  namespace: ComputedRef<string>;
  locale: ComputedRef<Record<string, string>>;
  zIndex: ComputedRef<number>;
  size: ComputedRef<ComponentSize>;
  dialog: ComputedRef<DialogGlobalConfig>;
  loading: ComputedRef<LoadingGlobalConfig>;
  message: ComputedRef<MessageGlobalConfig>;
  notification: ComputedRef<NotificationGlobalConfig>;
}

export interface ConfigProviderProps {
  namespace?: string;
  locale?: Record<string, string>;
  zIndex?: number;
  size?: ComponentSize;
  dialog?: DialogGlobalConfig;
  loading?: LoadingGlobalConfig;
  message?: MessageGlobalConfig;
  notification?: NotificationGlobalConfig;
}

export const configProviderKey: InjectionKey<ConfigProviderContext> =
  Symbol("xiaoye-config-provider");

export const DEFAULT_NAMESPACE = "xy";
export const DEFAULT_Z_INDEX = 2000;
export const DEFAULT_SIZE: ComponentSize = "md";

export function resolveMaybeRef<T>(value: MaybeRef<T>) {
  return value;
}

export function createConfigProviderContext(options: ConfigProviderProps = {}): ConfigProviderContext {
  return {
    namespace: computed(() => options.namespace ?? DEFAULT_NAMESPACE),
    locale: computed(() => options.locale ?? {}),
    zIndex: computed(() => options.zIndex ?? DEFAULT_Z_INDEX),
    size: computed(() => options.size ?? DEFAULT_SIZE),
    dialog: computed(() => options.dialog ?? {}),
    loading: computed(() => options.loading ?? {}),
    message: computed(() => options.message ?? {}),
    notification: computed(() => options.notification ?? {})
  };
}

const globalDialogConfigRegistry = new Map<string, DialogGlobalConfig>();
const globalDialogConfigState = shallowRef<DialogGlobalConfig>({});
const globalLoadingConfigRegistry = new Map<string, LoadingGlobalConfig>();
const globalLoadingConfigState = shallowRef<LoadingGlobalConfig>({});
const globalMessageConfigRegistry = new Map<string, MessageGlobalConfig>();
const globalMessageConfigState = shallowRef<MessageGlobalConfig>({});
const globalNotificationConfigRegistry = new Map<string, NotificationGlobalConfig>();
const globalNotificationConfigState = shallowRef<NotificationGlobalConfig>({});

function syncGlobalDialogConfigState() {
  const firstEntry = globalDialogConfigRegistry.entries().next();
  globalDialogConfigState.value = firstEntry.done ? {} : firstEntry.value[1];
}

function syncGlobalMessageConfigState() {
  const firstEntry = globalMessageConfigRegistry.entries().next();
  globalMessageConfigState.value = firstEntry.done ? {} : firstEntry.value[1];
}

function syncGlobalLoadingConfigState() {
  const firstEntry = globalLoadingConfigRegistry.entries().next();
  globalLoadingConfigState.value = firstEntry.done ? {} : firstEntry.value[1];
}

function syncGlobalNotificationConfigState() {
  const firstEntry = globalNotificationConfigRegistry.entries().next();
  globalNotificationConfigState.value = firstEntry.done ? {} : firstEntry.value[1];
}

export function registerGlobalDialogConfig(id: string, value: DialogGlobalConfig) {
  globalDialogConfigRegistry.set(id, value);
  syncGlobalDialogConfigState();
}

export function updateGlobalDialogConfig(id: string, value: DialogGlobalConfig) {
  globalDialogConfigRegistry.set(id, value);
  syncGlobalDialogConfigState();
}

export function unregisterGlobalDialogConfig(id: string) {
  globalDialogConfigRegistry.delete(id);
  syncGlobalDialogConfigState();
}

export function getGlobalDialogConfig() {
  return globalDialogConfigState;
}

export function registerGlobalLoadingConfig(id: string, value: LoadingGlobalConfig) {
  globalLoadingConfigRegistry.set(id, value);
  syncGlobalLoadingConfigState();
}

export function updateGlobalLoadingConfig(id: string, value: LoadingGlobalConfig) {
  globalLoadingConfigRegistry.set(id, value);
  syncGlobalLoadingConfigState();
}

export function unregisterGlobalLoadingConfig(id: string) {
  globalLoadingConfigRegistry.delete(id);
  syncGlobalLoadingConfigState();
}

export function getGlobalLoadingConfig() {
  return globalLoadingConfigState;
}

export function registerGlobalMessageConfig(id: string, value: MessageGlobalConfig) {
  globalMessageConfigRegistry.set(id, value);
  syncGlobalMessageConfigState();
}

export function updateGlobalMessageConfig(id: string, value: MessageGlobalConfig) {
  globalMessageConfigRegistry.set(id, value);
  syncGlobalMessageConfigState();
}

export function unregisterGlobalMessageConfig(id: string) {
  globalMessageConfigRegistry.delete(id);
  syncGlobalMessageConfigState();
}

export function getGlobalMessageConfig() {
  return globalMessageConfigState;
}

export function getGlobalMessageConfigCount() {
  return globalMessageConfigRegistry.size;
}

export function registerGlobalNotificationConfig(id: string, value: NotificationGlobalConfig) {
  globalNotificationConfigRegistry.set(id, value);
  syncGlobalNotificationConfigState();
}

export function updateGlobalNotificationConfig(id: string, value: NotificationGlobalConfig) {
  globalNotificationConfigRegistry.set(id, value);
  syncGlobalNotificationConfigState();
}

export function unregisterGlobalNotificationConfig(id: string) {
  globalNotificationConfigRegistry.delete(id);
  syncGlobalNotificationConfigState();
}

export function getGlobalNotificationConfig() {
  return globalNotificationConfigState;
}

export function getGlobalNotificationConfigCount() {
  return globalNotificationConfigRegistry.size;
}
