<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | null>("13:30");
const quickValues = ["09:30", "13:30", "17:00"] as const;
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
      <xy-button
        v-for="quickValue in quickValues"
        :key="quickValue"
        plain
        @click="value = quickValue"
      >
        回填 {{ quickValue }}
      </xy-button>
      <xy-button plain @click="value = null">清空值</xy-button>
      <xy-button type="primary" @click="openPanel">打开面板</xy-button>
      <xy-button plain @click="closePanel">关闭面板</xy-button>
    </xy-space>

    <div style="width: 320px; max-width: 100%">
      <xy-time-select
        ref="timeSelectRef"
        v-model="value"
        clearable
        start="08:00"
        end="20:00"
        step="00:30"
      />
    </div>

    <xy-space>
      <xy-tag status="success">当前选中：{{ value ?? "未选择" }}</xy-tag>
    </xy-space>
  </div>
</template>
