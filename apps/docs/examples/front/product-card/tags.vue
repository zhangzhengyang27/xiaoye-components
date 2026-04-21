<script setup lang="ts">
import { ref } from "vue";

const product = ref({
  image: "https://picsum.photos/400/400?random=20",
  title: "Apple iPhone 15 Pro Max 256GB 深空黑",
  description: "全新A17 Pro芯片，钛金属设计，Action按钮",
  price: 9999,
  originalPrice: 10999,
  tags: [
    { text: "新品", type: "primary" as const },
    { text: "热卖", type: "danger" as const },
    { text: "免息", type: "success" as const }
  ]
});
</script>

<template>
  <div class="demo-product-card-tags">
    <xy-product-card
      :image="product.image"
      :title="product.title"
      :description="product.description"
      :price="product.price"
      :original-price="product.originalPrice"
      :tags="product.tags"
    />
  </div>
</template>

<style scoped>
.demo-product-card-tags {
  max-width: 300px;
}
</style>
