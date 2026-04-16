<script setup lang="ts">
const gallery = [
  { title: "封面 1", accent: "var(--xy-color-primary)" },
  { title: "封面 2", accent: "var(--xy-color-success)" },
  { title: "封面 3", accent: "var(--xy-color-warning)" },
  { title: "封面 4", accent: "var(--xy-color-info)" }
] as const;
</script>

<template>
  <xy-carousel
    thumbs
    thumbs-placement="bottom"
    height="260px"
    :autoplay="false"
    indicator-position="none"
    style="--xy-carousel-radius: 18px"
  >
    <xy-carousel-item v-for="item in gallery" :key="item.title">
      <div class="demo-carousel-gallery" :style="{ '--demo-carousel-accent': item.accent }">
        <strong>{{ item.title }}</strong>
      </div>
    </xy-carousel-item>

    <template #thumb="{ index, active }">
      <div class="demo-carousel-gallery-thumb" :class="{ 'is-active': active }">
        {{ gallery[index]?.title }}
      </div>
    </template>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-gallery {
  --demo-carousel-accent: var(--xy-color-primary);
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--demo-carousel-accent) 24%, var(--xy-border-color));
  border-radius: 18px;
  background:
    linear-gradient(
      150deg,
      color-mix(in srgb, var(--demo-carousel-accent) 22%, white),
      transparent 42%
    ),
    color-mix(in srgb, var(--xy-bg-color-muted) 84%, white);
  color: var(--xy-text-color);
  font-size: 28px;
  font-weight: 800;
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 72%, transparent);
}

.demo-carousel-gallery-thumb {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 12px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 82%, white);
  color: var(--xy-text-color-secondary);
}

.demo-carousel-gallery-thumb.is-active {
  background: color-mix(in srgb, var(--xy-color-primary) 12%, white);
  color: var(--xy-color-primary);
}
</style>
