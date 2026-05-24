<template>
  <!-- 描述列表基础用法：展示结构化的键值对信息 -->
  <div class="demo-descriptions-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-descriptions-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>键值对</xy-tag>
        </div>
        <p class="demo-descriptions-basic__description">
          描述列表用于展示一组结构化的键值对信息，适合详情页的数据展示。
        </p>
      </template>

      <xy-descriptions title="成员信息" extra="只读">
        <xy-descriptions-item label="姓名">小叶</xy-descriptions-item>
        <xy-descriptions-item label="角色">管理员</xy-descriptions-item>
        <xy-descriptions-item label="状态">启用</xy-descriptions-item>
      </xy-descriptions>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-descriptions-basic {
  max-width: 640px;
}

.demo-descriptions-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-descriptions-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
