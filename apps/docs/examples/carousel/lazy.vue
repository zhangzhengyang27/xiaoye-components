<template>
  <xy-carousel lazy height="220px" :autoplay="false">
    <xy-carousel-item v-for="item in 6" :key="`lazy-${item}`">
      <div class="demo-carousel-lazy">Lazy {{ item }}</div>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-lazy {
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--xy-color-primary) 24%, var(--xy-border-color));
  background:
    linear-gradient(
      150deg,
      color-mix(in srgb, var(--xy-color-primary) 22%, white),
      transparent 42%
    ),
    color-mix(in srgb, var(--xy-bg-color-muted) 84%, white);
  color: var(--xy-text-color);
  font-size: 22px;
  font-weight: 700;
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 72%, transparent);
}
</style>
