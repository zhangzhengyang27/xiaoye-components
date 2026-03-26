<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);

const transition = {
  name: "xy-dialog-zoom",
  onAfterEnter() {
    console.info("dialog zoom enter");
  }
};
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button @click="open = true">打开自定义动画</xy-button>

    <xy-dialog
      v-model="open"
      title="自定义动画"
      :transition="transition"
      width="520px"
    >
      <p>这里使用对象形式的 `transition`，便于和自定义过渡类名或 hook 一起工作。</p>
    </xy-dialog>
  </div>
</template>

<style scoped>
.xy-dialog-zoom-enter-active,
.xy-dialog-zoom-leave-active {
  transition: opacity 0.24s ease;
}

.xy-dialog-zoom-enter-active :deep(.xy-dialog__panel),
.xy-dialog-zoom-leave-active :deep(.xy-dialog__panel) {
  transition:
    transform 0.24s ease,
    opacity 0.24s ease;
}

.xy-dialog-zoom-enter-from,
.xy-dialog-zoom-leave-to {
  opacity: 0;
}

.xy-dialog-zoom-enter-from :deep(.xy-dialog__panel),
.xy-dialog-zoom-leave-to :deep(.xy-dialog__panel) {
  transform: scale(0.92);
  opacity: 0;
}
</style>

