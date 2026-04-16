<template>
  <xy-carousel height="220px" :autoplay="false">
    <xy-carousel-item v-for="item in 3" :key="`drag-${item}`">
      <div class="demo-carousel-drag">
        <strong>拖拽切换 {{ item }}</strong>
        <p class="demo-carousel-drag__description">按住并左右拖动即可切换当前页。</p>
      </div>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-drag {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
  padding: 22px;
  border: 1px solid color-mix(in srgb, var(--xy-color-primary) 18%, var(--xy-border-color));
  border-radius: 16px;
  background:
    linear-gradient(
      150deg,
      color-mix(in srgb, var(--xy-color-primary) 14%, white),
      transparent 46%
    ),
    color-mix(in srgb, var(--xy-bg-color-overlay) 88%, white);
  color: var(--xy-text-color);
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 72%, transparent);
}

.demo-carousel-drag__description {
  margin: 0;
  color: var(--xy-text-color-secondary);
}
</style>
