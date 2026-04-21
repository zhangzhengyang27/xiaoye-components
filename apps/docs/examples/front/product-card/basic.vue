<script setup lang="ts">
import { ref } from "vue";

const product = ref({
  image: "https://picsum.photos/400/400?random=1",
  title: "Apple iPhone 15 Pro Max 256GB 深空黑",
  description: "全新A17 Pro芯片，钛金属设计，Action按钮",
  price: 9999,
  originalPrice: 10999
});
</script>

<template>
  <div class="demo-product-card-basic">
    <xy-product-card
      :image="product.image"
      :title="product.title"
      :description="product.description"
      :price="product.price"
      :original-price="product.originalPrice"
    />
  </div>
</template>

<style scoped>
.demo-product-card-basic {
  max-width: 300px;
}
</style>
