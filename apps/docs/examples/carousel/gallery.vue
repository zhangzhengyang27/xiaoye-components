<script setup lang="ts">
const gallery = [
  { title: "封面 1", color: "linear-gradient(135deg, #2563eb, #0f766e)" },
  { title: "封面 2", color: "linear-gradient(135deg, #7c3aed, #2563eb)" },
  { title: "封面 3", color: "linear-gradient(135deg, #ea580c, #d97706)" },
  { title: "封面 4", color: "linear-gradient(135deg, #15803d, #0f766e)" }
] as const;
</script>

<template>
  <xy-carousel thumbs thumbs-placement="bottom" height="260px" :autoplay="false" indicator-position="none" style="--xy-carousel-radius: 18px">
    <xy-carousel-item v-for="item in gallery" :key="item.title">
      <div class="demo-carousel-gallery" :style="{ background: item.color }">
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
