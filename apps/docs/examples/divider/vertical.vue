<template>
  <div class="divider-demo-vertical">
    <xy-tag status="primary" round>草稿</xy-tag>
    <xy-divider direction="vertical" />
    <span>最近保存于 10:24</span>
    <xy-divider direction="vertical" border-style="dashed" />
    <a class="divider-demo-vertical__link" href="javascript:void(0)">查看草稿历史</a>
    <xy-divider direction="vertical" status="success" />
    <a class="divider-demo-vertical__link" href="javascript:void(0)">提交审批</a>
  </div>
</template>

<style scoped>
.divider-demo-vertical {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;
  line-height: 1.6;
  color: var(--xy-text-color-secondary);
}

.divider-demo-vertical__link {
  color: var(--xy-color-primary);
  text-decoration: none;
}
</style>
