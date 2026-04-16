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
        <strong class="demo-menu-items__title-text">items 数据驱动菜单树</strong>
        <p class="demo-menu-items__description">
          `items` 适合后台业务直接从配置生成导航树，配合 `permission-checker`、`badge` 和
          `extra-text` 可以快速承接权限与状态展示。
        </p>
      </div>

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
        <h4 class="demo-menu-items__panel-title">{{ role === "ops" ? "Ops 管理视角" : "Viewer 只读视角" }}</h4>
        <p class="demo-menu-items__panel-description">
          {{
            role === "ops"
              ? "拥有完整系统设置权限，会看到系统设置子菜单和需要复核的权限入口。"
              : "只展示公共菜单树，所有声明了 ops:manage 的节点都会被裁剪掉。"
          }}
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
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-xl);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--xy-bg-color-subtle) 92%, white),
    var(--xy-surface-raised)
  );
  box-shadow: var(--xy-shadow-xs);
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

.demo-menu-items__title-text {
  color: var(--xy-text-color);
  font-size: 18px;
}

.demo-menu-items__description {
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
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-lg);
  background: var(--xy-surface-raised);
  box-shadow: var(--xy-shadow-card);
}

:global(.demo-menu-items__sidebar .xy-menu--vertical) {
  gap: 4px;
  padding: 6px;
  border-radius: 18px;
}

:global(.demo-menu-items__sidebar .xy-menu--vertical > .xy-menu-item),
:global(.demo-menu-items__sidebar .xy-menu--vertical > .xy-sub-menu > .xy-menu__item-surface) {
  min-height: 34px;
  padding: 5px 10px;
  border-radius: 11px;
  line-height: 1.2;
}

:global(.demo-menu-items__sidebar .xy-menu-item:hover),
:global(.demo-menu-items__sidebar .xy-sub-menu > .xy-menu__item-surface:hover) {
  background: var(--xy-bg-color-subtle);
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--xy-color-primary) 14%, var(--xy-border-color-subtle));
  transform: none;
}

:global(.demo-menu-items__sidebar .xy-menu-item.is-active),
:global(.demo-menu-items__sidebar .xy-sub-menu.is-active > .xy-menu__item-surface) {
  color: var(--xy-color-primary);
  background: var(--xy-color-primary-soft);
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--xy-color-primary) 16%, var(--xy-border-color-subtle));
}

:global(.demo-menu-items__sidebar .xy-menu__item-content) {
  gap: 7px;
}

:global(.demo-menu-items__sidebar .xy-menu-item-group) {
  margin: 4px 0;
}

:global(.demo-menu-items__sidebar .xy-menu__group-title) {
  padding: 2px 10px 4px;
  color: var(--xy-text-color-muted);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.2;
}

:global(.demo-menu-items__sidebar .xy-menu__sub-list) {
  margin: 0;
  padding: 4px 0 4px 10px;
}

:global(.demo-menu-items__sidebar .xy-menu__sub-list > .xy-menu-item) {
  min-height: 34px;
  padding: 5px 10px;
  border-radius: 10px;
  line-height: 1.2;
}

:global(.demo-menu-items__sidebar .xy-menu__item-row) {
  gap: 8px;
}

:global(.demo-menu-items__sidebar .xy-menu__item-main) {
  gap: 7px;
}

:global(.demo-menu-items__sidebar .xy-menu__item-meta) {
  gap: 8px;
}

:global(.demo-menu-items__sidebar .xy-menu__item-badge) {
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

:global(.demo-menu-items__sidebar .xy-menu__item-extra) {
  color: var(--xy-text-color-secondary);
  font-size: 11px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
}

:global(.demo-menu-items__sidebar .xy-icon) {
  font-size: 17px;
  color: var(--xy-color-primary);
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

.demo-menu-items__panel-title {
  margin: 0 0 10px;
}

.demo-menu-items__panel-description {
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
