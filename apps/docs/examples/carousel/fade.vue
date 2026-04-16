<template>
  <xy-carousel effect="fade" height="240px" style="--xy-carousel-radius: 18px">
    <xy-carousel-item v-for="item in 3" :key="`fade-${item}`">
      <div class="demo-carousel-fade" :class="`is-${item}`">
        <strong>Fade {{ item }}</strong>
      </div>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-fade {
  --demo-carousel-accent: var(--xy-color-primary);
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--demo-carousel-accent) 18%, var(--xy-border-color));
  border-radius: 18px;
  background:
    linear-gradient(
      155deg,
      color-mix(in srgb, var(--demo-carousel-accent) 14%, white),
      transparent 44%
    ),
    color-mix(in srgb, var(--xy-bg-color-overlay) 88%, white);
  color: var(--xy-text-color);
  font-size: 28px;
  font-weight: 800;
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 72%, transparent);
}

.demo-carousel-fade.is-1 {
  --demo-carousel-accent: var(--xy-color-primary);
}

.demo-carousel-fade.is-2 {
  --demo-carousel-accent: var(--xy-color-success);
}

.demo-carousel-fade.is-3 {
  --demo-carousel-accent: var(--xy-color-warning);
}
</style>
