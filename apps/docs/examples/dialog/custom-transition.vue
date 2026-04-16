<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);

const transition = {
  name: "demo-dialog-custom-transition__zoom",
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
      panel-class="demo-dialog-custom-transition__panel"
      width="520px"
    >
      <p>这里使用对象形式的 `transition`，便于和自定义过渡类名或 hook 一起工作。</p>
    </xy-dialog>
  </div>
</template>

<style scoped>
.demo-dialog-custom-transition__zoom-enter-active,
.demo-dialog-custom-transition__zoom-leave-active {
  transition: opacity 0.24s ease;
}

:global(.demo-dialog-custom-transition__zoom-enter-active .demo-dialog-custom-transition__panel),
:global(.demo-dialog-custom-transition__zoom-leave-active .demo-dialog-custom-transition__panel) {
  transition:
    transform 0.24s ease,
    opacity 0.24s ease;
}

.demo-dialog-custom-transition__zoom-enter-from,
.demo-dialog-custom-transition__zoom-leave-to {
  opacity: 0;
}

:global(.demo-dialog-custom-transition__zoom-enter-from .demo-dialog-custom-transition__panel),
:global(.demo-dialog-custom-transition__zoom-leave-to .demo-dialog-custom-transition__panel) {
  transform: scale(0.92);
  opacity: 0;
}
</style>
