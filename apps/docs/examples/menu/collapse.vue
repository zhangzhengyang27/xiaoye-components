<script setup lang="ts">
import { ref } from "vue";

const collapsed = ref(false);
</script>

<template>
  <!-- 菜单折叠：展示可折叠的纵向菜单 -->
  <div class="demo-menu-collapse">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-menu-collapse__header">
          <strong>菜单折叠</strong>
          <xy-tag status="neutral" round>Collapse</xy-tag>
        </div>
        <p class="demo-menu-collapse__description">
          设置 collapse 属性可以折叠菜单为图标模式，适合空间有限的场景。
        </p>
      </template>

      <div class="demo-menu-collapse__controls">
        <xy-switch v-model="collapsed" />
        <xy-tag :status="collapsed ? 'warning' : 'success'" round>
          {{ collapsed ? "已折叠" : "已展开" }}
        </xy-tag>
      </div>

      <div class="demo-menu-collapse__content">
        <xy-menu
          default-active="alerts"
          :collapse="collapsed"
          default-openeds='["ops"]'
          popper-class="demo-menu-collapse__popup"
        >
          <xy-sub-menu index="ops">
            <template #title>
              <xy-icon icon="mdi:server-outline" />
              <span>运维中心</span>
            </template>
            <xy-menu-item index="alerts">告警</xy-menu-item>
            <xy-menu-item index="logs">日志</xy-menu-item>
          </xy-sub-menu>

          <xy-menu-item index="release">
            <xy-icon icon="mdi:rocket-launch-outline" />
            <span>发布中心</span>
          </xy-menu-item>

          <xy-menu-item index="assets" disabled>
            <xy-icon icon="mdi:archive-outline" />
            <span>资产管理</span>
          </xy-menu-item>
        </xy-menu>
      </div>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-menu-collapse {
  max-width: 400px;
}

.demo-menu-collapse__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-menu-collapse__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-menu-collapse__controls {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 12px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-bg-color-subtle);
}

.demo-menu-collapse__content {
  padding: 12px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-bg-color-subtle);
}

/* 纵向菜单样式 */
.demo-menu-collapse__content :deep(.xy-menu) {
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

.demo-menu-collapse__content :deep(.xy-menu__item-surface) {
  font-size: 14px;
  font-weight: 500;
  color: var(--xy-text-color);
  transition: all 0.15s ease;
}

/* 折叠模式样式 */
.demo-menu-collapse__content :deep(.xy-menu--collapse) {
  --xy-menu-collapse-width: 72px;
}
</style>

<style>
/* 全局下拉弹出层样式 */
.demo-menu-collapse__popup {
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

.demo-menu-collapse__popup .xy-menu__item-surface {
  font-size: 14px;
  font-weight: 500;
  color: var(--xy-text-color) !important;
  transition: all 0.15s ease;
}

.demo-menu-collapse__popup .xy-menu__item-content {
  color: inherit !important;
}

.demo-menu-collapse__popup .xy-menu__item:hover .xy-menu__item-surface,
.demo-menu-collapse__popup .xy-menu__item:hover .xy-menu__item-content {
  color: var(--xy-color-primary) !important;
}

.demo-menu-collapse__popup .xy-menu__item.is-active .xy-menu__item-surface,
.demo-menu-collapse__popup .xy-menu__item.is-active .xy-menu__item-content {
  color: var(--xy-color-primary) !important;
  font-weight: 600;
}
</style>
