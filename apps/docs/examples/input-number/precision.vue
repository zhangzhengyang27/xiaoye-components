<script setup lang="ts">
import { ref } from "vue";

const rate = ref(0.35);
const amount = ref(125.5);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-input-number
        v-model="rate"
        :step="0.05"
        :precision="2"
        step-strictly
        :min="0"
        :max="1"
      />
      <xy-input-number
        v-model="amount"
        :step="0.5"
        :precision="1"
        value-on-clear="min"
        :min="0"
        controls-position="right"
      />
    </xy-space>
    <xy-space wrap>
      <xy-tag status="primary">折扣系数：{{ rate }}</xy-tag>
      <xy-tag>预算金额：{{ amount }}</xy-tag>
    </xy-space>
  </div>
</template>
