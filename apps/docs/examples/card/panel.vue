<template>
  <div class="demo-card-panel-grid">
    <xy-card
      header="筛选面板"
      extra="最近更新 2 分钟前"
      variant="muted"
      size="sm"
      shadow="hover"
      style="max-width: 420px"
    >
      <xy-space wrap>
        <xy-input placeholder="搜索项目" clearable />
        <xy-select
          :options="[
            { label: '全部状态', value: 'all' },
            { label: '已启用', value: 'active' },
            { label: '已停用', value: 'inactive' }
          ]"
          placeholder="状态筛选"
          clearable
        />
      </xy-space>

      <template #footer>
        <xy-space>
          <xy-button plain>重置</xy-button>
          <xy-button type="primary">应用筛选</xy-button>
        </xy-space>
      </template>
    </xy-card>

    <xy-card
      header="系统配置"
      variant="muted"
      :header-divider="false"
      :footer-divider="false"
      bordered
      style="max-width: 420px"
    >
      <template #extra>
        <xy-badge is-dot type="success">
          <xy-text type="info" size="sm">已同步</xy-text>
        </xy-badge>
      </template>

      <div class="demo-card-panel-copy">
        <strong>通知渠道</strong>
        <p class="demo-card-panel-copy__description">适合承载设置说明、状态提示和右侧轻操作。</p>
      </div>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-card-panel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.demo-card-panel-copy {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-card-panel-copy__description {
  margin: 0;
  color: var(--xy-text-color-secondary);
}
</style>
