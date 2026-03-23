<script setup lang="ts">
import { ref } from "vue";

const packageScore = ref(3.5);
</script>

<template>
  <xy-space align="center" wrap>
    <xy-rate v-model="packageScore" allow-half clearable />
    <xy-tag>支持半星与再次点击清空：{{ packageScore }}</xy-tag>
  </xy-space>
</template>
