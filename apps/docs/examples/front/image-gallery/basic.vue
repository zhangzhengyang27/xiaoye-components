<script setup lang="ts">
import { ref } from "vue";

const images = ref([
  { src: "https://picsum.photos/800/600?random=100", alt: "图片1" },
  { src: "https://picsum.photos/800/600?random=101", alt: "图片2" },
  { src: "https://picsum.photos/800/600?random=102", alt: "图片3" },
  { src: "https://picsum.photos/800/600?random=103", alt: "图片4" }
]);
</script>

<template>
  <div class="demo-image-gallery-basic">
    <xy-image-gallery :images="images" style="max-width: 600px;" />
  </div>
</template>

<style scoped>
.demo-image-gallery-basic {
  display: flex;
  justify-content: center;
}
</style>
