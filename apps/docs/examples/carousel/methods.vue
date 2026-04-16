<script setup lang="ts">
import { ref } from "vue";

const carouselRef = ref<{
  activeIndex: number;
  prev: () => void;
  next: () => void;
  setActiveItem: (index: number | string) => void;
} | null>(null);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="carouselRef?.prev()">prev()</xy-button>
      <xy-button plain @click="carouselRef?.next()">next()</xy-button>
      <xy-button plain @click="carouselRef?.setActiveItem(2)">setActiveItem(2)</xy-button>
      <xy-button plain @click="carouselRef?.setActiveItem('final')"
        >setActiveItem('final')</xy-button
      >
    </xy-space>

    <xy-carousel ref="carouselRef" :autoplay="false" height="220px">
      <xy-carousel-item name="first">
        <div class="demo-carousel-method">A</div>
      </xy-carousel-item>
      <xy-carousel-item name="middle">
        <div class="demo-carousel-method demo-carousel-method--middle">B</div>
      </xy-carousel-item>
      <xy-carousel-item name="final">
        <div class="demo-carousel-method demo-carousel-method--final">C</div>
      </xy-carousel-item>
    </xy-carousel>

    <xy-space>
      <xy-tag status="primary">当前索引：{{ carouselRef?.activeIndex ?? 0 }}</xy-tag>
    </xy-space>
  </div>
</template>

<style scoped>
.demo-carousel-method {
  --demo-carousel-accent: var(--xy-color-primary);
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--demo-carousel-accent) 18%, var(--xy-border-color));
  background:
    linear-gradient(
      155deg,
      color-mix(in srgb, var(--demo-carousel-accent) 14%, white),
      transparent 46%
    ),
    color-mix(in srgb, var(--xy-bg-color-overlay) 88%, white);
  color: var(--xy-text-color);
  font-size: 28px;
  font-weight: 800;
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 72%, transparent);
}

.demo-carousel-method--middle {
  --demo-carousel-accent: var(--xy-color-success);
}

.demo-carousel-method--final {
  --demo-carousel-accent: var(--xy-color-warning);
}
</style>
