<script setup lang="ts">
import { ref } from "vue";

const value = ref("09:30:15");
</script>

<template>
  <div style="width: 100%; max-width: 320px;">
    <xy-time-picker v-model="value" clearable />
  </div>
</template>
