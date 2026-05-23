<template>
  <div class="select-popper-demo">
    <xy-select
      v-model="value"
      :options="options"
      clearable
      placeholder="选择概览视图"
      popper-class="select-admin-surface"
      :popper-style="{ padding: '6px' }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref('all');

const options = [
  { label: '全部业务线', value: 'all', description: '适合默认概览看板' },
  { label: '待处理工单', value: 'pending', description: '收口高优先级事项' },
  { label: '异常告警', value: 'alert', description: '聚焦风险和波动项' }
];
</script>

<style scoped>
.select-popper-demo {
  max-width: 320px;
}

:global(.select-admin-surface) {
  --xy-select-dropdown-bg: color-mix(in srgb, var(--xy-bg-color-floating) 96%, var(--xy-bg-color-subtle));
  --xy-select-dropdown-border: color-mix(
    in srgb,
    var(--xy-border-color-subtle) 80%,
    var(--xy-border-color)
  );
  --xy-select-dropdown-shadow:
    0 0 0 1px color-mix(in srgb, var(--xy-bg-color-floating) 10%, transparent),
    0 14px 30px color-mix(in srgb, var(--xy-text-color-heading) 7%, transparent);
  --xy-select-option-hover-bg: color-mix(
    in srgb,
    var(--xy-color-primary) 7%,
    var(--xy-bg-color-floating)
  );
  --xy-select-option-selected-bg: color-mix(
    in srgb,
    var(--xy-color-primary) 11%,
    var(--xy-bg-color-floating)
  );
}
</style>
