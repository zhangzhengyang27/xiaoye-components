<script setup lang="ts">
import { ref } from "vue";

const feedback = ref("");

function handleSelect(index: string) {
  feedback.value = `选择：${index}`;
}
</script>

<template>
  <!-- 菜单溢出：横向菜单超出时收进更多 -->
  <div class="demo-menu-overflow">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-menu-overflow__header">
          <strong>菜单溢出</strong>
          <xy-tag status="neutral" round>Ellipsis</xy-tag>
        </div>
        <p class="demo-menu-overflow__description">
          设置 ellipsis 属性，超出容器的菜单项会收进「更多」下拉中。
        </p>
      </template>

      <div class="demo-menu-overflow__frame">
        <xy-menu
          mode="horizontal"
          ellipsis
          default-active="home"
          popper-class="demo-menu-overflow__popup"
          @select="handleSelect"
        >
          <xy-menu-item index="home">首页</xy-menu-item>
          <xy-sub-menu index="product">
            <template #title>产品中心</template>
            <xy-menu-item index="product-list">产品列表</xy-menu-item>
            <xy-menu-item index="product-add">添加产品</xy-menu-item>
          </xy-sub-menu>
          <xy-menu-item index="order">订单管理</xy-menu-item>
          <xy-menu-item index="finance">财务管理</xy-menu-item>
          <xy-menu-item index="marketing">营销活动</xy-menu-item>
          <xy-menu-item index="settings">系统设置</xy-menu-item>
        </xy-menu>
      </div>

      <template #footer>
        <xy-tag status="primary" round>{{ feedback || "点击菜单项查看反馈" }}</xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-menu-overflow {
  max-width: 640px;
}

.demo-menu-overflow__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-menu-overflow__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-menu-overflow__frame {
  padding: 8px 12px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-bg-color-subtle);
}

/* 横向菜单样式 */
.demo-menu-overflow__frame :deep(.xy-menu) {
  --xy-menu-horizontal-height: 44px;
  --xy-menu-item-min-height: 36px;
  --xy-menu-horizontal-item-padding-inline: 14px;
  --xy-menu-item-radius: 8px;
  --xy-menu-item-font-weight: 500;
  --xy-menu-text-color: var(--xy-text-color-secondary);
  --xy-menu-hover-bg: var(--xy-bg-color-overlay);
  --xy-menu-hover-color: var(--xy-text-color-heading);
  --xy-menu-active-bg: var(--xy-color-primary-soft);
  --xy-menu-active-color: var(--xy-color-primary);
  border: none;
  background: transparent;
}

.demo-menu-overflow__frame :deep(.xy-menu__item-surface) {
  font-size: 14px;
  color: var(--xy-text-color-secondary);
  transition: all 0.15s ease;
}
</style>

<style>
/* 全局下拉弹出层样式 */
.demo-menu-overflow__popup {
  --xy-menu-popup-min-width: 180px;
  --xy-menu-popup-padding: 8px;
  --xy-menu-popup-radius: 14px;
  --xy-menu-popup-bg: var(--xy-bg-color-floating) !important;
  --xy-menu-popup-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  --xy-menu-item-min-height: 40px;
  --xy-menu-item-padding-inline: 14px;
  --xy-menu-item-radius: 10px;
  --xy-menu-item-gap: 10px;
  --xy-menu-item-font-weight: 500;
  --xy-menu-text-color: var(--xy-text-color);
  --xy-menu-hover-bg: var(--xy-bg-color-overlay) !important;
  --xy-menu-hover-color: var(--xy-color-primary) !important;
  --xy-menu-active-bg: var(--xy-color-primary-soft) !important;
  --xy-menu-active-color: var(--xy-color-primary) !important;
  --xy-menu-active-shadow: none !important;
}

.demo-menu-overflow__popup .xy-menu__item-surface {
  font-size: 14px;
  font-weight: 500;
  color: var(--xy-text-color) !important;
  transition: all 0.15s ease;
}

.demo-menu-overflow__popup .xy-menu__item-content {
  color: inherit !important;
}

.demo-menu-overflow__popup .xy-menu__item:hover .xy-menu__item-surface,
.demo-menu-overflow__popup .xy-menu__item:hover .xy-menu__item-content {
  color: var(--xy-color-primary) !important;
}

.demo-menu-overflow__popup .xy-menu__item.is-active .xy-menu__item-surface,
.demo-menu-overflow__popup .xy-menu__item.is-active .xy-menu__item-content {
  color: var(--xy-color-primary) !important;
  font-weight: 600;
}
</style>
