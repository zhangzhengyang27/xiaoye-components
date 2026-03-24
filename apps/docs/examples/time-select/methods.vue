<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | null>("13:30");
const timeSelectRef = ref<{
  focus: () => void;
  blur: () => Promise<void>;
  open: () => Promise<void>;
  close: () => Promise<void>;
} | null>(null);

async function openPanel() {
  await timeSelectRef.value?.open();
}

async function closePanel() {
  await timeSelectRef.value?.close();
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="timeSelectRef?.focus()">focus()</xy-button>
      <xy-button plain @click="timeSelectRef?.blur()">blur()</xy-button>
      <xy-button plain @click="openPanel">open()</xy-button>
      <xy-button plain @click="closePanel">close()</xy-button>
    </xy-space>

    <div style="width: 320px; max-width: 100%">
      <xy-time-select
        ref="timeSelectRef"
        v-model="value"
        clearable
        start="08:30"
        end="18:30"
        step="00:30"
      />
    </div>

    <xy-space>
      <xy-tag status="primary">当前时间：{{ value ?? "未选择" }}</xy-tag>
    </xy-space>
  </div>
</template>
