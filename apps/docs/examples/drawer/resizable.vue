<script setup lang="ts">
import { ref } from "vue";
import type { DrawerDirection } from "xiaoye-components";

const open = ref(false);
const direction = ref<DrawerDirection>("rtl");
const currentSize = ref<number | null>(null);

function handleResize(_: MouseEvent, size: number) {
  currentSize.value = size;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="open = true">打开可拖拽抽屉</xy-button>
      <xy-button plain @click="direction = 'rtl'">右侧</xy-button>
      <xy-button plain @click="direction = 'ltr'">左侧</xy-button>
      <xy-button plain @click="direction = 'ttb'">顶部</xy-button>
      <xy-button plain @click="direction = 'btt'">底部</xy-button>
    </xy-space>

    <xy-space wrap>
      <xy-tag status="primary">direction={{ direction }}</xy-tag>
      <xy-tag status="neutral">最近一次尺寸：{{ currentSize ?? "未拖拽" }}</xy-tag>
    </xy-space>

    <xy-drawer
      v-model="open"
      title="可拖拽面板"
      :direction="direction"
      :size="direction === 'ttb' || direction === 'btt' ? 280 : 360"
      resizable
      @resize-start="handleResize"
      @resize="handleResize"
      @resize-end="handleResize"
    >
      <div class="xy-doc-stack">
        <p>拖动抽屉边缘可以实时调整尺寸，关闭后会保留本次拖拽结果。</p>
        <p>当你重新传入 `size` 或切换方向时，会回到新的受控尺寸。</p>
      </div>
    </xy-drawer>
  </div>
</template>
