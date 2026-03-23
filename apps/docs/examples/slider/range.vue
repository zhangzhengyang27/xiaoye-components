<script setup lang="ts">
import { ref } from "vue";

const range = ref<[number, number]>([18, 72]);
</script>

<template>
  <div style="display: grid; gap: 14px; width: 100%; max-width: 420px;">
    <xy-slider v-model="range" range />
    <xy-text>区间：{{ range[0] }} - {{ range[1] }}</xy-text>
  </div>
</template>
