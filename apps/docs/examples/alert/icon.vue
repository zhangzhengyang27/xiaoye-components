<template>
  <div class="alert-demo-stack">
    <xy-alert title="默认图标提示" type="info" show-icon />

    <xy-alert title="自定义图标提示" type="primary" show-icon>
      <template #icon>
        <xy-icon icon="mdi:shield-check-outline" :size="20" />
      </template>
    </xy-alert>
  </div>
</template>

<style scoped>
.alert-demo-stack {
  display: grid;
  gap: 12px;
}
</style>
