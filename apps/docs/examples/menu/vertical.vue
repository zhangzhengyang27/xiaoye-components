<script setup lang="ts">
import { ref } from "vue";

const activeName = ref("overview");
</script>

<template>
  <!-- 纵向菜单：展示垂直排列的菜单 -->
  <div class="demo-menu-vertical">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-menu-vertical__header">
          <strong>纵向菜单</strong>
          <xy-tag status="neutral" round>Vertical</xy-tag>
        </div>
        <p class="demo-menu-vertical__description">
          纵向菜单适合放在页面左侧，作为侧边导航使用。
        </p>
      </template>

      <div class="demo-menu-vertical__content">
        <xy-menu
          v-model:active-index="activeName"
          default-openeds='["analysis", "system"]'
          popper-class="demo-menu-vertical__popup"
        >
          <xy-sub-menu index="analysis">
            <template #title>
              <xy-icon icon="mdi:chart-box-outline" />
              <span>分析中心</span>
            </template>

            <xy-menu-item index="overview">数据概览</xy-menu-item>
            <xy-menu-item index="report">经营报表</xy-menu-item>
          </xy-sub-menu>

          <xy-menu-item index="workbench">
            <xy-icon icon="mdi:view-dashboard-outline" />
            <span>工作台</span>
          </xy-menu-item>

          <xy-sub-menu index="system">
            <template #title>
              <xy-icon icon="mdi:cog-outline" />
              <span>系统设置</span>
            </template>
            <xy-menu-item index="users">用户管理</xy-menu-item>
            <xy-menu-item index="roles">角色权限</xy-menu-item>
          </xy-sub-menu>
        </xy-menu>
      </div>

      <template #footer>
        <xy-tag status="primary" round>当前选中：{{ activeName }}</xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-menu-vertical {
  max-width: 400px;
}

.demo-menu-vertical__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-menu-vertical__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-menu-vertical__content {
  padding: 12px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-bg-color-subtle);
}

/* 纵向菜单样式 */
.demo-menu-vertical__content :deep(.xy-menu) {
  --xy-menu-padding: 6px;
  --xy-menu-gap: 4px;
  --xy-menu-item-min-height: 40px;
  --xy-menu-item-padding-inline: 12px;
  --xy-menu-item-radius: 10px;
  --xy-menu-item-gap: 10px;
  --xy-menu-item-font-weight: 500;
  --xy-menu-icon-size: 18px;
  --xy-menu-icon-color: var(--xy-text-color-secondary);
  --xy-menu-hover-bg: var(--xy-bg-color-overlay);
  --xy-menu-hover-color: var(--xy-color-primary);
  --xy-menu-active-bg: var(--xy-color-primary-soft);
  --xy-menu-active-color: var(--xy-color-primary);
  border: none;
}

.demo-menu-vertical__content :deep(.xy-menu__item-surface) {
  font-size: 14px;
  font-weight: 500;
  color: var(--xy-text-color);
  transition: all 0.15s ease;
}
</style>

<style>
/* 全局下拉弹出层样式 */
.demo-menu-vertical__popup {
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

.demo-menu-vertical__popup .xy-menu__item-surface {
  font-size: 14px;
  font-weight: 500;
  color: var(--xy-text-color) !important;
  transition: all 0.15s ease;
}

.demo-menu-vertical__popup .xy-menu__item-content {
  color: inherit !important;
}

.demo-menu-vertical__popup .xy-menu__item:hover .xy-menu__item-surface,
.demo-menu-vertical__popup .xy-menu__item:hover .xy-menu__item-content {
  color: var(--xy-color-primary) !important;
}

.demo-menu-vertical__popup .xy-menu__item.is-active .xy-menu__item-surface,
.demo-menu-vertical__popup .xy-menu__item.is-active .xy-menu__item-content {
  color: var(--xy-color-primary) !important;
  font-weight: 600;
}
</style>
