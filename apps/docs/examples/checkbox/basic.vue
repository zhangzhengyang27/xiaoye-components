<script setup lang="ts">
import { ref } from "vue";

const checked = ref(false);
const published = ref<"on" | "off">("off");
</script>

<template>
  <!-- 复选框基础用法：支持双向绑定和自定义选中值 -->
  <div class="demo-checkbox-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-checkbox-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>双向绑定</xy-tag>
        </div>
        <p class="demo-checkbox-basic__description">
          支持布尔值和枚举值的双向绑定，可通过 border 属性添加边框样式。
        </p>
      </template>

      <div class="demo-checkbox-basic__content">
        <xy-space direction="vertical" fill>
          <xy-checkbox v-model="checked">接收通知</xy-checkbox>
          <xy-checkbox v-model="published" true-value="on" false-value="off" border>
            发布到首页
          </xy-checkbox>
        </xy-space>
      </div>

      <template #footer>
        <xy-tag :status="checked ? 'success' : 'neutral'" round>
          通知：{{ checked ? "已开启" : "已关闭" }}，发布：{{ published === "on" ? "已发布" : "未发布" }}
        </xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-checkbox-basic {
  max-width: 480px;
}

.demo-checkbox-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-checkbox-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-checkbox-basic__content {
  padding: 16px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-bg-color-subtle);
}
</style>
