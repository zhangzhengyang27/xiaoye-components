<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | null>("15:20:18");

function disabledHours() {
  return [0, 1, 2, 3, 4, 5, 6, 12, 13, 22, 23];
}

function disabledMinutes(hour: number) {
  if (hour === 9) {
    return Array.from({ length: 20 }, (_, index) => index);
  }

  if (hour === 18) {
    return Array.from({ length: 30 }, (_, index) => index + 30);
  }

  return [];
}

function disabledSeconds(hour: number, minute: number) {
  if (hour === 15 && minute === 20) {
    return Array.from({ length: 40 }, (_, index) => index + 20);
  }

  return [];
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-tag status="warning">12:00 - 13:59 午休不可选</xy-tag>
      <xy-tag status="warning">09:00 - 09:19 禁用分钟</xy-tag>
      <xy-tag status="warning">15:20:20 之后禁用秒</xy-tag>
    </xy-space>

    <div style="width: 100%; max-width: 340px">
      <xy-time-picker
        v-model="value"
        clearable
        :disabled-hours="disabledHours"
        :disabled-minutes="disabledMinutes"
        :disabled-seconds="disabledSeconds"
      />
    </div>

    <xy-space>
      <xy-tag status="primary">当前时间：{{ value ?? "未选择" }}</xy-tag>
    </xy-space>
  </div>
</template>
