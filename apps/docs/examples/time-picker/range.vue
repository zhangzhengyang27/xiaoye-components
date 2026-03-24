<script setup lang="ts">
import { ref } from "vue";

const value = ref<[string, string] | null>(["09:00", "18:30"]);
</script>

<template>
  <div style="width: 100%; max-width: 420px;">
    <xy-time-picker v-model="value" is-range format="HH:mm" clearable />
  </div>
</template>
