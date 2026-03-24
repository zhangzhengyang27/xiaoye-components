<script setup lang="ts">
import { ref } from "vue";

const checked = ref(false);
const switchRef = ref<{
  focus: () => void;
  checked: boolean;
} | null>(null);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="switchRef?.focus()">聚焦开关</xy-button>
      <xy-tag :status="switchRef?.checked ? 'success' : 'warning'">
        expose.checked：{{ switchRef?.checked ? "true" : "false" }}
      </xy-tag>
    </xy-space>

    <xy-switch
      ref="switchRef"
      v-model="checked"
      aria-label="通知开关"
      active-text="通知已开启"
      inactive-text="通知已关闭"
    />

    <xy-text size="sm">
      先点击“聚焦开关”，然后可直接用键盘 <kbd>Space</kbd> 或 <kbd>Enter</kbd> 切换状态。
    </xy-text>
  </div>
</template>
