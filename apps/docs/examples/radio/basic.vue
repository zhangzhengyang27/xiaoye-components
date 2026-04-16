<script setup lang="ts">
import { ref } from "vue";

const channel = ref<string | number | boolean>("email");
</script>

<template>
  <div class="demo-radio-block">
    <div class="xy-doc-field">
      <xy-radio-group v-model="channel">
        <xy-radio value="email">邮件通知</xy-radio>
        <xy-radio value="sms">短信通知</xy-radio>
        <xy-radio value="webhook">Webhook</xy-radio>
      </xy-radio-group>
    </div>

    <div class="demo-radio-panel">
      当前选择：<strong class="demo-radio-panel__value">{{ channel }}</strong>
    </div>
  </div>
</template>

<style scoped>
.demo-radio-block {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-radio-panel {
  padding: 14px 16px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 16px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 76%, white);
  color: var(--xy-text-color-secondary);
}

.demo-radio-panel__value {
  color: var(--xy-text-color);
}
</style>
