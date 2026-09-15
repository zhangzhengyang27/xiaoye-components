<template>
  <xy-carousel type="card" height="240px" :autoplay="false" style="--xy-carousel-radius: 18px">
    <xy-carousel-item v-for="item in 5" :key="`card-${item}`" :name="`card-${item}`">
      <xy-card class="demo-carousel-card" shadow="always">
        <span class="demo-carousel-card__eyebrow">Pick {{ item }}</span>
        <strong class="demo-carousel-card__title">推荐位 {{ item }}</strong>
        <p class="demo-carousel-card__description">点击左右卡片可以直接切换当前内容。</p>
      </xy-card>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
  padding: 22px;
  border: 1px solid color-mix(in srgb, var(--xy-brand) 18%, var(--xy-border));
  background:
    linear-gradient(
      150deg,
      color-mix(in srgb, var(--xy-brand) 12%, white),
      transparent 44%
    ),
    color-mix(in srgb, var(--xy-bg-container-overlay) 88%, white);
  color: var(--xy-text-primary);
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 74%, transparent);
}

.demo-carousel-card__eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--xy-brand);
}

.demo-carousel-card__title {
  font-size: 22px;
  line-height: 1.1;
}

.demo-carousel-card__description {
  margin: 0;
  color: var(--xy-text-secondary);
}
</style>
