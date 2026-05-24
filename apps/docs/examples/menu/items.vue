<script setup lang="ts">
import { computed, ref } from "vue";

const role = ref<"viewer" | "ops">("viewer");

const items = computed(() => [
  {
    index: "dashboard",
    label: "数据概览",
    icon: "mdi:chart-box-outline"
  },
  {
    index: "report",
    label: "经营报表",
    icon: "mdi:file-document-outline",
    extraText: "NEW"
  },
  {
    index: "system",
    label: "系统设置",
    type: "submenu" as const,
    icon: "mdi:cog-outline",
    permission: "admin",
    children: [
      {
        index: "users",
        label: "用户管理",
        extraText: "128 人"
      },
      {
        index: "permissions",
        label: "权限配置",
        permission: "admin",
        badge: "4"
      }
    ]
  }
]);

function permissionChecker(permission: string | string[] | undefined) {
  if (!permission) return true;
  return role.value === "ops";
}
</script>

<template>
  <!-- 数据驱动菜单：通过 items 属性配置菜单 -->
  <div class="demo-menu-items">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-menu-items__header">
          <strong>数据驱动</strong>
          <xy-tag status="neutral" round>Items</xy-tag>
        </div>
        <p class="demo-menu-items__description">
          通过 items 属性配置菜单数据，支持图标、徽章、额外文本和权限过滤。
        </p>
      </template>

      <div class="demo-menu-items__controls">
        <xy-radio-group
          v-model="role"
          type="button"
          fill="var(--xy-color-primary-soft)"
          text-color="var(--xy-color-primary)"
          :options="[
            { label: 'viewer', value: 'viewer' },
            { label: 'ops', value: 'ops' }
          ]"
        />
      </div>

      <div class="demo-menu-items__content">
        <xy-menu
          :items="items"
          :permission-checker="permissionChecker"
          default-active="dashboard"
          default-openeds='["system"]'
          popper-class="demo-menu-items__popup"
        />
      </div>

      <template #footer>
        <xy-tag :status="role === 'ops' ? 'success' : 'warning'" round>
          角色：{{ role === 'ops' ? '管理员' : '访客' }}
        </xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-menu-items {
  max-width: 400px;
}

.demo-menu-items__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-menu-items__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-menu-items__controls {
  margin-bottom: 12px;
  padding: 12px 16px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-bg-color-subtle);
}

.demo-menu-items__content {
  padding: 12px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 12px;
  background: var(--xy-bg-color-subtle);
}

/* 纵向菜单样式 */
.demo-menu-items__content :deep(.xy-menu) {
  --xy-menu-padding: 6px;
  --xy-menu-gap: 4px;
  --xy-menu-item-min-height: 36px;
  --xy-menu-item-padding-inline: 12px;
  --xy-menu-item-radius: 8px;
  --xy-menu-item-gap: 10px;
  --xy-menu-item-font-weight: 500;
  --xy-menu-icon-size: 18px;
  --xy-menu-hover-bg: var(--xy-bg-color-overlay);
  --xy-menu-hover-color: var(--xy-color-primary);
  --xy-menu-active-bg: var(--xy-color-primary-soft);
  --xy-menu-active-color: var(--xy-color-primary);
  border: none;
}

.demo-menu-items__content :deep(.xy-menu__item-surface) {
  font-size: 14px;
  font-weight: 500;
  color: var(--xy-text-color);
  transition: all 0.15s ease;
}
</style>

<style>
/* 全局下拉弹出层样式 */
.demo-menu-items__popup {
  --xy-menu-popup-min-width: 200px;
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
  --xy-menu-badge-min-width: 20px;
  --xy-menu-badge-height: 20px;
  --xy-menu-badge-padding: 0 6px;
  --xy-menu-badge-bg: var(--xy-color-primary-soft);
  --xy-menu-badge-color: var(--xy-color-primary);
  --xy-menu-badge-font-size: 11px;
  --xy-menu-extra-color: var(--xy-text-color-secondary);
  --xy-menu-extra-font-size: 12px;
}

.demo-menu-items__popup .xy-menu__item-surface {
  font-size: 14px;
  font-weight: 500;
  color: var(--xy-text-color) !important;
  transition: all 0.15s ease;
}

.demo-menu-items__popup .xy-menu__item-content {
  color: inherit !important;
}

.demo-menu-items__popup .xy-menu__item:hover .xy-menu__item-surface,
.demo-menu-items__popup .xy-menu__item:hover .xy-menu__item-content {
  color: var(--xy-color-primary) !important;
}

.demo-menu-items__popup .xy-menu__item.is-active .xy-menu__item-surface,
.demo-menu-items__popup .xy-menu__item.is-active .xy-menu__item-content {
  color: var(--xy-color-primary) !important;
  font-weight: 600;
}
</style>
