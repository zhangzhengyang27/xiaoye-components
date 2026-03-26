<script setup lang="ts">
import { computed, ref } from "vue";

const role = ref<"viewer" | "ops">("viewer");

const items = computed(() => [
  {
    index: "analysis",
    label: "分析中心",
    type: "submenu" as const,
    icon: "mdi:chart-box-outline",
    badge: "3",
    children: [
      {
        index: "analysis-group",
        label: "经营指标",
        type: "group" as const,
        children: [
          {
            index: "analysis-overview",
            label: "概览",
            badge: "12",
            extraText: "2 分钟前"
          },
          {
            index: "analysis-report",
            label: "经营报表",
            extraText: "夜间批次"
          }
        ]
      },
      {
        index: "analysis-automation",
        label: "自动化",
        type: "group" as const,
        children: [
          {
            index: "analysis-rules",
            label: "规则引擎",
            badge: "2",
            extraText: "待审批"
          }
        ]
      }
    ]
  },
  {
    index: "workbench",
    label: "工作台",
    icon: "mdi:view-dashboard-outline",
    extraText: "稳定"
  },
  {
    index: "system",
    label: "系统设置",
    type: "submenu" as const,
    icon: "mdi:cog-outline",
    permission: "ops:manage",
    children: [
      {
        index: "system-users",
        label: "用户",
        extraText: "128 人"
      },
      {
        index: "system-permissions",
        label: "权限",
        badge: "4",
        extraText: "需复核",
        permission: "ops:manage"
      }
    ]
  }
]);

function permissionChecker(permission: string | string[] | undefined) {
  if (!permission) {
    return true;
  }

  if (role.value === "ops") {
    return true;
  }

  const permissions = Array.isArray(permission) ? permission : [permission];
  return !permissions.includes("ops:manage");
}
</script>

<template>
  <section class="demo-menu-items">
    <header class="demo-menu-items__header">
      <div class="demo-menu-items__title">
        <strong>items 数据驱动菜单树</strong>
        <p>`items` 适合后台业务直接从配置生成导航树，配合 `permission-checker`、`badge` 和 `extra-text` 可以快速承接权限与状态展示。</p>
      </div>

      <xy-radio-group
        v-model="role"
        type="button"
        fill="#1d4ed8"
        text-color="#f8fafc"
        :options="[
          { label: 'viewer', value: 'viewer' },
          { label: 'ops', value: 'ops' }
        ]"
      />
    </header>

    <div class="demo-menu-items__workspace">
      <div class="demo-menu-items__sidebar">
        <xy-menu
          :items="items"
          default-active="analysis-overview"
          :default-openeds="['analysis', 'system']"
          :permission-checker="permissionChecker"
        />
      </div>

      <xy-card class="demo-menu-items__panel" shadow="hover">
        <span class="demo-menu-items__kicker">Role Scope</span>
        <h4>{{ role === "ops" ? "Ops 管理视角" : "Viewer 只读视角" }}</h4>
        <p>
          {{ role === "ops"
            ? "拥有完整系统设置权限，会看到系统设置子菜单和需要复核的权限入口。"
            : "只展示公共菜单树，所有声明了 ops:manage 的节点都会被裁剪掉。" }}
        </p>

        <xy-space wrap>
          <xy-tag status="primary" round>badge</xy-tag>
          <xy-tag round>extraText</xy-tag>
          <xy-tag :status="role === 'ops' ? 'success' : 'warning'" round>
            permissionChecker
          </xy-tag>
        </xy-space>
      </xy-card>
    </div>
  </section>
</template>

<style scoped>
.demo-menu-items {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--xy-color-primary) 8%, white), transparent 36%),
    linear-gradient(180deg, color-mix(in srgb, var(--xy-bg-color) 96%, white), var(--xy-bg-color));
}

.demo-menu-items__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.demo-menu-items__title {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-menu-items__title strong {
  color: var(--xy-text-color);
  font-size: 18px;
}

.demo-menu-items__title p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

.demo-menu-items__workspace {
  display: grid;
  grid-template-columns: auto minmax(300px, 1fr);
  gap: 18px;
  align-items: stretch;
}

.demo-menu-items__sidebar {
  padding: 10px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 86%, white);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.06);
}

.demo-menu-items__sidebar :deep(.xy-menu--vertical) {
  gap: 4px;
  padding: 6px;
  border-radius: 18px;
}

.demo-menu-items__sidebar :deep(.xy-menu--vertical > li + li),
.demo-menu-items__sidebar :deep(.xy-menu-item-group__list > li + li),
.demo-menu-items__sidebar :deep(.xy-sub-menu__wrap > li + li) {
  margin-top: 0;
}

.demo-menu-items__sidebar :deep(.xy-menu--vertical > .xy-menu-item),
.demo-menu-items__sidebar :deep(.xy-menu--vertical > .xy-sub-menu > .xy-sub-menu__title) {
  min-height: 34px;
  padding: 5px 10px;
  border-radius: 11px;
  line-height: 1.2;
}

.demo-menu-items__sidebar :deep(.xy-menu-item:hover),
.demo-menu-items__sidebar :deep(.xy-sub-menu__title:hover) {
  background: color-mix(in srgb, var(--xy-color-primary) 7%, white);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--xy-color-primary) 14%, white),
    0 8px 16px rgba(15, 23, 42, 0.05);
  transform: none;
}

.demo-menu-items__sidebar :deep(.xy-menu-item.is-active),
.demo-menu-items__sidebar :deep(.xy-sub-menu.is-active > .xy-sub-menu__title) {
  color: color-mix(in srgb, var(--xy-color-primary) 90%, #1d4ed8);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--xy-color-primary) 11%, white),
    color-mix(in srgb, var(--xy-color-primary) 6%, white)
  );
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--xy-color-primary) 16%, white),
    0 10px 20px rgba(37, 99, 235, 0.08);
}

.demo-menu-items__sidebar :deep(.xy-menu-item__content),
.demo-menu-items__sidebar :deep(.xy-sub-menu__title-content) {
  gap: 7px;
}

.demo-menu-items__sidebar :deep(.xy-menu-item-group) {
  margin: 4px 0;
}

.demo-menu-items__sidebar :deep(.xy-menu-item-group__title) {
  padding: 2px 10px 4px;
  color: color-mix(in srgb, var(--xy-text-color-secondary) 92%, #64748b);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.2;
}

.demo-menu-items__sidebar :deep(.xy-sub-menu__wrap) {
  margin: 0;
  padding: 4px 0 4px 10px;
}

.demo-menu-items__sidebar :deep(.xy-sub-menu__wrap .xy-menu-item) {
  min-height: 34px;
  padding: 5px 10px;
  border-radius: 10px;
  line-height: 1.2;
}

.demo-menu-items__sidebar :deep(.xy-menu__item-row) {
  gap: 8px;
}

.demo-menu-items__sidebar :deep(.xy-menu__item-main) {
  gap: 7px;
}

.demo-menu-items__sidebar :deep(.xy-menu__item-meta) {
  gap: 8px;
}

.demo-menu-items__sidebar :deep(.xy-menu__item-badge) {
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: color-mix(in srgb, var(--xy-color-primary) 10%, white);
  color: color-mix(in srgb, var(--xy-color-primary) 88%, #1d4ed8);
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

.demo-menu-items__sidebar :deep(.xy-menu__item-extra) {
  color: color-mix(in srgb, var(--xy-text-color-secondary) 92%, #64748b);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
}

.demo-menu-items__sidebar :deep(.xy-icon) {
  font-size: 17px;
  color: color-mix(in srgb, var(--xy-color-primary) 88%, #2563eb);
}

.demo-menu-items__panel {
  min-height: 200px;
}

.demo-menu-items__kicker {
  display: inline-flex;
  margin-bottom: 10px;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-menu-items__panel h4 {
  margin: 0 0 10px;
}

.demo-menu-items__panel p {
  margin: 0 0 16px;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

@media (max-width: 900px) {
  .demo-menu-items__header,
  .demo-menu-items__workspace {
    grid-template-columns: 1fr;
  }
}
</style>
