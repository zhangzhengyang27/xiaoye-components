<template>
  <xy-carousel height="220px" :autoplay="false">
    <xy-carousel-item v-for="item in 3" :key="`drag-${item}`">
      <div class="demo-carousel-drag">
        <strong>拖拽切换 {{ item }}</strong>
        <p>按住并左右拖动即可切换当前页。</p>
      </div>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-drag {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
  padding: 22px;
  border-radius: 16px;
  background: linear-gradient(145deg, #0f172a, #2563eb);
  color: white;
}

.demo-carousel-drag p {
  margin: 0;
  color: color-mix(in srgb, white 80%, transparent);
}
</style>
