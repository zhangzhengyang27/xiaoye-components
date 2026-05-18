<script setup lang="ts">
import { ref } from "vue";

// 功能开关状态：默认开启
const isFeatureEnabled = ref(true);
</script>

<template>
  <!-- 开关基础用法：展示带文字描述的双向绑定和状态反馈 -->
  <div class="xy-doc-stack">
    <xy-switch v-model="isFeatureEnabled" active-text="已启用" inactive-text="已停用" />
    <xy-tag :status="isFeatureEnabled ? 'success' : 'warning'">
      {{ isFeatureEnabled ? "✅ 当前功能已启用" : "⚠️ 当前功能已停用" }}
    </xy-tag>
  </div>
</template>
