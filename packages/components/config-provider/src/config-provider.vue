<script setup lang="ts">
import { computed, onBeforeUnmount, provide, watch } from "vue";
import type { ConfigProviderProps } from "./context";
import {
  configProviderKey,
  registerGlobalDialogConfig,
  registerGlobalLoadingConfig,
  registerGlobalMessageConfig,
  registerGlobalNotificationConfig,
  unregisterGlobalDialogConfig,
  unregisterGlobalLoadingConfig,
  unregisterGlobalMessageConfig,
  unregisterGlobalNotificationConfig,
  updateGlobalDialogConfig,
  updateGlobalLoadingConfig,
  updateGlobalMessageConfig,
  updateGlobalNotificationConfig
} from "./context";

const props = withDefaults(defineProps<ConfigProviderProps>(), {
  namespace: "xy",
  locale: () => ({}),
  zIndex: 2000,
  size: "md",
  dialog: () => ({}),
  loading: () => ({}),
  message: () => ({}),
  notification: () => ({})
});

const globalConfigId = `xy-config-provider-${Math.random().toString(36).slice(2, 10)}`;

provide(configProviderKey, {
  namespace: computed(() => props.namespace),
  locale: computed(() => props.locale),
  zIndex: computed(() => props.zIndex),
  size: computed(() => props.size),
  dialog: computed(() => props.dialog),
  loading: computed(() => props.loading),
  message: computed(() => props.message),
  notification: computed(() => props.notification)
});

registerGlobalDialogConfig(globalConfigId, props.dialog);
registerGlobalLoadingConfig(globalConfigId, props.loading);
registerGlobalMessageConfig(globalConfigId, props.message);
registerGlobalNotificationConfig(globalConfigId, props.notification);

watch(
  () => props.dialog,
  (value) => {
    updateGlobalDialogConfig(globalConfigId, value);
  },
  {
    deep: true
  }
);

watch(
  () => props.loading,
  (value) => {
    updateGlobalLoadingConfig(globalConfigId, value);
  },
  {
    deep: true
  }
);

watch(
  () => props.message,
  (value) => {
    updateGlobalMessageConfig(globalConfigId, value);
  },
  {
    deep: true
  }
);

watch(
  () => props.notification,
  (value) => {
    updateGlobalNotificationConfig(globalConfigId, value);
  },
  {
    deep: true
  }
);

onBeforeUnmount(() => {
  unregisterGlobalDialogConfig(globalConfigId);
  unregisterGlobalLoadingConfig(globalConfigId);
  unregisterGlobalMessageConfig(globalConfigId);
  unregisterGlobalNotificationConfig(globalConfigId);
});
</script>

<template>
  <div :class="`${props.namespace}-provider`">
    <slot />
  </div>
</template>
