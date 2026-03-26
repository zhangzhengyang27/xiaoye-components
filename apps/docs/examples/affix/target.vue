<template>
  <section class="demo-affix-target">
    <div class="demo-affix-target__container">
      <xy-affix target=".demo-affix-target__container" :offset="72">
        <xy-button type="primary">容器内固钉</xy-button>
      </xy-affix>

      <div class="demo-affix-target__content">
        <article v-for="item in 5" :key="item" class="demo-affix-target__block">
          <strong>边界说明 {{ item }}</strong>
          <p>当内容滚出这个浅色容器的范围后，固钉会自动退出，避免跨区域悬浮。</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.demo-affix-target__container {
  padding: 16px;
  border-radius: 18px;
  background: color-mix(in srgb, var(--xy-color-primary) 10%, white);
}

.demo-affix-target__content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
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
