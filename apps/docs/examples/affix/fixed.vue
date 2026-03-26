<template>
  <section class="demo-affix-fixed">
    <xy-affix position="bottom" :offset="24">
      <xy-button type="primary">距底部 24px</xy-button>
    </xy-affix>

    <xy-card class="demo-affix-fixed__summary" shadow="always">
      <h4>批量操作说明</h4>
      <p>底部固钉更适合承接选择后操作、提交入口和移动端风格的动作条。</p>
    </xy-card>
  </section>
</template>

<style scoped>
.demo-affix-fixed {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-affix-fixed__summary h4 {
  margin: 0 0 8px;
}

.demo-affix-fixed__summary p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}
</style>
