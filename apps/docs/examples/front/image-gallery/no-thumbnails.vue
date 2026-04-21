<script setup lang="ts">
import { ref } from "vue";

const images = ref([
  { src: "https://picsum.photos/800/600?random=120", alt: "图片1" },
  { src: "https://picsum.photos/800/600?random=121", alt: "图片2" },
  { src: "https://picsum.photos/800/600?random=122", alt: "图片3" }
]);
</script>

<template>
  <div class="demo-image-gallery-no-thumbnails">
    <xy-image-gallery :images="images" :show-thumbnails="false" style="max-width: 600px;" />
  </div>
</template>

<style scoped>
.demo-image-gallery-no-thumbnails {
  display: flex;
  justify-content: center;
}
</style>
