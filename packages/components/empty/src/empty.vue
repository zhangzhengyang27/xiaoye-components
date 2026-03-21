<script setup lang="ts">
import { useNamespace } from "@xiaoye/composables";

export interface EmptyProps {
  title?: string;
  description?: string;
}

const props = withDefaults(defineProps<EmptyProps>(), {
  title: "暂无数据",
  description: "这里还没有可展示的内容"
});

const ns = useNamespace("empty");
</script>

<template>
  <div :class="ns.base.value">
    <div class="xy-empty__illustration">
      <span />
      <span />
      <span />
    </div>
    <strong class="xy-empty__title">{{ props.title }}</strong>
    <p class="xy-empty__description">{{ props.description }}</p>
    <div v-if="$slots.default" class="xy-empty__footer">
      <slot />
    </div>
  </div>
</template>

