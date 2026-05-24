<script setup lang="ts">
import { ref } from "vue";

const feedback = ref("当前激活：dashboard");

function handleSelect(index: string) {
  feedback.value = `当前激活：${index}`;
}
</script>

<template>
  <!-- 菜单基础用法：展示横向菜单的基本使用 -->
  <div class="demo-menu-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-menu-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>横向菜单</xy-tag>
        </div>
        <p class="demo-menu-basic__description">
          横向菜单适合放在页面顶部，作为主导航使用，支持下拉子菜单。
        </p>
      </template>

      <div class="demo-menu-basic__frame">
        <xy-menu
          default-active="dashboard"
          mode="horizontal"
          popper-class="demo-menu-basic__popup"
          @select="handleSelect"
        >
          <xy-menu-item index="dashboard">工作台</xy-menu-item>

          <xy-sub-menu index="workspace">
            <template #title>协作空间</template>
            <xy-menu-item index="workspace-files">文件</xy-menu-item>
            <xy-menu-item index="workspace-members">成员</xy-menu-item>
          </xy-sub-menu>

          <xy-menu-item index="orders">订单</xy-menu-item>
          <xy-menu-item index="disabled" disabled>停用入口</xy-menu-item>
          <xy-menu-item index="settings">设置</xy-menu-item>
        </xy-menu>
      </div>

      <template #footer>
        <xy-tag status="primary" round>{{ feedback }}</xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-menu-basic {
  max-width: 720px;
}

.demo-menu-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-menu-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-menu-basic__frame {
  padding: 8px 12px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-bg-color-subtle);
}

/* 横向菜单基础样式 */
.demo-menu-basic__frame :deep(.xy-menu) {
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

.demo-menu-basic__frame :deep(.xy-menu__item-surface) {
  font-size: 14px;
  font-weight: 500;
  color: var(--xy-text-color-secondary);
  transition: all 0.15s ease;
}
</style>

<style>
/* 全局下拉弹出层样式 */
.demo-menu-basic__popup {
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

.demo-menu-basic__popup .xy-menu__item-surface {
  font-size: 14px;
  font-weight: 500;
  color: var(--xy-text-color) !important;
  transition: all 0.15s ease;
}

.demo-menu-basic__popup .xy-menu__item-content {
  color: inherit !important;
}

.demo-menu-basic__popup .xy-menu__item:hover .xy-menu__item-surface,
.demo-menu-basic__popup .xy-menu__item:hover .xy-menu__item-content {
  color: var(--xy-color-primary) !important;
}

.demo-menu-basic__popup .xy-menu__item.is-active .xy-menu__item-surface,
.demo-menu-basic__popup .xy-menu__item.is-active .xy-menu__item-content {
  color: var(--xy-color-primary) !important;
  font-weight: 600;
}
</style>
