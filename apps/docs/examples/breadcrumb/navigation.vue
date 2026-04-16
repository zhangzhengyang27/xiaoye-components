<template>
  <div class="breadcrumb-navigation-grid">
    <xy-card shadow="hover">
      <template #header>
        <strong>原生链接</strong>
      </template>

      <xy-breadcrumb separator=">">
        <xy-breadcrumb-item href="/">首页</xy-breadcrumb-item>
        <xy-breadcrumb-item href="/components/breadcrumb" target="_blank">
          外部文档
        </xy-breadcrumb-item>
        <xy-breadcrumb-item disabled href="https://example.com">
          已禁用节点
        </xy-breadcrumb-item>
        <xy-breadcrumb-item>当前页</xy-breadcrumb-item>
      </xy-breadcrumb>
    </xy-card>

    <xy-card shadow="hover">
      <template #header>
        <strong>to / replace 兼容口</strong>
      </template>

      <xy-breadcrumb separator-icon="mdi:chevron-right">
        <xy-breadcrumb-item :to="{ path: '/orders' }">订单中心</xy-breadcrumb-item>
        <xy-breadcrumb-item to="/orders/refund" replace>退款列表</xy-breadcrumb-item>
        <xy-breadcrumb-item>详情页</xy-breadcrumb-item>
      </xy-breadcrumb>

      <p class="breadcrumb-navigation-grid__description">
        文档站没有注入 `$router`，所以 `to` 这里只保留路径配置语义；接入业务项目后会优先走 `router.push / router.replace`。
      </p>
    </xy-card>
  </div>
</template>

<style scoped>
.breadcrumb-navigation-grid {
  display: grid;
  gap: 16px;
}

.breadcrumb-navigation-grid__description {
  margin: 14px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}
</style>
