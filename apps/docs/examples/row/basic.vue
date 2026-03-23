<template>
  <xy-row :gutter="16">
    <xy-col :span="8">
      <div class="demo-cell">8</div>
    </xy-col>
    <xy-col :span="8">
      <div class="demo-cell demo-cell--strong">8</div>
    </xy-col>
    <xy-col :span="8">
      <div class="demo-cell">8</div>
    </xy-col>
  </xy-row>
</template>

<style scoped>
.demo-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 78%, white);
  color: var(--xy-text-color-secondary);
  font-weight: 600;
}

.demo-cell--strong {
  background: color-mix(in srgb, var(--xy-color-primary) 14%, white);
  color: var(--xy-color-primary);
}
</style>
