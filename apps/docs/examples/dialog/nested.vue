<script setup lang="ts">
import { ref } from "vue";

const outerOpen = ref(false);
const innerOpen = ref(false);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button type="primary" @click="outerOpen = true">打开外层对话框</xy-button>

    <xy-dialog v-model="outerOpen" title="批量发布向导" width="640px">
      <div class="xy-doc-stack">
        <p>外层用于承载主流程，内层适合做额外确认或补充说明。</p>
        <xy-button plain @click="innerOpen = true">打开内层确认</xy-button>
      </div>

      <template #footer>
        <xy-space>
          <xy-button plain @click="outerOpen = false">关闭外层</xy-button>
          <xy-button type="primary">继续下一步</xy-button>
        </xy-space>
      </template>
    </xy-dialog>

    <xy-dialog
      v-model="innerOpen"
      title="再次确认"
      append-to-body
      width="420px"
    >
      <p>嵌套时推荐把内层 teleport 到 body，避免被父层布局和层级影响。</p>

      <template #footer>
        <xy-space>
          <xy-button plain @click="innerOpen = false">取消</xy-button>
          <xy-button type="danger" @click="innerOpen = false">确认继续</xy-button>
        </xy-space>
      </template>
    </xy-dialog>
  </div>
</template>

