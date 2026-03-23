<script setup lang="ts">
import { ref } from "vue";

const threshold = ref(40);
</script>

<template>
  <div style="display: grid; gap: 14px; width: 100%; max-width: 520px;">
    <xy-slider v-model="threshold" show-input show-stops :step="10" />
    <xy-tag>输入框和滑块联动：{{ threshold }}</xy-tag>
  </div>
</template>
