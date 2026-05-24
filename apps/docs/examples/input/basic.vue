<script setup lang="ts">
import { ref } from "vue";

// 搜索关键词：用于演示 Input 组件的双向绑定和值展示
const searchKeyword = ref("");
</script>

<template>
  <!-- 输入框基础用法：展示文本输入、清空按钮、多行文本域三种形态 -->
  <div class="demo-input-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-input-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>双向绑定</xy-tag>
        </div>
        <p class="demo-input-basic__description">
          支持清空、前缀图标、多行输入等常用场景。
        </p>
      </template>

      <div class="demo-input-basic__fields">
        <xy-input v-model="searchKeyword" placeholder="请输入搜索关键字" prefix-icon="mdi:magnify" />
        <xy-input placeholder="支持一键清空" clearable prefix-icon="mdi:close-circle-outline" />
        <xy-input type="textarea" placeholder="支持多行输入" :rows="3" />
      </div>

      <template #footer>
        <xy-tag :status="searchKeyword ? 'primary' : 'neutral'" round>
          当前输入：{{ searchKeyword || "空" }}
        </xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-input-basic {
  max-width: 560px;
}

.demo-input-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-input-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-input-basic__fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
