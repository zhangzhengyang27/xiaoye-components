<template>
  <xy-carousel virtual :virtual-buffer="1" height="220px" :autoplay="false">
    <xy-carousel-item v-for="item in 12" :key="`virtual-${item}`">
      <div class="demo-carousel-virtual">Virtual {{ item }}</div>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-virtual {
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #0f766e, #2563eb);
  color: white;
  font-size: 22px;
  font-weight: 700;
}
</style>
