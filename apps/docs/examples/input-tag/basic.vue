<script setup lang="ts">
import { ref } from "vue";

const tags = ref(["Vue", "组件库"]);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-input-tag v-model="tags" placeholder="输入后按回车添加标签" clearable />
    <xy-space wrap>
      <xy-tag v-for="tag in tags" :key="tag" status="primary" round>{{ tag }}</xy-tag>
    </xy-space>
  </div>
</template>
