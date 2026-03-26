<template>
  <section class="demo-affix-basic">
    <xy-affix :offset="48">
      <div class="demo-affix-basic__toolbar">
        <div>
          <strong>审批流快捷操作</strong>
          <p>继续往下滚，观察这块工具条固定在视口顶部。</p>
        </div>
        <xy-button type="primary">一键处理</xy-button>
      </div>
    </xy-affix>

    <div class="demo-affix-basic__list">
      <xy-card v-for="item in 10" :key="item" class="demo-affix-basic__card" shadow="hover">
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
  gap: 16px;
}

.demo-affix-basic__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border: 1px solid color-mix(in srgb, var(--xy-color-primary) 18%, white);
  border-radius: 18px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--xy-color-primary) 12%, white),
    rgba(255, 255, 255, 0.96)
  );
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.demo-affix-basic__toolbar strong {
  display: block;
  margin-bottom: 6px;
  color: var(--xy-text-color);
}

.demo-affix-basic__toolbar p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}

.demo-affix-basic__list {
  display: flex;
  flex-direction: column;
  gap: 14px;
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
