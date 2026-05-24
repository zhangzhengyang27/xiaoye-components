<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <!-- 气泡卡片基础用法：展示点击触发的富内容浮层 -->
  <div class="demo-popover-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-popover-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>点击触发</xy-tag>
        </div>
        <p class="demo-popover-basic__description">
          气泡卡片支持更丰富的内容展示，适合解释性信息和操作入口。
        </p>
      </template>

      <xy-popover v-model="open" title="筛选说明">
        <template #trigger>
          <xy-button plain>点击打开 Popover</xy-button>
        </template>
        <div class="demo-popover-basic__content">
          <p>如果你需要解释筛选逻辑、权限差异或数据范围，Popover 比 Tooltip 更合适。</p>
          <xy-button text @click="open = false">知道了</xy-button>
        </div>
      </xy-popover>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-popover-basic {
  max-width: 480px;
}

.demo-popover-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-popover-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-popover-basic__content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-popover-basic__content p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.6;
}
</style>
