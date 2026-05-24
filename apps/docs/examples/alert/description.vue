<template>
  <!-- 警告提示描述：展示带描述文本的警告提示 -->
  <div class="demo-alert-description">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-alert-description__header">
          <strong>描述文本</strong>
          <xy-tag status="neutral" round>Description</xy-tag>
        </div>
        <p class="demo-alert-description__description">
          警告提示可以包含描述文本，提供更详细的信息说明。
        </p>
      </template>

      <div class="demo-alert-description__list">
        <xy-alert
          title="批量导出已排队"
          type="success"
          description="系统会在 2 分钟内生成下载包，并通过站内信通知结果。"
        />

        <xy-alert title="权限即将失效" type="error">
          当前审批角色将在今天 18:00 到期，请尽快完成交接或续期。
        </xy-alert>
      </div>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-alert-description {
  max-width: 640px;
}

.demo-alert-description__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-alert-description__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-alert-description__list {
  display: grid;
  gap: 12px;
}
</style>
