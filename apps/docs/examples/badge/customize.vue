<template>
  <div class="demo-badge-list">
    <xy-badge value="new" class="demo-badge-item">
      <xy-tag>版本动态</xy-tag>
    </xy-badge>
    <xy-badge value="hot" color="#ea580c" class="demo-badge-item">
      <xy-tag status="warning">热门话题</xy-tag>
    </xy-badge>
    <xy-badge :value="99" class="demo-badge-item">
      <xy-button plain>自定义内容</xy-button>
      <template #content="{ value }">
        <span class="demo-badge-custom-content">
          <xy-icon icon="mdi:fire" :size="12" />
          {{ value }}
        </span>
      </template>
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
  margin-right: 40px;
}

.demo-badge-custom-content {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
