<template>
  <xy-carousel
    virtual
    :virtual-buffer="1"
    height="220px"
    :autoplay="false"
    indicator-position="none"
  >
    <xy-carousel-item v-for="item in 12" :key="`virtual-${item}`">
      <div class="demo-carousel-virtual">Virtual {{ item }}</div>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-virtual {
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
