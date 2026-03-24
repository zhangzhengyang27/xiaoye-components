<template>
  <xy-carousel show-progress height="220px">
    <xy-carousel-item v-for="item in 3" :key="`progress-${item}`">
      <div class="demo-carousel-progress">Progress {{ item }}</div>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-progress {
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #2563eb, #0f172a);
  color: white;
  font-size: 24px;
  font-weight: 700;
}
</style>
