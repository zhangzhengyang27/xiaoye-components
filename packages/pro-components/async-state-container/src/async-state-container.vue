<script setup lang="ts">
import { XyButton, XyEmpty, XyText } from "@xiaoye/components";
import type { AsyncStateContainerProps } from "./async-state-container";

defineOptions({
  name: "XyAsyncStateContainer"
});

const props = withDefaults(defineProps<AsyncStateContainerProps>(), {
  loading: false,
  error: null,
  empty: false,
  emptyTitle: "暂无数据",
  emptyDescription: "当前条件下没有可展示的内容。",
  loadingText: "正在加载数据"
});

const emit = defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div class="xy-async-state-container">
    <slot v-if="props.loading" name="loading">
      <div class="xy-async-state-container__state is-loading">
        <strong>{{ props.loadingText }}</strong>
      </div>
    </slot>
    <slot v-else-if="props.error" name="error" :error="props.error">
      <div class="xy-async-state-container__state is-error">
        <strong>加载失败</strong>
        <xy-text type="danger">{{ props.error }}</xy-text>
        <xy-button type="primary" plain @click="emit('retry')">重新加载</xy-button>
      </div>
    </slot>
    <slot v-else-if="props.empty" name="empty">
      <div class="xy-async-state-container__state is-empty">
        <xy-empty :title="props.emptyTitle" :description="props.emptyDescription" />
      </div>
    </slot>
    <slot v-else />
  </div>
</template>
