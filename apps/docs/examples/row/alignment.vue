<template>
  <xy-row justify="space-between" align="bottom" :gutter="16">
    <xy-col :span="6">
      <div class="demo-panel demo-panel--tall">摘要</div>
    </xy-col>
    <xy-col :span="6">
      <div class="demo-panel">环比</div>
    </xy-col>
    <xy-col :span="6">
      <div class="demo-panel demo-panel--short">待办</div>
    </xy-col>
  </xy-row>
</template>

<style scoped>
.demo-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 68px;
  border-radius: 14px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--xy-color-primary) 12%, white),
    color-mix(in srgb, var(--xy-bg-color-muted) 86%, white)
  );
  color: var(--xy-text-color);
  font-weight: 600;
}

.demo-panel--tall {
  min-height: 96px;
}

.demo-panel--short {
  min-height: 52px;
}
</style>
