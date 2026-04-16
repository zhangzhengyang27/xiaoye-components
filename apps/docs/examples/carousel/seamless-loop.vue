<script setup lang="ts">
import { computed, ref } from "vue";

const slides = [
  {
    title: "边界无缝 1",
    desc: "自动播放到最后一张后，会直接回到第一张，并保持首尾视觉位置连续。",
    accent: "var(--xy-color-primary)"
  },
  {
    title: "边界无缝 2",
    desc: "边界切换不再额外走收尾轨道，而是按真实索引回绕到下一张。",
    accent: "var(--xy-color-success)"
  },
  {
    title: "边界无缝 3",
    desc: "进度条会在切到新一项后重新开始计时，节奏和普通切换保持一致。",
    accent: "var(--xy-color-warning)"
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
  <div class="demo-carousel-seamless-shell">
    <xy-space wrap>
      <xy-button plain @click="carouselRef?.prev()">prev()</xy-button>
      <xy-button plain @click="carouselRef?.next()">next()</xy-button>
      <xy-tag status="primary">当前页：{{ activeLabel }}</xy-tag>
      <xy-tag>观察末页切回首屏时的位置衔接和进度条重置</xy-tag>
    </xy-space>

    <xy-carousel
      ref="carouselRef"
      height="240px"
      arrow="always"
      show-progress
      style="--xy-carousel-radius: 18px"
    >
      <xy-carousel-item v-for="slide in slides" :key="slide.title">
        <div class="demo-carousel-seamless" :style="{ '--demo-carousel-accent': slide.accent }">
          <span class="demo-carousel-seamless__eyebrow">Seamless Loop</span>
          <strong>{{ slide.title }}</strong>
          <p class="demo-carousel-seamless__description">{{ slide.desc }}</p>
        </div>
      </xy-carousel-item>
    </xy-carousel>
  </div>
</template>

<style scoped>
.demo-carousel-seamless-shell {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-carousel-seamless {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10px;
  padding: 28px;
  border: 1px solid color-mix(in srgb, var(--demo-carousel-accent) 18%, var(--xy-border-color));
  background:
    linear-gradient(
      155deg,
      color-mix(in srgb, var(--demo-carousel-accent) 12%, white),
      transparent 48%
    ),
    color-mix(in srgb, var(--xy-bg-color-overlay) 88%, white);
  color: var(--xy-text-color);
  overflow: hidden;
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 72%, transparent);
}

.demo-carousel-seamless__eyebrow {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--demo-carousel-accent) 12%, white);
  color: color-mix(in srgb, var(--demo-carousel-accent) 78%, var(--xy-text-color));
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-carousel-seamless__description {
  margin: 0;
  max-width: 380px;
  color: var(--xy-text-color-secondary);
}
</style>
