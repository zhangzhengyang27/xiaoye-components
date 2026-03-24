<template>
  <xy-carousel show-progress height="220px">
    <xy-carousel-item v-for="item in 3" :key="`duration-${item}`" :duration="item === 1 ? 5000 : 2000">
      <div class="demo-carousel-duration">Duration {{ item }}</div>
    </xy-carousel-item>
    <xy-carousel-item autoplay-disabled>
      <div class="demo-carousel-duration demo-carousel-duration--disabled">手动切换页</div>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-duration {
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #2563eb, #0f766e);
  color: white;
  font-size: 22px;
  font-weight: 700;
}

.demo-carousel-duration--disabled {
  background: linear-gradient(135deg, #0f172a, #475569);
}
</style>
