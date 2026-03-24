<template>
  <xy-carousel lazy height="220px" :autoplay="false">
    <xy-carousel-item v-for="item in 6" :key="`lazy-${item}`">
      <div class="demo-carousel-lazy">Lazy {{ item }}</div>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-lazy {
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #1d4ed8, #3b82f6);
  color: white;
  font-size: 22px;
  font-weight: 700;
}
</style>
