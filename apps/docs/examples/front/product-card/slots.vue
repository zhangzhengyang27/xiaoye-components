<script setup lang="ts">
import { ref } from "vue";

const product = ref({
  image: "https://picsum.photos/400/400?random=50",
  title: "Apple iPhone 15 Pro Max 256GB",
  description: "全新A17 Pro芯片，钛金属设计",
  price: 9999,
  originalPrice: 10999,
  stock: 128
});
</script>

<template>
  <div class="demo-product-card-slots">
    <xy-product-card
      :image="product.image"
      :title="product.title"
      :description="product.description"
      :price="product.price"
      :original-price="product.originalPrice"
      :stock="product.stock"
    >
      <template #actions>
        <xy-button type="primary" size="small">立即购买</xy-button>
        <xy-button size="small">
          <xy-icon icon="mdi:heart-outline" :size="16" />
        </xy-button>
      </template>
    </xy-product-card>
  </div>
</template>

<style scoped>
.demo-product-card-slots {
  max-width: 300px;
}
</style>
