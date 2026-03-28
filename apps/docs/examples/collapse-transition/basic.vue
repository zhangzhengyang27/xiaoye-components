<script setup lang="ts">
import { ref } from "vue";

const open = ref(true);
</script>

<template>
  <div class="demo-collapse-transition">
    <xy-button type="primary" @click="open = !open">
      {{ open ? "收起说明" : "展开说明" }}
    </xy-button>

    <xy-collapse-transition>
      <div v-if="open" class="demo-collapse-transition__body">
        <xy-text tag="strong">发布提示</xy-text>
        <xy-text size="sm" type="info">
          折叠过渡适合包裹高度不固定的内容块，比如说明面板、补充设置和表单高级选项。
        </xy-text>
      </div>
    </xy-collapse-transition>
  </div>
</template>

<style scoped>
.demo-collapse-transition {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-collapse-transition__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px 16px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 16px;
  background: color-mix(in srgb, var(--xy-primary-color) 6%, white);
}
</style>
