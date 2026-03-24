<script setup lang="ts">
const slides = [
  { title: "Ocean", color: "linear-gradient(135deg, #0f766e, #2563eb)" },
  { title: "Aurora", color: "linear-gradient(135deg, #7c3aed, #2563eb)" },
  { title: "Sunset", color: "linear-gradient(135deg, #ea580c, #d97706)" },
  { title: "Forest", color: "linear-gradient(135deg, #15803d, #0f766e)" }
] as const;
</script>

<template>
  <xy-carousel thumbs height="240px" :autoplay="false">
    <xy-carousel-item
      v-for="slide in slides"
      :key="slide.title"
      :label="slide.title"
    >
      <div class="demo-carousel-slide" :style="{ background: slide.color }">
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
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  color: white;
  font-size: 28px;
  font-weight: 800;
}

.demo-carousel-thumb {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding: 0 14px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 82%, white);
  color: var(--xy-text-color-secondary);
  white-space: nowrap;
}

.demo-carousel-thumb.is-active {
  background: color-mix(in srgb, var(--xy-color-primary) 12%, white);
  color: var(--xy-color-primary);
}
</style>
