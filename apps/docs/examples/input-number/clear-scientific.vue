<script setup lang="ts">
import { ref } from "vue";

const budget = ref(128);
const ratio = ref(0.35);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-input-number
        v-model="budget"
        :min="10"
        :step="10"
        value-on-clear="min"
        placeholder="清空后回写最小值"
      />
      <xy-input-number
        v-model="ratio"
        :step="0.05"
        :precision="2"
        disabled-scientific
        placeholder="禁用科学计数法"
      />
    </xy-space>

    <xy-space wrap>
      <xy-tag status="primary">预算：{{ budget }}</xy-tag>
      <xy-tag>比例：{{ ratio }}</xy-tag>
    </xy-space>
  </div>
</template>
