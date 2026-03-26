<script setup lang="ts">
import { computed } from "vue";
import { useNamespace } from "@xiaoye/composables";
import AlertComponent from "./alert.vue";
import {
  alertServiceState,
  dismissAlertServiceEntry
} from "./service-state";

const ns = useNamespace("alert");
const currentEntryProps = computed(() => {
  if (!alertServiceState.current) {
    return null;
  }

  const {
    id: _id,
    appendTo: _appendTo,
    groupKey: _groupKey,
    maxQueue: _maxQueue,
    onClosed: _onClosed,
    overflowStrategy: _overflowStrategy,
    renderKey: _renderKey,
    ...props
  } = alertServiceState.current;

  return props;
});
const currentEntryRenderKey = computed(() => {
  if (!alertServiceState.current) {
    return "";
  }

  return `${alertServiceState.current.id}-${alertServiceState.current.renderKey}`;
});

function dismissCurrent() {
  if (!alertServiceState.current) {
    return;
  }

  dismissAlertServiceEntry(alertServiceState.current.id, "manual");
}

function dismissCurrentByAutoClose() {
  if (!alertServiceState.current) {
    return;
  }

  dismissAlertServiceEntry(alertServiceState.current.id, "auto");
}
</script>

<template>
  <div
    :class="`${ns.base.value}-service`"
    aria-live="polite"
    aria-atomic="true"
  >
    <AlertComponent
      v-if="alertServiceState.current && currentEntryProps"
      :key="currentEntryRenderKey"
      v-bind="currentEntryProps"
      :variant="'banner'"
      :class="`${ns.base.value}-service__item`"
      @close="dismissCurrent"
      @auto-close="dismissCurrentByAutoClose"
    />
  </div>
</template>
