<script setup lang="ts">
import { ref } from "vue";

const images = ref([
  { src: "https://picsum.photos/800/600?random=110", alt: "图片1" },
  { src: "https://picsum.photos/800/600?random=111", alt: "图片2" },
  { src: "https://picsum.photos/800/600?random=112", alt: "图片3" }
]);

const positions = ["bottom", "left", "right"] as const;
</script>

<template>
  <div class="demo-image-gallery-thumbnail-position">
    <div v-for="pos in positions" :key="pos" class="position-item">
      <h4>{{ pos }}</h4>
      <xy-image-gallery
        :images="images"
        :thumbnail-position="pos"
        style="max-width: 400px; height: 300px;"
      />
    </div>
  </div>
</template>

<style scoped>
.demo-image-gallery-thumbnail-position {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.position-item h4 {
  margin: 0 0 12px;
  font-size: 14px;
  color: #666;
}

.position-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
