<template>
  <div class="demo-timeline-slots">
    <p class="demo-timeline-slots__tip">
      `dot` 只会替换节点区，标题、元信息、操作区和正文结构都不会被覆盖。
    </p>

    <xy-timeline>
      <xy-timeline-item timestamp="2026-03-26 10:30" placement="top" type="primary" state="current">
        <template #dot>
          <span class="demo-timeline-slots__dot">AI</span>
        </template>

        <template #title>结构化头信息</template>

        <template #meta> 审批流 / 财务负责人 / 工单 #X-2034 </template>

        <template #actions>
          <button class="demo-timeline-slots__action" type="button">查看详情</button>
        </template>

        节点区可以被 `dot` 替换，但头部、正文和扩展区仍保持稳定结构。

        <template #extra>
          <div class="demo-timeline-slots__extra">
            本次变更影响预算编号、合同主体和审批备注 3 个字段。
          </div>
        </template>
      </xy-timeline-item>

      <xy-timeline-item timestamp="来源信息" type="warning" state="pending">
        <template #title>meta only</template>
        <template #meta>来源系统 / 版本号 / 操作者</template>
        单侧布局里更推荐把辅助信息收口到 `meta`，而不是再额外开启 `center`。
      </xy-timeline-item>
    </xy-timeline>
  </div>
</template>

<style scoped>
.demo-timeline-slots {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-timeline-slots__tip {
  margin: 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.demo-timeline-slots__dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--xy-color-primary) 20%, var(--xy-border-color));
  background:
    linear-gradient(
      155deg,
      color-mix(in srgb, var(--xy-color-primary) 14%, white),
      transparent 46%
    ),
    color-mix(in srgb, var(--xy-bg-color-overlay) 88%, white);
  color: var(--xy-color-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.demo-timeline-slots__action {
  border: 0;
  border-radius: 999px;
  padding: 6px 10px;
  background: color-mix(in srgb, var(--xy-color-primary) 10%, white);
  color: var(--xy-color-primary);
  font-size: 12px;
  cursor: pointer;
}

.demo-timeline-slots__extra {
  padding: 10px 12px;
  border-radius: var(--xy-radius-md);
  background: color-mix(in srgb, var(--xy-bg-color-muted) 84%, white);
}
</style>
