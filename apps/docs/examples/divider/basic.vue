<template>
  <!-- 分割线基础用法：用于内容分组和视觉分隔 -->
  <div class="demo-divider-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-divider-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>内容分隔</xy-tag>
        </div>
        <p class="demo-divider-basic__description">
          分割线用于划分内容区域，帮助用户理解信息的层次结构。
        </p>
      </template>

      <section class="demo-divider-basic__content">
        <div>
          <h4 class="demo-divider-basic__title">发版前检查</h4>
          <p class="demo-divider-basic__description-text">确认版本号、变更记录和审批单已经同步到本周发布计划。</p>
        </div>

        <xy-divider />

        <div>
          <h4 class="demo-divider-basic__title">发版后回收</h4>
          <p class="demo-divider-basic__description-text">
            发布完成后补齐回归记录、异常结论和负责人同步，避免信息留在聊天窗口里。
          </p>
        </div>
      </section>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-divider-basic {
  max-width: 560px;
}

.demo-divider-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-divider-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-divider-basic__content {
  display: grid;
  gap: 0;
}

.demo-divider-basic__title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--xy-text-color);
}

.demo-divider-basic__description-text {
  margin: 8px 0 0;
  line-height: 1.7;
  color: var(--xy-text-color-secondary);
}
</style>
