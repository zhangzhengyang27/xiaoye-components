<script setup lang="ts">
const slides = [
  { title: "运营焦点位", desc: "适合首页 Banner、活动主视觉和公告入口。", bg: "linear-gradient(135deg, #2563eb, #0f766e)" },
  { title: "版本发布", desc: "把新功能和更新日志集中放进一个轮播序列里。", bg: "linear-gradient(135deg, #7c3aed, #2563eb)" },
  { title: "内容推荐", desc: "用于推荐专题、精选文章和关键任务入口。", bg: "linear-gradient(135deg, #ea580c, #d97706)" }
] as const;
</script>

<template>
  <xy-carousel height="240px">
    <xy-carousel-item v-for="slide in slides" :key="slide.title" :label="slide.title">
      <div class="demo-carousel-slide" :style="{ background: slide.bg }">
        <span class="demo-carousel-slide__eyebrow">Featured</span>
        <strong>{{ slide.title }}</strong>
        <p>{{ slide.desc }}</p>
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
  color: white;
  border-radius: 18px;
  overflow: hidden;
}

.demo-carousel-slide__eyebrow {
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

.demo-carousel-slide p {
  margin: 0;
  max-width: 340px;
  color: color-mix(in srgb, white 82%, transparent);
}
</style>
