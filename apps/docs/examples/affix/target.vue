<template>
  <section class="demo-affix-target">
    <div class="demo-affix-target__container">
      <div class="demo-affix-target__edge">容器开始，继续滚动观察中间这块摘要条。</div>

      <xy-affix target=".demo-affix-target__container" :offset="32">
        <div class="demo-affix-target__toolbar">
          <div>
            <strong class="demo-affix-target__toolbar-title">当前筛选摘要</strong>
            <p class="demo-affix-target__toolbar-description">
              它只会在这个浅色容器里固定，超出边界后自动退出。
            </p>
          </div>
          <xy-button type="primary">查看明细</xy-button>
        </div>
      </xy-affix>

      <div class="demo-affix-target__content">
        <article v-for="item in 8" :key="item" class="demo-affix-target__block">
          <strong class="demo-affix-target__block-title">边界说明 {{ item }}</strong>
          <p class="demo-affix-target__block-description">
            当内容滚出这个浅色容器的范围后，固钉会自动退出，避免跨区域悬浮。
          </p>
        </article>
      </div>

      <div class="demo-affix-target__edge is-end">容器结束，越过这里后不再固定。</div>
    </div>
  </section>
</template>

<style scoped>
.demo-affix-target__container {
  padding: 18px;
  border-radius: 18px;
  border: 1px solid var(--xy-border-color-subtle);
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 82%, white);
}

.demo-affix-target__edge {
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color-subtle) 88%, white);
  background: color-mix(in srgb, var(--xy-surface-raised) 94%, white);
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}

.demo-affix-target__edge.is-end {
  margin-top: 16px;
  text-align: center;
}

.demo-affix-target__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid color-mix(in srgb, var(--xy-color-primary) 10%, var(--xy-border-color-subtle));
  background: var(--xy-surface-raised);
  box-shadow: var(--xy-shadow-xs);
}

.demo-affix-target__toolbar-title {
  display: block;
  margin-bottom: 6px;
  color: var(--xy-text-color-heading);
}

.demo-affix-target__toolbar-description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
}

.demo-affix-target__content {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 18px;
}

.demo-affix-target__block {
  padding: 16px 18px;
  border-radius: 14px;
  background: color-mix(in srgb, var(--xy-surface-raised) 94%, white);
  border: 1px solid var(--xy-border-color-subtle);
}

.demo-affix-target__block-title {
  display: block;
  margin-bottom: 8px;
  color: var(--xy-text-color-heading);
}

.demo-affix-target__block-description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
