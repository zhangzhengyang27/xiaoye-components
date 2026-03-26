<template>
  <xy-popconfirm
    title="该操作会立即结束当前发布批次，确定继续吗？"
    effect="dark"
    icon="mdi:alert-circle-outline"
    icon-color="#f97316"
    confirm-button-type="danger"
    cancel-button-type="text"
    confirm-button-text="立即结束"
    cancel-button-text="再想想"
    :confirm-button-props="{ plain: true }"
    :cancel-button-props="{ icon: 'mdi:close-thick' }"
    width="320px"
  >
    <template #reference>
      <xy-button type="danger">结束发布</xy-button>
    </template>

    <template #default>
      <p class="demo-popconfirm-custom__body">结束后当前批次会立即停止，未完成节点会保留在异常队列。</p>
    </template>
  </xy-popconfirm>
</template>

<style scoped>
.demo-popconfirm-custom__body {
  margin: 0;
}
</style>
