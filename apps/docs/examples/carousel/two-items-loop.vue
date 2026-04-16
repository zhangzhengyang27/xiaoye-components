<script setup lang="ts">
import { computed, ref } from "vue";

const slides = [
  {
    title: "双项循环 A",
    desc: "两项内容开启 loop 后会自动补位，避免来回翻面的生硬感。",
    accent: "var(--xy-color-primary)"
  },
  {
    title: "双项循环 B",
    desc: "对外 activeIndex 和 change 事件仍然保持 0 / 1 这组逻辑索引。",
    accent: "var(--xy-color-danger)"
  }
] as const;

const carouselRef = ref<{
  activeIndex: number;
  prev: () => void;
  next: () => void;
} | null>(null);

const activeLabel = computed(
  () => slides[carouselRef.value?.activeIndex ?? 0]?.title ?? slides[0].title
);
</script>

<template>
  <div class="demo-carousel-two-shell">
    <xy-space wrap>
      <xy-button plain @click="carouselRef?.prev()">prev()</xy-button>
      <xy-button plain @click="carouselRef?.next()">next()</xy-button>
      <xy-tag status="primary">当前逻辑页：{{ activeLabel }}</xy-tag>
      <xy-tag>观察只有两项时的循环衔接</xy-tag>
    </xy-space>

    <xy-carousel
      ref="carouselRef"
      height="220px"
      arrow="always"
      style="--xy-carousel-radius: 18px"
    >
      <xy-carousel-item v-for="slide in slides" :key="slide.title" :label="slide.title">
        <div class="demo-carousel-two" :style="{ '--demo-carousel-accent': slide.accent }">
          <span class="demo-carousel-two__eyebrow">Two Items Loop</span>
          <strong>{{ slide.title }}</strong>
          <p class="demo-carousel-two__description">{{ slide.desc }}</p>
        </div>
      </xy-carousel-item>
    </xy-carousel>
  </div>
</template>

<style scoped>
.demo-carousel-two-shell {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-carousel-two {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10px;
  padding: 24px;
  border: 1px solid color-mix(in srgb, var(--demo-carousel-accent) 16%, var(--xy-border-color));
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--demo-carousel-accent) 18%, white), transparent 38%),
    linear-gradient(160deg, color-mix(in srgb, var(--xy-bg-color-overlay) 92%, white), white);
  color: var(--xy-text-color);
}

.demo-carousel-two__eyebrow {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--demo-carousel-accent) 14%, white);
  color: color-mix(in srgb, var(--demo-carousel-accent) 76%, var(--xy-text-color));
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-carousel-two__description {
  margin: 0;
  max-width: 360px;
  color: var(--xy-text-color-secondary);
}
</style>
