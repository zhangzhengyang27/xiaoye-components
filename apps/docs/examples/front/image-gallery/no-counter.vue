<script setup lang="ts">
import { ref } from "vue";

const images = ref([
  { src: "https://picsum.photos/800/600?random=130", alt: "图片1" },
  { src: "https://picsum.photos/800/600?random=131", alt: "图片2" },
  { src: "https://picsum.photos/800/600?random=132", alt: "图片3" }
]);
</script>

<template>
  <div class="demo-image-gallery-no-counter">
    <xy-image-gallery :images="images" :show-counter="false" style="max-width: 600px;" />
  </div>
</template>

<style scoped>
.demo-image-gallery-no-counter {
  display: flex;
  justify-content: center;
}
</style>
