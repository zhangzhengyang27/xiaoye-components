<template>
  <xy-row :gutter="16">
    <xy-col :xs="24" :sm="12" :lg="8">
      <div class="demo-responsive">xs 24 / sm 12 / lg 8</div>
    </xy-col>
    <xy-col :xs="24" :sm="12" :lg="8">
      <div class="demo-responsive demo-responsive--strong">xs 24 / sm 12 / lg 8</div>
    </xy-col>
    <xy-col :xs="24" :sm="{ span: 12, offset: 6 }" :lg="{ span: 8, offset: 0 }">
      <div class="demo-responsive">sm 偏移 6 列</div>
    </xy-col>
  </xy-row>
</template>

<style scoped>
.demo-responsive {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 72%, white);
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  text-align: center;
}

.demo-responsive--strong {
  background: color-mix(in srgb, var(--xy-color-success) 14%, white);
  color: var(--xy-color-success);
}
</style>
