<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const overflow = ref(false);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="open = true">打开可拖拽对话框</xy-button>
      <xy-switch v-model="overflow" />
      <xy-tag :status="overflow ? 'warning' : 'success'">
        {{ overflow ? "允许拖出视口" : "限制在视口内" }}
      </xy-tag>
    </xy-space>

    <xy-dialog
      v-model="open"
      title="拖动头部试试看"
      draggable
      :overflow="overflow"
      width="560px"
    >
      <p>默认只允许拖动头部区域；如果开启 `overflow`，可以把 dialog 拖到视口边界之外。</p>
    </xy-dialog>
  </div>
</template>

