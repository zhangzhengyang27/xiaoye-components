<template>
  <section class="demo-affix-basic">
    <xy-affix :offset="96">
      <xy-button type="primary">距顶部 96px</xy-button>
    </xy-affix>

    <div class="demo-affix-basic__list">
      <xy-card v-for="item in 6" :key="item" class="demo-affix-basic__card" shadow="hover">
        <h4>跟进卡片 {{ item }}</h4>
        <p>滚动页面时，顶部操作会保持可见，适合审批流、筛选摘要和页面内快捷入口。</p>
      </xy-card>
    </div>
  </section>
</template>

<style scoped>
.demo-affix-basic {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-affix-basic__list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-affix-basic__card h4 {
  margin: 0 0 8px;
}

.demo-affix-basic__card p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
