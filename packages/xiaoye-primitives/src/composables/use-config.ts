import { computed, inject } from "vue";
import type { ComputedRef } from "vue";
import {
  configProviderKey,
  DEFAULT_NAMESPACE,
  DEFAULT_SIZE,
  DEFAULT_Z_INDEX,
  type ComponentSize,
  type Locale
} from "./shared-context";

export interface ConfigContext<
  DialogConfig = unknown,
  LoadingConfig = unknown,
  MessageConfig = unknown,
  NotificationConfig = unknown
> {
  namespace: ComputedRef<string>;
  size: ComputedRef<ComponentSize>;
  zIndex: ComputedRef<number>;
  locale: ComputedRef<Locale>;
  dialog: ComputedRef<DialogConfig>;
  loading: ComputedRef<LoadingConfig>;
  message: ComputedRef<MessageConfig>;
  notification: ComputedRef<NotificationConfig>;
}

export function useConfig<
  DialogConfig = unknown,
  LoadingConfig = unknown,
  MessageConfig = unknown,
  NotificationConfig = unknown
>(): ConfigContext<DialogConfig, LoadingConfig, MessageConfig, NotificationConfig> {
  const injectedConfig = inject(configProviderKey, null);

  if (injectedConfig) {
    return injectedConfig as ConfigContext<
      DialogConfig,
      LoadingConfig,
      MessageConfig,
      NotificationConfig
    >;
  }

  return {
    namespace: computed(() => DEFAULT_NAMESPACE),
    size: computed(() => DEFAULT_SIZE),
    zIndex: computed(() => DEFAULT_Z_INDEX),
    locale: computed(() => ({} as Locale)),
    dialog: computed(() => ({}) as DialogConfig),
    loading: computed(() => ({}) as LoadingConfig),
    message: computed(() => ({}) as MessageConfig),
    notification: computed(() => ({}) as NotificationConfig)
  };
}
