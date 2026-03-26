<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const fullscreen = ref(false);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="open = true">打开工作台对话框</xy-button>
      <xy-switch v-model="fullscreen" />
      <xy-tag status="primary">{{ fullscreen ? "全屏模式" : "普通模式" }}</xy-tag>
    </xy-space>

    <xy-dialog
      v-model="open"
      v-model:fullscreen="fullscreen"
      title="工作台视图"
      maximizable
      width="720px"
    >
      <div class="xy-doc-stack">
        <p>增强计划里会把 `fullscreen` 和 `maximizable` 打通成统一的窗口操作体验。</p>
        <p>当前示例用外部开关模拟最大化状态，方便先确认布局和内容组织方式。</p>
      </div>

      <template #footer>
        <xy-space>
          <xy-button plain @click="fullscreen = !fullscreen">
            {{ fullscreen ? "还原" : "切换全屏" }}
          </xy-button>
          <xy-button type="primary" @click="open = false">完成</xy-button>
        </xy-space>
      </template>
    </xy-dialog>
  </div>
</template>

