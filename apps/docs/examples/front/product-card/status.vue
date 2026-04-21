<script setup lang="ts">
import { ref } from "vue";

const products = ref([
  {
    image: "https://picsum.photos/400/400?random=40",
    title: "Apple iPhone 15 Pro",
    price: 7999,
    status: "online" as const
  },
  {
    image: "https://picsum.photos/400/400?random=41",
    title: "Apple iPhone 15",
    price: 5999,
    status: "soldout" as const
  },
  {
    image: "https://picsum.photos/400/400?random=42",
    title: "Apple iPhone 14",
    price: 4999,
    status: "offline" as const
  }
]);
</script>

<template>
  <div class="demo-product-card-status">
    <xy-product-card
      v-for="(product, index) in products"
      :key="index"
      :image="product.image"
      :title="product.title"
      :price="product.price"
      :status="product.status"
      :style="{ maxWidth: '240px' }"
    />
  </div>
</template>

<style scoped>
.demo-product-card-status {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
</style>
