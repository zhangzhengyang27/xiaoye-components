<script setup lang="ts">
import { ref } from "vue";

const stock = ref(18);
const threshold = ref(72);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-input-number
        v-model="stock"
        controls-position="right"
        align="right"
        :min="0"
        :max="99"
      />
      <xy-input-number
        v-model="threshold"
        size="lg"
        controls-position="right"
        align="center"
        :step="2"
      />
    </xy-space>
    <xy-space wrap>
      <xy-tag status="primary">库存预警：{{ stock }}</xy-tag>
      <xy-tag>补货阈值：{{ threshold }}</xy-tag>
    </xy-space>
  </div>
</template>
