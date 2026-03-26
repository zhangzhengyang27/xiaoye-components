<template>
  <div class="divider-demo-size">
    <xy-config-provider size="sm">
      <xy-divider>跟随全局 small</xy-divider>
    </xy-config-provider>

    <xy-divider>默认 medium</xy-divider>

    <xy-divider size="lg" status="primary">局部覆盖 large</xy-divider>
  </div>
</template>

<style scoped>
.divider-demo-size {
  display: grid;
  gap: 2px;
}
</style>
