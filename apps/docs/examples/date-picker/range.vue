<script setup lang="ts">
import { ref } from "vue";

const value = ref<[string, string] | null>(["2026-03-22", "2026-03-28"]);
</script>

<template>
  <xy-date-picker v-model="value" type="daterange" clearable />
</template>
