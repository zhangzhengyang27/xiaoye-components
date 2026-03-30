<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | null>(null);
const shortcuts = [
  { label: "今天", value: "2026-03-28" },
  { label: "明天", value: "2026-03-29" }
];
</script>

<template>
  <xy-date-picker v-model="value" :shortcuts="shortcuts" clearable />
</template>
