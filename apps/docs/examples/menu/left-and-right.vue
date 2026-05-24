<script setup lang="ts">
import { ref } from "vue";

const activeIndex = ref("workspace");
</script>

<template>
  <!-- 左右对齐菜单：菜单项分布在两侧 -->
  <div class="demo-menu-left-right">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-menu-left-right__header">
          <strong>左右对齐</strong>
          <xy-tag status="neutral" round>Left / Right</xy-tag>
        </div>
        <p class="demo-menu-left-right__description">
          左侧固定导航，右侧放置用户信息、通知等操作入口。
        </p>
      </template>

      <div class="demo-menu-left-right__frame">
        <xy-menu
          v-model:active-index="activeIndex"
          mode="horizontal"
          popper-class="demo-menu-left-right__popup"
        >
          <xy-menu-item index="workspace">工作区</xy-menu-item>
          <xy-sub-menu index="ops">
            <template #title>运维中心</template>
            <xy-menu-item index="alerts">告警管理</xy-menu-item>
            <xy-menu-item index="monitor">监控面板</xy-menu-item>
          </xy-sub-menu>
          <xy-menu-item index="releases">发布记录</xy-menu-item>

          <!-- 右侧固定的操作入口 -->
          <xy-menu-item
            index="search"
            class="demo-menu-left-right__spacer"
          />
          <xy-menu-item index="notifications">
            <xy-icon icon="mdi:bell-outline" />
          </xy-menu-item>
          <xy-menu-item index="profile">
            <xy-avatar size="sm">管</xy-avatar>
          </xy-menu-item>
        </xy-menu>
      </div>

      <template #footer>
        <xy-tag status="primary" round>当前选中：{{ activeIndex }}</xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-menu-left-right {
  max-width: 720px;
}

.demo-menu-left-right__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-menu-left-right__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-menu-left-right__frame {
  padding: 8px 12px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-bg-color-subtle);
}

/* 横向菜单样式 */
.demo-menu-left-right__frame :deep(.xy-menu) {
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

.demo-menu-left-right__frame :deep(.xy-menu__item-surface) {
  font-size: 14px;
  color: var(--xy-text-color-secondary);
  transition: all 0.15s ease;
}

.demo-menu-left-right__spacer {
  flex: 1;
}
</style>

<style>
/* 全局下拉弹出层样式 */
.demo-menu-left-right__popup {
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

.demo-menu-left-right__popup .xy-menu__item-surface {
  font-size: 14px;
  font-weight: 500;
  color: var(--xy-text-color) !important;
  transition: all 0.15s ease;
}

.demo-menu-left-right__popup .xy-menu__item-content {
  color: inherit !important;
}

.demo-menu-left-right__popup .xy-menu__item:hover .xy-menu__item-surface,
.demo-menu-left-right__popup .xy-menu__item:hover .xy-menu__item-content {
  color: var(--xy-color-primary) !important;
}

.demo-menu-left-right__popup .xy-menu__item.is-active .xy-menu__item-surface,
.demo-menu-left-right__popup .xy-menu__item.is-active .xy-menu__item-content {
  color: var(--xy-color-primary) !important;
  font-weight: 600;
}
</style>
