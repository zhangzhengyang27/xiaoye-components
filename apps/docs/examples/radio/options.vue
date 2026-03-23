<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | number | boolean>("api");
const options = [
  {
    label: "API Token",
    value: "api",
    description: "适合服务间调用、自动化任务和平台级集成。"
  },
  {
    label: "OAuth App",
    value: "oauth",
    description: "适合面向第三方用户的授权登录和访问托管。"
  },
  { label: "Legacy Key", value: "legacy", disabled: true }
];
</script>

<template>
  <div class="demo-radio-options">
    <xy-radio-group v-model="value" :options="options" direction="vertical" />
    <xy-text size="sm" type="info">禁用项不会触发切换，适合表达暂未开放的接入方式。</xy-text>
  </div>
</template>

<style scoped>
.demo-radio-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 420px;
}
</style>
