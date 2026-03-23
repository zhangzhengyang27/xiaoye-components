<script setup lang="ts">
import { ref } from "vue";

const quantity = ref(3);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-input-number v-model="quantity" :min="1" :max="9" />
      <xy-input-number :min="0" :max="100" :step="5" placeholder="按 5 递增" />
      <xy-input-number :model-value="12" :controls="false" align="left" />
    </xy-space>
    <xy-tag status="primary">当前数量：{{ quantity }}</xy-tag>
  </div>
</template>
