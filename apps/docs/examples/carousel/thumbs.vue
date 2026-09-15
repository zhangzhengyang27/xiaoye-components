<script setup lang="ts">
const slides = [
  { title: "Ocean", accent: "var(--xy-brand)" },
  { title: "Aurora", accent: "var(--xy-success)" },
  { title: "Sunset", accent: "var(--xy-warning)" },
  { title: "Forest", accent: "var(--xy-info)" }
] as const;
</script>

<template>
  <xy-carousel
    thumbs
    height="240px"
    :autoplay="false"
    indicator-position="none"
    style="--xy-carousel-radius: 18px"
  >
    <xy-carousel-item v-for="slide in slides" :key="slide.title">
      <div class="demo-carousel-slide" :style="{ '--demo-carousel-accent': slide.accent }">
        <strong>{{ slide.title }}</strong>
      </div>
    </xy-carousel-item>

    <template #thumb="{ index, active }">
      <div :class="['demo-carousel-thumb', active ? 'is-active' : '']">
        {{ slides[index]?.title }}
      </div>
    </template>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-slide {
  --demo-carousel-accent: var(--xy-brand);
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--demo-carousel-accent) 18%, var(--xy-border));
  border-radius: 18px;
  background:
    linear-gradient(
      150deg,
      color-mix(in srgb, var(--demo-carousel-accent) 14%, white),
      transparent 44%
    ),
    color-mix(in srgb, var(--xy-bg-container-overlay) 88%, white);
  color: var(--xy-text-primary);
  font-size: 28px;
  font-weight: 800;
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 72%, transparent);
}

.demo-carousel-thumb {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 0 14px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--xy-bg-muted) 82%, white);
  color: var(--xy-text-secondary);
  white-space: nowrap;
}

.demo-carousel-thumb.is-active {
  background: color-mix(in srgb, var(--xy-brand) 12%, white);
  color: var(--xy-brand);
}
</style>
