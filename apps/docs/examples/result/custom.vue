<template>
  <xy-result
    title="请先补齐发版说明"
    description="模板内容已生成，你还需要确认风险项、回滚策略和通知范围。"
  >
    <template #icon>
      <div class="custom-result-icon">
        <xy-icon icon="mdi:file-document-edit-outline" :size="54" />
      </div>
    </template>

    <div class="custom-result-content">
      <p class="custom-result-content__intro">建议优先补充以下三项：</p>
      <ul class="custom-result-content__list">
        <li class="custom-result-content__item">影响范围与回滚入口</li>
        <li class="custom-result-content__item">灰度批次和负责人</li>
        <li class="custom-result-content__item">上线后 30 分钟观测指标</li>
      </ul>
    </div>

    <template #extra>
      <xy-button type="primary">继续编辑</xy-button>
      <xy-button text>稍后处理</xy-button>
    </template>
  </xy-result>
</template>

<style scoped>
.custom-result-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 92px;
  height: 92px;
  border-radius: 999px;
  color: var(--xy-brand);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--xy-brand-soft) 72%, white),
    color-mix(in srgb, var(--xy-bg-subtle) 88%, white)
  );
  border: 1px solid color-mix(in srgb, var(--xy-brand) 16%, var(--xy-border-subtle));
  box-shadow: var(--xy-shadow-0);
}

.custom-result-content {
  text-align: left;
}

.custom-result-content__intro {
  margin: 0 0 10px;
  font-weight: 600;
  color: var(--xy-text-primary);
}

.custom-result-content__list {
  margin: 0;
  padding-left: 20px;
  color: var(--xy-text-secondary);
}
</style>
