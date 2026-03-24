<script setup lang="ts">
import { ref } from "vue";

const activeIndex = ref(1);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="activeIndex = 0">切到第 1 页</xy-button>
      <xy-button plain @click="activeIndex = 1">切到第 2 页</xy-button>
      <xy-button plain @click="activeIndex = 2">切到第 3 页</xy-button>
    </xy-space>

    <xy-carousel :active-index="activeIndex" height="220px" @update:activeIndex="activeIndex = $event">
      <xy-carousel-item v-for="item in 3" :key="`controlled-${item}`">
        <div class="demo-carousel-controlled">Page {{ item }}</div>
      </xy-carousel-item>
    </xy-carousel>

    <xy-space>
      <xy-tag status="primary">当前页：{{ activeIndex + 1 }}</xy-tag>
    </xy-space>
  </div>
</template>

<style scoped>
.demo-carousel-controlled {
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #2563eb, #0f766e);
  color: white;
  font-size: 24px;
  font-weight: 700;
}
</style>
