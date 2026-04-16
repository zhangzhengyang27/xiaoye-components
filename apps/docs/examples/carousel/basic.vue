<script setup lang="ts">
const slides = [
  {
    title: "运营焦点位",
    desc: "适合首页 Banner、活动主视觉和公告入口。",
    accent: "var(--xy-color-primary)"
  },
  {
    title: "版本发布",
    desc: "把新功能和更新日志集中放进一个轮播序列里。",
    accent: "var(--xy-color-success)"
  },
  {
    title: "内容推荐",
    desc: "用于推荐专题、精选文章和关键任务入口。",
    accent: "var(--xy-color-warning)"
  }
] as const;
</script>

<template>
  <xy-carousel height="240px" style="--xy-carousel-radius: 18px">
    <xy-carousel-item v-for="slide in slides" :key="slide.title">
      <div class="demo-carousel-slide" :style="{ '--demo-carousel-accent': slide.accent }">
        <span class="demo-carousel-slide__eyebrow">Featured</span>
        <strong>{{ slide.title }}</strong>
        <p class="demo-carousel-slide__description">{{ slide.desc }}</p>
      </div>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-slide {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 10px;
  padding: 28px;
  border: 1px solid color-mix(in srgb, var(--demo-carousel-accent) 24%, var(--xy-border-color));
  border-radius: 18px;
  background:
    linear-gradient(
      155deg,
      color-mix(in srgb, var(--demo-carousel-accent) 22%, white),
      transparent 46%
    ),
    color-mix(in srgb, var(--xy-bg-color-muted) 84%, white);
  color: var(--xy-text-color);
  overflow: hidden;
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 72%, transparent);
}

.demo-carousel-slide__eyebrow {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 4px 10px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--demo-carousel-accent) 18%, white);
  color: color-mix(in srgb, var(--demo-carousel-accent) 78%, var(--xy-text-color));
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-carousel-slide__description {
  margin: 0;
  max-width: 340px;
  color: var(--xy-text-color-secondary);
}
</style>
