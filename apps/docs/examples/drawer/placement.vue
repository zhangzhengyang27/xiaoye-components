<script setup lang="ts">
import { ref } from "vue";

const leftOpen = ref(false);
const rightOpen = ref(false);
const topOpen = ref(false);
const bottomOpen = ref(false);
</script>

<template>
  <!-- 抽屉弹出位置：展示四个方向弹出的抽屉 -->
  <div class="demo-drawer-placement">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-drawer-placement__header">
          <strong>弹出位置</strong>
          <xy-tag status="neutral" round>Placement</xy-tag>
        </div>
        <p class="demo-drawer-placement__description">
          抽屉支持从左、右、上、下四个方向弹出，适应不同场景。
        </p>
      </template>

      <xy-space wrap>
        <xy-button plain @click="leftOpen = true">左侧抽屉</xy-button>
        <xy-button plain @click="rightOpen = true">右侧抽屉</xy-button>
        <xy-button plain @click="topOpen = true">顶部抽屉</xy-button>
        <xy-button plain @click="bottomOpen = true">底部抽屉</xy-button>
      </xy-space>
    </xy-card>

    <xy-drawer v-model="leftOpen" title="左侧导航抽屉" placement="left" size="360px">
      <p>适合侧边说明、目录树或保留上下文的导航面板。</p>
    </xy-drawer>

    <xy-drawer v-model="rightOpen" title="右侧编辑抽屉" placement="right" size="480px">
      <p>适合详情查看和大表单编辑。</p>
    </xy-drawer>

    <xy-drawer v-model="topOpen" title="顶部筛选抽屉" placement="top" size="260px">
      <p>适合顶部筛选、批量筛查和轻量说明层。</p>
    </xy-drawer>

    <xy-drawer v-model="bottomOpen" title="底部说明抽屉" placement="bottom" size="300px">
      <p>适合批处理确认、底部说明和移动端更顺手的弹出方式。</p>
    </xy-drawer>
  </div>
</template>

<style scoped>
.demo-drawer-placement {
  max-width: 640px;
}

.demo-drawer-placement__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-drawer-placement__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
