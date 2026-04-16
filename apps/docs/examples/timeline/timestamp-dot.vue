<template>
  <xy-timeline mode="alternate">
    <xy-timeline-item timestamp="2026-03-24 09:10" placement="top" type="primary">
      <div class="demo-timeline-panel">
        <strong class="demo-timeline-panel__title">顶部时间戳</strong>
        <p class="demo-timeline-panel__description">适合把“发生时间”先交代清楚，再展开事件说明。</p>
      </div>
    </xy-timeline-item>

    <xy-timeline-item timestamp="审批人：财务负责人" center type="warning" hollow>
      <div class="demo-timeline-panel">
        <strong class="demo-timeline-panel__title">对侧时间戳</strong>
        <p class="demo-timeline-panel__description">
          `center` 更适合配合双侧布局，把审批人、来源系统、版本号这类辅助信息放到另一侧。
        </p>
      </div>
    </xy-timeline-item>

    <xy-timeline-item timestamp="人工备注" type="success">
      <template #dot>
        <span class="demo-timeline-custom-dot">AI</span>
      </template>

      <div class="demo-timeline-panel">
        <strong class="demo-timeline-panel__title">自定义 dot</strong>
        <p class="demo-timeline-panel__description">dot 插槽存在时会完全替换默认节点，适合头像、徽标和业务缩写。</p>
      </div>
    </xy-timeline-item>
  </xy-timeline>
</template>

<style scoped>
.demo-timeline-panel {
  padding: 12px 14px;
  border-left: 3px solid color-mix(in srgb, var(--xy-color-primary) 18%, transparent);
  background: color-mix(in srgb, var(--xy-bg-color-muted) 76%, white);
  border-radius: 0 var(--xy-radius-md) var(--xy-radius-md) 0;
}

.demo-timeline-panel__title {
  display: block;
  margin-bottom: 6px;
  color: var(--xy-text-color);
}

.demo-timeline-panel__description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.6;
}

.demo-timeline-custom-dot {
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
</style>
