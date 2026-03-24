<template>
  <div class="demo-carousel-stack">
    <section class="demo-carousel-example">
      <xy-text type="info" size="sm">outside 指示器 + 常显箭头</xy-text>
      <div class="demo-carousel-shell">
        <xy-carousel arrow="always" indicator-position="outside" height="200px">
          <xy-carousel-item v-for="item in 3" :key="`outside-${item}`">
            <div class="demo-carousel-panel">Outside {{ item }}</div>
          </xy-carousel-item>
        </xy-carousel>
      </div>
    </section>

    <section class="demo-carousel-example">
      <xy-text type="info" size="sm">纯净模式，无箭头无指示器</xy-text>
      <div class="demo-carousel-shell">
        <xy-carousel arrow="never" indicator-position="none" :interval="2200" height="200px">
          <xy-carousel-item v-for="item in 3" :key="`clean-${item}`">
            <div class="demo-carousel-panel demo-carousel-panel--muted">Clean {{ item }}</div>
          </xy-carousel-item>
        </xy-carousel>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-carousel-stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.demo-carousel-example {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-carousel-shell {
  max-width: 100%;
}

.demo-carousel-panel {
  width: 100%;
  height: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: linear-gradient(135deg, #1d4ed8, #3b82f6);
  color: white;
  font-size: 18px;
  font-weight: 700;
  overflow: hidden;
}

.demo-carousel-panel--muted {
  background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  color: var(--xy-text-color);
}
</style>
