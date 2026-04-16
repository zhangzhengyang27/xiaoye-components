<template>
  <section class="divider-demo-stack">
    <div>
      <h4 class="divider-demo-stack__title">发版前检查</h4>
      <p class="divider-demo-stack__description">确认版本号、变更记录和审批单已经同步到本周发布计划。</p>
    </div>

    <xy-divider />

    <div>
      <h4 class="divider-demo-stack__title">发版后回收</h4>
      <p class="divider-demo-stack__description">
        发布完成后补齐回归记录、异常结论和负责人同步，避免信息留在聊天窗口里。
      </p>
    </div>
  </section>
</template>

<style scoped>
.divider-demo-stack {
  display: grid;
  gap: 0;
}

.divider-demo-stack__title,
.divider-demo-stack__description {
  margin: 0;
}

.divider-demo-stack__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--xy-text-color);
}

.divider-demo-stack__description {
  margin-top: 8px;
  line-height: 1.7;
  color: var(--xy-text-color-secondary);
}
</style>
