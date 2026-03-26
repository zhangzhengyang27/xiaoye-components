<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const fullscreen = ref(true);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="open = true">打开全屏抽屉</xy-button>
      <xy-switch v-model="fullscreen" />
      <xy-tag :status="fullscreen ? 'primary' : 'neutral'">
        {{ fullscreen ? "fullscreen=true" : "fullscreen=false" }}
      </xy-tag>
    </xy-space>

    <xy-drawer
      v-model="open"
      title="全屏工作区"
      :fullscreen="fullscreen"
      close-icon="mdi:close-circle-outline"
      :size="420"
    >
      <div class="xy-doc-stack">
        <p>全屏模式会忽略常规 `size`，直接占满视口；更适合复杂流程、长表单和工作台式侧边任务。</p>
        <p>关闭按钮图标可以通过 `close-icon` 自定义，使用方式与 `xy-dialog` 保持一致。</p>
      </div>

      <template #footer>
        <xy-space>
          <xy-button plain @click="open = false">取消</xy-button>
          <xy-button type="primary" @click="open = false">保存工作区</xy-button>
        </xy-space>
      </template>
    </xy-drawer>
  </div>
</template>
