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
    style="--xy-carousel-radius: 18px"
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
  border: 1px solid color-mix(in srgb, var(--xy-color-primary) 18%, var(--xy-border-color));
  border-radius: 18px;
  background:
    linear-gradient(
      150deg,
      color-mix(in srgb, var(--xy-color-primary) 14%, white),
      transparent 46%
    ),
    color-mix(in srgb, var(--xy-bg-color-overlay) 88%, white);
  color: var(--xy-text-color);
  overflow: hidden;
  box-shadow: inset 0 1px 0 color-mix(in srgb, white 72%, transparent);
}

.demo-carousel-flow__eyebrow {
  color: var(--xy-color-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
