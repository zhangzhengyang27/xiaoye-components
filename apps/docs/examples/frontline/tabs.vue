<script setup lang="ts">
import { ref } from "vue";

const current = ref("overview");
const items = [
  { key: "overview", label: "Overview" },
  { key: "motion", label: "Motion" },
  { key: "tokens", label: "Tokens" }
];
</script>

<template>
  <div class="frontline-demo-stack">
    <xy-front-tabs v-model="current" :items="items" variant="underline" />
    <xy-front-tabs :default-value="'overview'" :items="items" variant="pill" />
    <xy-front-tabs :default-value="'overview'" :items="items" variant="segmented" />
  </div>
</template>

<style scoped>
.frontline-demo-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
