<script setup lang="ts">
import { ref } from "vue";

const value = ref("可通过 ref 控制");
const inputRef = ref<{
  focus: () => void;
  blur: () => void;
  select: () => void;
  clear: () => void;
} | null>(null);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="inputRef?.focus()">focus()</xy-button>
      <xy-button plain @click="inputRef?.blur()">blur()</xy-button>
      <xy-button plain @click="inputRef?.select()">select()</xy-button>
      <xy-button type="primary" @click="inputRef?.clear()">clear()</xy-button>
    </xy-space>

    <xy-input ref="inputRef" v-model="value" clearable placeholder="点击上方按钮体验 expose 方法" />
  </div>
</template>
