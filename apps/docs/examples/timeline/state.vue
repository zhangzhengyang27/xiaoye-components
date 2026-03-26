<template>
  <div class="demo-timeline-state">
    <p class="demo-timeline-state__tip">
      这里同时看三层信息：节点流程态、语义色，以及右侧状态胶囊。这样更容易分清 `state` 和 `type`
      的职责。
    </p>

    <xy-timeline>
      <xy-timeline-item timestamp="已完成" type="success" state="done">
        <template #title>done + success</template>
        <template #meta>适合已交付、已上线、已同步</template>
        <template #actions>
          <span class="demo-timeline-state__pill demo-timeline-state__pill--success">完成</span>
        </template>
        节点和连线会进入完成态，但成功语义仍由 `type` 控制。
        <template #extra>
          <div class="demo-timeline-state__note">适合发布完成、回写完成、已归档这类终态。</div>
        </template>
      </xy-timeline-item>

      <xy-timeline-item timestamp="当前步骤" type="primary" state="current">
        <template #title>current + primary</template>
        <template #meta>适合当前主线阶段</template>
        <template #actions>
          <span class="demo-timeline-state__pill demo-timeline-state__pill--primary">当前</span>
        </template>
        当前节点会被强调，但不会自动覆盖你的语义色选择。
        <template #extra>
          <div class="demo-timeline-state__note">
            适合当前审批环节、当前开发阶段、当前值班轮次。
          </div>
        </template>
      </xy-timeline-item>

      <xy-timeline-item timestamp="等待处理" type="neutral" state="pending">
        <template #title>pending + neutral</template>
        <template #meta>适合待审批、待确认、待触发</template>
        <template #actions>
          <span class="demo-timeline-state__pill demo-timeline-state__pill--neutral">待处理</span>
        </template>
        pending 默认会走空心节点和弱化尾线，不需要额外手动写 `hollow`。
        <template #extra>
          <div class="demo-timeline-state__note">适合排队中、等待人工确认、等待外部系统触发。</div>
        </template>
      </xy-timeline-item>

      <xy-timeline-item timestamp="风险阻塞" type="warning" state="blocked">
        <template #title>blocked + warning</template>
        <template #meta>适合延期、异常、依赖阻塞</template>
        <template #actions>
          <span class="demo-timeline-state__pill demo-timeline-state__pill--warning">风险</span>
        </template>
        blocked 负责流程风险表达，warning 继续承接视觉语义。
        <template #extra>
          <div class="demo-timeline-state__note">适合延期、缺依赖、审批卡点和回滚待确认。</div>
        </template>
      </xy-timeline-item>
    </xy-timeline>
  </div>
</template>

<style scoped>
.demo-timeline-state {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-timeline-state__tip {
  margin: 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.demo-timeline-state__pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: var(--xy-radius-pill);
  font-size: 12px;
  line-height: 1;
}

.demo-timeline-state__pill--success {
  background: color-mix(in srgb, var(--xy-color-success) 12%, white);
  color: var(--xy-color-success);
}

.demo-timeline-state__pill--primary {
  background: color-mix(in srgb, var(--xy-color-primary) 12%, white);
  color: var(--xy-color-primary);
}

.demo-timeline-state__pill--neutral {
  background: color-mix(in srgb, var(--xy-text-color-secondary) 10%, white);
  color: var(--xy-text-color-secondary);
}

.demo-timeline-state__pill--warning {
  background: color-mix(in srgb, var(--xy-color-warning) 14%, white);
  color: var(--xy-color-warning);
}

.demo-timeline-state__note {
  padding: 8px 10px;
  border-radius: var(--xy-radius-md);
  background: color-mix(in srgb, var(--xy-bg-color-muted) 88%, white);
}
</style>
