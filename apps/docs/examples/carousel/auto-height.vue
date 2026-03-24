<template>
  <xy-carousel height="auto" :autoplay="false">
    <xy-carousel-item v-for="item in 3" :key="`auto-${item}`">
      <div class="demo-carousel-auto" :class="`is-${item}`">
        <strong>自适应高度 {{ item }}</strong>
        <p v-for="line in item" :key="line">当前 slide 会根据内容高度自动调整容器。</p>
      </div>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-auto {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 82%, white);
}

.demo-carousel-auto p {
  margin: 0;
  color: var(--xy-text-color-secondary);
}
</style>
