<script setup lang="ts">
import { ref } from "vue";

const month = ref("2026-03");
const year = ref("2026");
const week = ref("2026-W13");
</script>

<template>
  <xy-space direction="vertical" style="width: 100%">
    <xy-date-picker v-model="month" type="month" />
    <xy-date-picker v-model="year" type="year" />
    <xy-date-picker v-model="week" type="week" />
  </xy-space>
</template>
