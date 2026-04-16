<script setup lang="ts">
import { ref } from "vue";

const activeIndex = ref("analysis-overview");
const openedMenus = ref(["analysis"]);

function focusOverview() {
  activeIndex.value = "analysis-overview";
  openedMenus.value = ["analysis"];
}

function focusLogs() {
  activeIndex.value = "ops-logs";
  openedMenus.value = ["ops"];
}

function focusPermissions() {
  activeIndex.value = "system-permissions";
  openedMenus.value = ["system"];
}
</script>

<template>
  <section class="demo-menu-controlled">
    <header class="demo-menu-controlled__header">
      <div class="demo-menu-controlled__title">
        <strong class="demo-menu-controlled__title-text">受控状态同步</strong>
        <p class="demo-menu-controlled__description">
          通过 `active-index`、`opened-menus` 和对应的 `update:*`
          事件，把菜单状态完全交给外部业务层维护。
        </p>
      </div>

      <xy-space wrap>
        <xy-tag status="primary" round>active = {{ activeIndex }}</xy-tag>
        <xy-tag round>opened = {{ openedMenus.join(", ") || "[]" }}</xy-tag>
      </xy-space>
    </header>

    <div class="demo-menu-controlled__workspace">
      <div class="demo-menu-controlled__sidebar">
        <xy-menu
          :active-index="activeIndex"
          :opened-menus="openedMenus"
          @update:activeIndex="activeIndex = $event"
          @update:openedMenus="openedMenus = $event"
        >
          <xy-sub-menu index="analysis">
            <template #title>
              <xy-icon icon="mdi:chart-box-outline" />
              <span>分析中心</span>
            </template>
            <xy-menu-item index="analysis-overview">概览</xy-menu-item>
            <xy-menu-item index="analysis-report">经营报表</xy-menu-item>
          </xy-sub-menu>

          <xy-sub-menu index="ops">
            <template #title>
              <xy-icon icon="mdi:server-outline" />
              <span>运维中心</span>
            </template>
            <xy-menu-item index="ops-alerts">告警</xy-menu-item>
            <xy-menu-item index="ops-logs">日志</xy-menu-item>
          </xy-sub-menu>

          <xy-sub-menu index="system">
            <template #title>
              <xy-icon icon="mdi:cog-outline" />
              <span>系统设置</span>
            </template>
            <xy-menu-item index="system-users">用户</xy-menu-item>
            <xy-menu-item index="system-permissions">权限</xy-menu-item>
          </xy-sub-menu>
        </xy-menu>
      </div>

      <xy-card class="demo-menu-controlled__panel" shadow="hover">
        <span class="demo-menu-controlled__kicker">External Controller</span>
        <h4 class="demo-menu-controlled__panel-title">外部按钮直接改菜单状态</h4>
        <p class="demo-menu-controlled__panel-description">
          点击下面的快捷操作，左侧菜单会立即切换，同时 `update:activeIndex` 和 `update:openedMenus`
          也会持续同步外部状态。
        </p>

        <xy-space wrap>
          <xy-button plain @click="focusOverview">切到概览</xy-button>
          <xy-button plain @click="focusLogs">切到日志</xy-button>
          <xy-button type="primary" @click="focusPermissions">切到权限</xy-button>
        </xy-space>
      </xy-card>
    </div>
  </section>
</template>

<style scoped>
.demo-menu-controlled {
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

.demo-menu-controlled__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.demo-menu-controlled__title {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-menu-controlled__title-text {
  color: var(--xy-text-color);
  font-size: 18px;
}

.demo-menu-controlled__description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

.demo-menu-controlled__workspace {
  display: grid;
  grid-template-columns: auto minmax(300px, 1fr);
  gap: 18px;
  align-items: stretch;
}

.demo-menu-controlled__sidebar {
  padding: 10px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-lg);
  background: var(--xy-surface-raised);
  box-shadow: var(--xy-shadow-card);
}

.demo-menu-controlled__panel {
  min-height: 200px;
}

.demo-menu-controlled__kicker {
  display: inline-flex;
  margin-bottom: 10px;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-menu-controlled__panel-title {
  margin: 0 0 10px;
}

.demo-menu-controlled__panel-description {
  margin: 0 0 16px;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

@media (max-width: 860px) {
  .demo-menu-controlled__header,
  .demo-menu-controlled__workspace {
    grid-template-columns: 1fr;
  }
}
</style>
