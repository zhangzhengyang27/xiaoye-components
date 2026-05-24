<template>
  <!-- 警告提示基础用法：展示 5 种语义类型 -->
  <div class="demo-alert-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-alert-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>语义类型</xy-tag>
        </div>
        <p class="demo-alert-basic__description">
          用于页面内操作反馈、信息提示和警告提醒。
        </p>
      </template>

      <div class="demo-alert-basic__list">
        <xy-alert title="系统公告" type="primary" />
        <xy-alert title="操作成功" type="success" />
        <xy-alert title="使用提示" type="info" />
        <xy-alert title="注意事项" type="warning" />
        <xy-alert title="操作失败" type="error" />
      </div>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-alert-basic {
  max-width: 640px;
}

.demo-alert-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-alert-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-alert-basic__list {
  display: grid;
  gap: 12px;
}
</style>
