<script setup lang="ts">
import { ref } from "vue";

const checked = ref(true);
</script>

<template>
  <div class="demo-check-card-basic">
    <xy-check-card
      v-model="checked"
      title="审批工作台"
      description="适合承接卡片式入口选择、状态切换和方案对比。"
      :avatar="{ text: '审', shape: 'square' }"
      :tag="{ text: checked ? '已启用' : '未启用', props: { status: checked ? 'success' : 'neutral', round: true } }"
      extra="查看详情"
    />

    <xy-tag :status="checked ? 'success' : 'warning'" round>
      当前状态：{{ checked ? "选中" : "未选中" }}
    </xy-tag>
  </div>
</template>

<style scoped>
.demo-check-card-basic {
  display: grid;
  gap: 16px;
}
</style>
