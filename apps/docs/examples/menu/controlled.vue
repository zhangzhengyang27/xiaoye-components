<script setup lang="ts">
import { ref } from "vue";

const activeIndex = ref("overview");
const openedMenus = ref(["analysis"]);

function handleSelect(index: string) {
  activeIndex.value = index;
}

function handleOpen(index: string | number) {
  if (!openedMenus.value.includes(String(index))) {
    openedMenus.value.push(String(index));
  }
}

function handleClose(index: string | number) {
  openedMenus.value = openedMenus.value.filter((i) => i !== String(index));
}
</script>

<template>
  <!-- 受控模式：外部控制菜单的选中状态 -->
  <div class="demo-menu-controlled">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-menu-controlled__header">
          <strong>受控模式</strong>
          <xy-tag status="neutral" round>Controlled</xy-tag>
        </div>
        <p class="demo-menu-controlled__description">
          通过 active-index 和 opened-menus 控制菜单状态，支持 update 事件同步。
        </p>
      </template>

      <div class="demo-menu-controlled__content">
        <xy-menu
          :active-index="activeIndex"
          :opened-menus="openedMenus"
          popper-class="demo-menu-controlled__popup"
          @select="handleSelect"
          @open="handleOpen"
          @close="handleClose"
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
            <xy-menu-item index="permissions">权限配置</xy-menu-item>
          </xy-sub-menu>
        </xy-menu>
      </div>

      <template #footer>
        <xy-space wrap>
          <xy-tag status="primary" round>active: {{ activeIndex }}</xy-tag>
          <xy-tag round>opened: {{ openedMenus.join(", ") || "无" }}</xy-tag>
        </xy-space>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-menu-controlled {
  max-width: 480px;
}

.demo-menu-controlled__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-menu-controlled__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-menu-controlled__content {
  padding: 12px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-bg-color-subtle);
}

/* 纵向菜单样式 */
.demo-menu-controlled__content :deep(.xy-menu) {
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

.demo-menu-controlled__content :deep(.xy-menu__item-surface) {
  font-size: 14px;
  font-weight: 500;
  color: var(--xy-text-color);
  transition: all 0.15s ease;
}
</style>

<style>
/* 全局下拉弹出层样式 */
.demo-menu-controlled__popup {
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

.demo-menu-controlled__popup .xy-menu__item-surface {
  font-size: 14px;
  font-weight: 500;
  color: var(--xy-text-color) !important;
  transition: all 0.15s ease;
}

.demo-menu-controlled__popup .xy-menu__item-content {
  color: inherit !important;
}

.demo-menu-controlled__popup .xy-menu__item:hover .xy-menu__item-surface,
.demo-menu-controlled__popup .xy-menu__item:hover .xy-menu__item-content {
  color: var(--xy-color-primary) !important;
}

.demo-menu-controlled__popup .xy-menu__item.is-active .xy-menu__item-surface,
.demo-menu-controlled__popup .xy-menu__item.is-active .xy-menu__item-content {
  color: var(--xy-color-primary) !important;
  font-weight: 600;
}
</style>
