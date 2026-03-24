<script setup lang="ts">
import { ref } from "vue";

const value = ref("08:45");
</script>

<template>
  <div style="width: 100%; max-width: 320px;">
    <xy-time-picker
      v-model="value"
      format="HH:mm"
      :disabled-hours="() => [0, 1, 2, 3, 4, 5, 6]"
    />
  </div>
</template>
