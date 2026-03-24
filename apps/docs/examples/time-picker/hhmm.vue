<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | null>("09:30");
const presets = ["08:00", "09:30", "17:45"] as const;
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button v-for="preset in presets" :key="preset" plain @click="value = preset">
        {{ preset }}
      </xy-button>
      <xy-button plain @click="value = null">清空值</xy-button>
    </xy-space>

    <div style="width: 100%; max-width: 320px">
      <xy-time-picker v-model="value" format="HH:mm" clearable />
    </div>

    <xy-space>
      <xy-tag status="primary">当前回写：{{ value ?? "未选择" }}</xy-tag>
    </xy-space>
  </div>
</template>
