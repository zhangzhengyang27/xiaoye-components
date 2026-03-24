<template>
  <div class="demo-avatar-rows">
    <div class="demo-avatar-row">
      <span class="demo-avatar-row__label">尺寸</span>
      <xy-space wrap align="center">
        <xy-avatar size="sm">小</xy-avatar>
        <xy-avatar>中</xy-avatar>
        <xy-avatar size="lg">大</xy-avatar>
        <xy-avatar :size="48" icon="mdi:account-outline" />
      </xy-space>
    </div>

    <div class="demo-avatar-row">
      <span class="demo-avatar-row__label">形状</span>
      <xy-space wrap align="center">
        <xy-avatar>圆</xy-avatar>
        <xy-avatar shape="square">方</xy-avatar>
        <xy-avatar shape="square" icon="mdi:shield-account-outline" />
      </xy-space>
    </div>
  </div>
</template>

<style scoped>
.demo-avatar-rows {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-avatar-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.demo-avatar-row__label {
  width: 44px;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}
</style>
