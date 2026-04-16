<template>
  <xy-carousel show-progress height="220px">
    <xy-carousel-item
      v-for="item in 3"
      :key="`duration-${item}`"
      :duration="item === 1 ? 5000 : 2000"
    >
      <div class="demo-carousel-duration">Duration {{ item }}</div>
    </xy-carousel-item>
    <xy-carousel-item autoplay-disabled>
      <div class="demo-carousel-duration demo-carousel-duration--disabled">手动切换页</div>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-duration {
  --demo-carousel-accent: var(--xy-color-primary);
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  border: 1px solid color-mix(in srgb, var(--demo-carousel-accent) 24%, var(--xy-border-color));
  background:
    linear-gradient(
      150deg,
      color-mix(in srgb, var(--demo-carousel-accent) 22%, white),
      transparent 42%
    ),
    color-mix(in srgb, var(--xy-bg-color-muted) 84%, white);
  color: var(--xy-text-color);
  font-size: 22px;
  font-weight: 700;
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 72%, transparent);
}

.demo-carousel-duration--disabled {
  --demo-carousel-accent: var(--xy-text-color-secondary);
}
</style>
