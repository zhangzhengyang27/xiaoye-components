<template>
  <!-- 按钮禁用状态：展示多种按钮类型的禁用状态 -->
  <div class="demo-button-disabled">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-button-disabled__header">
          <strong>禁用状态</strong>
          <xy-tag status="neutral" round>禁用</xy-tag>
        </div>
        <p class="demo-button-disabled__description">
          禁用状态的按钮不可点击，用于表示当前操作不可用。
        </p>
      </template>

      <xy-space wrap>
        <xy-button disabled>默认禁用</xy-button>
        <xy-button type="primary" disabled>主要禁用</xy-button>
        <xy-button plain disabled>朴素禁用</xy-button>
        <xy-button text disabled>文本禁用</xy-button>
        <xy-button link disabled>链接禁用</xy-button>
      </xy-space>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-button-disabled {
  max-width: 640px;
}

.demo-button-disabled__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-button-disabled__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
