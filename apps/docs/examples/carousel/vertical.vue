<template>
  <xy-carousel direction="vertical" height="220px" :autoplay="false" indicator-position="outside">
    <xy-carousel-item v-for="item in 3" :key="`vertical-${item}`">
      <div class="demo-carousel-vertical">
        <span class="demo-carousel-vertical__eyebrow">Step {{ item }}</span>
        <strong>纵向公告流 {{ item }}</strong>
        <p class="demo-carousel-vertical__description">适合发布记录、升级提醒和时间线式内容。</p>
      </div>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-vertical {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 76%, white);
}

.demo-carousel-vertical__eyebrow {
  color: var(--xy-color-primary);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.demo-carousel-vertical__description {
  margin: 0;
  color: var(--xy-text-color-secondary);
}
</style>
