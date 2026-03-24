<template>
  <xy-carousel
    height="220px"
    :autoplay="false"
    :slides-per-view="1.15"
    :slides-per-group="1"
    :gap="16"
    :peek="28"
    align="start"
    contain-scroll="trim"
    indicator-position="outside"
  >
    <xy-carousel-item v-for="item in 5" :key="`flow-${item}`">
      <div class="demo-carousel-flow">
        <span class="demo-carousel-flow__eyebrow">Flow {{ item }}</span>
        <strong>内容流 {{ item }}</strong>
      </div>
    </xy-carousel-item>
  </xy-carousel>
</template>

<style scoped>
.demo-carousel-flow {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
  padding: 22px;
  border-radius: 18px;
  background: linear-gradient(155deg, #0f766e, #3b82f6);
  color: white;
  overflow: hidden;
}

.demo-carousel-flow__eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
