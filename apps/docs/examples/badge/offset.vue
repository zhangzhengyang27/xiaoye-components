<template>
  <div class="demo-badge-list">
    <xy-badge :value="1" :offset="[10, 5]" class="demo-badge-item">
      <xy-button plain>默认偏移</xy-button>
    </xy-badge>
    <xy-badge is-dot :offset="[14, 2]" class="demo-badge-item">
      <xy-avatar icon="mdi:account-outline" />
    </xy-badge>
  </div>
</template>

<style scoped>
.demo-badge-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.demo-badge-item {
  margin-top: 10px;
  margin-right: 30px;
}
</style>
