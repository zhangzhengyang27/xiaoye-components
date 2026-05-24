<template>
  <!-- 结果页基础用法：展示操作成功状态 -->
  <div class="demo-result-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-result-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>操作结果</xy-tag>
        </div>
        <p class="demo-result-basic__description">
          结果页用于展示操作成功或失败的状态，引导用户下一步操作。
        </p>
      </template>

      <xy-result
        icon="success"
        title="操作成功"
        sub-title="新成员邀请已发送，对方将在 24 小时内收到邮件通知。"
      >
        <template #extra>
          <xy-button type="primary">查看成员</xy-button>
          <xy-button plain>继续邀请</xy-button>
        </template>
      </xy-result>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-result-basic {
  max-width: 640px;
}

.demo-result-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-result-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
