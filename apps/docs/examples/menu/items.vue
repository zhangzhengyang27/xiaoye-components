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
  --xy-menu-padding: 6px;
  --xy-menu-gap: 4px;
  --xy-menu-radius: 18px;
  --xy-menu-item-min-height: 34px;
  --xy-menu-item-padding-block: 5px;
  --xy-menu-item-padding-inline: 10px;
  --xy-menu-item-radius: 11px;
  --xy-menu-item-line-height: 1.2;
  --xy-menu-content-gap: 7px;
  --xy-menu-icon-size: 17px;
  --xy-menu-icon-color: var(--xy-color-primary);
  --xy-menu-hover-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--xy-color-primary) 14%, var(--xy-border-color-subtle));
  --xy-menu-active-bg: var(--xy-color-primary-soft);
  --xy-menu-active-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--xy-color-primary) 16%, var(--xy-border-color-subtle));
  --xy-menu-group-margin: 4px 0;
  --xy-menu-group-title-padding: 2px 10px 4px;
  --xy-menu-group-title-color: var(--xy-text-color-muted);
  --xy-menu-group-title-font-size: 11px;
  --xy-menu-group-title-font-weight: 700;
  --xy-menu-group-title-letter-spacing: 0.04em;
  --xy-menu-group-title-line-height: 1.2;
  --xy-menu-sub-list-padding: 4px 0 4px 10px;
  --xy-menu-item-row-gap: 8px;
  --xy-menu-item-main-gap: 7px;
  --xy-menu-item-meta-gap: 8px;
  --xy-menu-badge-min-width: 18px;
  --xy-menu-badge-height: 18px;
  --xy-menu-badge-padding: 0 5px;
  --xy-menu-badge-bg: var(--xy-color-primary-soft);
  --xy-menu-badge-color: var(--xy-color-primary);
  --xy-menu-badge-font-size: 11px;
  --xy-menu-extra-color: var(--xy-text-color-secondary);
  --xy-menu-extra-font-size: 11px;
  --xy-menu-extra-font-weight: 500;
  --xy-menu-extra-line-height: 1.2;
  --xy-menu-extra-white-space: nowrap;
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
