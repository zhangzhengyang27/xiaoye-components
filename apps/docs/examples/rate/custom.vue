<script setup lang="ts">
import { ref } from "vue"

const satisfaction = ref(4)
const readonlyScore = ref(3.5)
</script>

<template>
  <xy-space align="left" direction="vertical" size="lg">
    <xy-rate v-model="satisfaction" allow-half :colors="['#94a3b8', '#ec4899', '#e11d48']"
      :icons="['mdi:heart', 'mdi:heart', 'mdi:heart']" void-icon="mdi:heart-outline" show-score
      score-template="满意度 {value}" />

    <xy-rate v-model="readonlyScore" allow-half disabled :colors="['#94a3b8', '#f59e0b', '#f97316']"
      disabled-void-color="#d6deeb" show-score score-template="只读均分 {value}" />
  </xy-space>
</template>