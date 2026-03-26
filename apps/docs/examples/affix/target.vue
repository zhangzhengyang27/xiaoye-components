<template>
  <section class="demo-affix-target">
    <div class="demo-affix-target__container">
      <div class="demo-affix-target__edge">容器开始，继续滚动观察中间这块摘要条。</div>

      <xy-affix target=".demo-affix-target__container" :offset="32">
        <div class="demo-affix-target__toolbar">
          <div>
            <strong>当前筛选摘要</strong>
            <p>它只会在这个浅色容器里固定，超出边界后自动退出。</p>
          </div>
          <xy-button type="primary">查看明细</xy-button>
        </div>
      </xy-affix>

      <div class="demo-affix-target__content">
        <article v-for="item in 8" :key="item" class="demo-affix-target__block">
          <strong>边界说明 {{ item }}</strong>
          <p>当内容滚出这个浅色容器的范围后，固钉会自动退出，避免跨区域悬浮。</p>
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
  background: color-mix(in srgb, var(--xy-color-primary) 10%, white);
}

.demo-affix-target__edge {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
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
  border: 1px solid color-mix(in srgb, var(--xy-color-primary) 18%, white);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.demo-affix-target__toolbar strong {
  display: block;
  margin-bottom: 6px;
}

.demo-affix-target__toolbar p {
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
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid color-mix(in srgb, var(--xy-color-primary) 18%, white);
}

.demo-affix-target__block strong {
  display: block;
  margin-bottom: 8px;
}

.demo-affix-target__block p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
