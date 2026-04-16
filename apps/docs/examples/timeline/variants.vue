<template>
  <xy-timeline>
    <xy-timeline-item timestamp="已创建" type="neutral">
      <div class="demo-timeline-line">
        <strong class="demo-timeline-line__title">默认节点</strong>
        <span class="demo-timeline-line__description">适合普通进度、说明性记录和弱提示。</span>
      </div>
    </xy-timeline-item>

    <xy-timeline-item timestamp="进行中" type="primary" icon="mdi:rocket-launch-outline">
      <div class="demo-timeline-line">
        <strong class="demo-timeline-line__title">主色图标</strong>
        <span class="demo-timeline-line__description">适合当前主线步骤、关键节点和高关注状态。</span>
      </div>
    </xy-timeline-item>

    <xy-timeline-item timestamp="已完成" type="success" size="large" icon="mdi:check">
      <div class="demo-timeline-line">
        <strong class="demo-timeline-line__title">大尺寸成功节点</strong>
        <span class="demo-timeline-line__description">适合强调“已交付”“已上线”“已验收”这类终态。</span>
      </div>
    </xy-timeline-item>

    <xy-timeline-item timestamp="待处理" type="warning" hollow icon="mdi:clock-alert-outline">
      <div class="demo-timeline-line">
        <strong class="demo-timeline-line__title">空心告警节点</strong>
        <span class="demo-timeline-line__description">适合提醒待确认、待补充、待审批这类中间状态。</span>
      </div>
    </xy-timeline-item>

    <xy-timeline-item
      timestamp="自定义"
      color="color-mix(in srgb, var(--xy-color-primary) 72%, var(--xy-color-info))"
      hollow
      icon="mdi:star-four-points-outline"
    >
      <div class="demo-timeline-line">
        <strong class="demo-timeline-line__title">自定义颜色</strong>
        <span class="demo-timeline-line__description">当业务已有专属品牌色或阶段色时，可以直接收口到节点颜色。</span>
      </div>
    </xy-timeline-item>
  </xy-timeline>
</template>

<style scoped>
.demo-timeline-line {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border-radius: var(--xy-radius-md);
  background: color-mix(in srgb, var(--xy-bg-color-muted) 86%, white);
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 82%, white);
}

.demo-timeline-line__title {
  color: var(--xy-text-color);
}

.demo-timeline-line__description {
  color: var(--xy-text-color-secondary);
  line-height: 1.6;
}
</style>
