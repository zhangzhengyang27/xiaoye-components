<template>
  <xy-result title="请先补齐发版说明" description="模板内容已生成，你还需要确认风险项、回滚策略和通知范围。">
    <template #icon>
      <div class="custom-result-icon">
        <xy-icon icon="mdi:file-document-edit-outline" :size="54" />
      </div>
    </template>

    <div class="custom-result-content">
      <p>建议优先补充以下三项：</p>
      <ul>
        <li>影响范围与回滚入口</li>
        <li>灰度批次和负责人</li>
        <li>上线后 30 分钟观测指标</li>
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
  color: var(--xy-color-primary);
  background:
    radial-gradient(circle at top, rgba(255, 255, 255, 0.8), transparent 58%),
    linear-gradient(180deg, rgba(37, 99, 235, 0.12), rgba(37, 99, 235, 0.06));
  border: 1px solid rgba(37, 99, 235, 0.18);
}

.custom-result-content {
  text-align: left;
}

.custom-result-content p {
  margin: 0 0 10px;
  font-weight: 600;
  color: var(--xy-text-color);
}

.custom-result-content ul {
  margin: 0;
  padding-left: 20px;
  color: var(--xy-text-color-secondary);
}
</style>
