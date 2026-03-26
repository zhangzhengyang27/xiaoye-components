<script setup lang="ts">
import { ref } from "vue";

const collapsed = ref(true);
</script>

<template>
  <div class="demo-menu-collapse">
    <section class="demo-menu-collapse__shell">
      <header class="demo-menu-collapse__header">
        <div class="demo-menu-collapse__title">
          <strong>侧栏折叠工作区</strong>
          <p>折叠后只保留图标主列，展开时恢复完整层级。hover、active 和弹出层更接近真实后台侧栏。</p>
        </div>

        <xy-radio-group
          v-model="collapsed"
          type="button"
          fill="#1d4ed8"
          text-color="#f8fafc"
          :options="[
            { label: '展开', value: false },
            { label: '折叠', value: true }
          ]"
        />
      </header>

      <div class="demo-menu-collapse__workspace">
        <div class="demo-menu-collapse__sidebar">
          <xy-menu
            default-active="alerts"
            :collapse="collapsed"
            :default-openeds="['ops']"
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
              <template #title>发布中心</template>
            </xy-menu-item>

            <xy-menu-item index="assets" disabled>
              <xy-icon icon="mdi:archive-outline" />
              <template #title>资产管理</template>
            </xy-menu-item>
          </xy-menu>
        </div>

        <xy-card class="demo-menu-collapse__panel" shadow="hover">
          <span class="demo-menu-collapse__kicker">Preview Panel</span>
          <h4>侧栏状态预览</h4>
          <p>{{ collapsed ? "当前为折叠模式，一级导航以图标列形式承接。" : "当前为展开模式，可直接浏览完整菜单层级。" }}</p>
          <xy-space wrap>
            <xy-tag :status="collapsed ? 'warning' : 'success'" round>
              {{ collapsed ? "Collapsed" : "Expanded" }}
            </xy-tag>
            <xy-tag round>active = alerts</xy-tag>
          </xy-space>
        </xy-card>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-menu-collapse {
  width: 100%;
}

.demo-menu-collapse__shell {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 24px;
  background:
    radial-gradient(circle at top left, color-mix(in srgb, var(--xy-color-primary) 8%, white), transparent 34%),
    linear-gradient(180deg, color-mix(in srgb, var(--xy-bg-color) 96%, white), var(--xy-bg-color));
}

.demo-menu-collapse__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.demo-menu-collapse__title {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-menu-collapse__title strong {
  color: var(--xy-text-color);
  font-size: 18px;
}

.demo-menu-collapse__title p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

.demo-menu-collapse__workspace {
  display: grid;
  grid-template-columns: auto minmax(260px, 1fr);
  gap: 18px;
  align-items: stretch;
}

.demo-menu-collapse__sidebar {
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 12px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 86%, white);
  border-radius: 20px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.92)),
    radial-gradient(circle at top left, color-mix(in srgb, var(--xy-color-primary) 8%, white), transparent 34%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 18px 36px rgba(15, 23, 42, 0.06);
}

.demo-menu-collapse__sidebar :deep(.xy-menu) {
  width: 100%;
}

.demo-menu-collapse__sidebar :deep(.xy-menu--vertical) {
  gap: 4px;
  padding: 6px;
  border-radius: 18px;
}

.demo-menu-collapse__sidebar :deep(.xy-menu--vertical > .xy-menu-item),
.demo-menu-collapse__sidebar :deep(.xy-menu--vertical > .xy-sub-menu > .xy-sub-menu__title) {
  min-height: 34px;
  padding: 5px 10px;
  border-radius: 11px;
  line-height: 1.2;
}

.demo-menu-collapse__sidebar :deep(.xy-menu-item__content),
.demo-menu-collapse__sidebar :deep(.xy-sub-menu__title-content) {
  gap: 7px;
}

.demo-menu-collapse__sidebar :deep(.xy-sub-menu__wrap) {
  margin: 0;
  padding: 4px 0 4px 10px;
}

.demo-menu-collapse__sidebar :deep(.xy-sub-menu__wrap .xy-menu-item) {
  min-height: 34px;
  padding: 5px 10px;
  border-radius: 10px;
  line-height: 1.2;
}

.demo-menu-collapse__sidebar :deep(.xy-menu--vertical.is-collapse) {
  width: 78px;
  padding: 8px 6px;
  gap: 8px;
  border-radius: 22px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.96),
    0 12px 28px rgba(15, 23, 42, 0.08);
}

.demo-menu-collapse__sidebar :deep(.xy-menu--vertical.is-collapse > .xy-menu-item),
.demo-menu-collapse__sidebar :deep(.xy-menu--vertical.is-collapse > .xy-sub-menu > .xy-sub-menu__title) {
  min-height: 42px;
  padding-inline: 8px;
  border-radius: 14px;
}

.demo-menu-collapse__sidebar :deep(.xy-menu--vertical.is-collapse > .xy-menu-item:hover),
.demo-menu-collapse__sidebar :deep(.xy-menu--vertical.is-collapse > .xy-sub-menu > .xy-sub-menu__title:hover) {
  transform: none;
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--xy-color-primary) 14%, white),
    0 10px 20px rgba(15, 23, 42, 0.08);
}

.demo-menu-collapse__sidebar :deep(.xy-menu--vertical.is-collapse > .xy-menu-item.is-active),
.demo-menu-collapse__sidebar :deep(.xy-menu--vertical.is-collapse > .xy-sub-menu.is-active > .xy-sub-menu__title) {
  color: #1d4ed8;
  background: linear-gradient(180deg, rgba(37, 99, 235, 0.14), rgba(59, 130, 246, 0.08));
  box-shadow:
    inset 0 0 0 1px rgba(96, 165, 250, 0.22),
    0 12px 22px rgba(37, 99, 235, 0.12);
}

.demo-menu-collapse__sidebar :deep(.xy-menu--vertical.is-collapse .xy-icon) {
  font-size: 18px;
}

.demo-menu-collapse__panel {
  min-height: 220px;
}

.demo-menu-collapse__kicker {
  display: inline-flex;
  margin-bottom: 10px;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-menu-collapse__panel h4 {
  margin: 0 0 10px;
}

.demo-menu-collapse__panel p {
  margin: 0 0 14px;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

@media (max-width: 860px) {
  .demo-menu-collapse__header,
  .demo-menu-collapse__workspace {
    grid-template-columns: 1fr;
  }
}
</style>
