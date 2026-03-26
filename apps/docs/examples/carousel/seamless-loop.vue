<script setup lang="ts">
import { computed, ref } from "vue";

const slides = [
  {
    title: "边界无缝 1",
    desc: "自动播放到最后一张后，会沿着同一条轨道继续进入第一张。",
    bg: "linear-gradient(135deg, #2563eb, #0f766e)"
  },
  {
    title: "边界无缝 2",
    desc: "边界切换单独使用更线性的节奏，减少到头再收一下的感觉。",
    bg: "linear-gradient(135deg, #7c3aed, #2563eb)"
  },
  {
    title: "边界无缝 3",
    desc: "边界过渡中再次点击 next 会排队执行，不会半路打断当前轨道。",
    bg: "linear-gradient(135deg, #ea580c, #d97706)"
  }
] as const;

const carouselRef = ref<{
  activeIndex: number;
  prev: () => void;
  next: () => void;
} | null>(null);

const activeLabel = computed(() => slides[carouselRef.value?.activeIndex ?? 0]?.title ?? slides[0].title);
</script>

<template>
  <div class="demo-carousel-seamless-shell">
    <xy-space wrap>
      <xy-button plain @click="carouselRef?.prev()">prev()</xy-button>
      <xy-button plain @click="carouselRef?.next()">next()</xy-button>
      <xy-tag status="primary">当前页：{{ activeLabel }}</xy-tag>
      <xy-tag>观察末页自动进入首屏时的进度条与节奏</xy-tag>
    </xy-space>

    <xy-carousel
      ref="carouselRef"
      height="240px"
      arrow="always"
      show-progress
      style="--xy-carousel-radius: 18px"
    >
      <xy-carousel-item v-for="slide in slides" :key="slide.title">
        <div class="demo-carousel-seamless" :style="{ background: slide.bg }">
          <span class="demo-carousel-seamless__eyebrow">Seamless Loop</span>
          <strong>{{ slide.title }}</strong>
          <p>{{ slide.desc }}</p>
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
  color: white;
  overflow: hidden;
}

.demo-carousel-seamless__eyebrow {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, white 18%, transparent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-carousel-seamless p {
  margin: 0;
  max-width: 380px;
  color: color-mix(in srgb, white 82%, transparent);
}
</style>
