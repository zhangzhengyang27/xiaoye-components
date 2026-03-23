<script setup lang="ts">
import { ref } from "vue"

const textScore = ref(4)
const averageScore = ref(3.5)
</script>

<template>
  <xy-space align="left" direction="vertical" size="lg">
    <xy-space align="center">
      <xy-rate v-model="textScore" show-text :texts="['很差', '较差', '一般', '满意', '推荐']" />
      <xy-tag status="success">口碑文案联动</xy-tag>
    </xy-space>

    <xy-space align="center">
      <xy-rate v-model="averageScore" allow-half show-score score-template="综合得分 {value}" />
      <xy-text>适合看板里的平均分展示</xy-text>
    </xy-space>
  </xy-space>
</template>