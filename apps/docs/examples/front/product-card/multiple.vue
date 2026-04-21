<script setup lang="ts">
import { ref } from "vue";

const images = ref([
  "https://picsum.photos/400/400?random=10",
  "https://picsum.photos/400/400?random=11",
  "https://picsum.photos/400/400?random=12",
  "https://picsum.photos/400/400?random=13"
]);
</script>

<template>
  <div class="demo-product-card-multiple">
    <xy-product-card
      :image="images"
      title="Apple iPhone 15 Pro Max 256GB 深空黑"
      description="全新A17 Pro芯片，钛金属设计"
      :price="9999"
      :original-price="10999"
    />
  </div>
</template>

<style scoped>
.demo-product-card-multiple {
  max-width: 300px;
}
</style>
