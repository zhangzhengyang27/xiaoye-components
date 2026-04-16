<script setup lang="ts">
import { ref } from "vue";

const collapsed = ref(true);
</script>

<template>
  <div class="demo-menu-collapse">
    <section class="demo-menu-collapse__shell">
      <header class="demo-menu-collapse__header">
        <div class="demo-menu-collapse__title">
          <strong class="demo-menu-collapse__title-text">侧栏折叠工作区</strong>
          <p class="demo-menu-collapse__description">
            折叠后只保留图标主列，展开时恢复完整层级。hover、active 和弹出层更接近真实后台侧栏。
          </p>
        </div>

        <xy-radio-group
          v-model="collapsed"
          type="button"
          fill="var(--xy-color-primary-soft)"
          text-color="var(--xy-color-primary)"
          :options="[
            { label: '展开', value: false },
            { label: '折叠', value: true }
          ]"
        />
      </header>

      <div class="demo-menu-collapse__workspace">
        <div class="demo-menu-collapse__sidebar">
          <xy-menu default-active="alerts" :collapse="collapsed" :default-openeds="['ops']">
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
          <h4 class="demo-menu-collapse__panel-title">侧栏状态预览</h4>
          <p class="demo-menu-collapse__panel-description">
            {{
              collapsed
                ? "当前为折叠模式，一级导航以图标列形式承接。"
                : "当前为展开模式，可直接浏览完整菜单层级。"
            }}
          </p>
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
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-xl);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--xy-bg-color-subtle) 92%, white),
    var(--xy-surface-raised)
  );
  box-shadow: var(--xy-shadow-xs);
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

.demo-menu-collapse__title-text {
  color: var(--xy-text-color);
  font-size: 18px;
}

.demo-menu-collapse__description {
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
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-lg);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--xy-bg-color-subtle) 92%, white),
    var(--xy-surface-raised)
  );
  box-shadow: var(--xy-shadow-card);
}

:global(.demo-menu-collapse__sidebar .xy-menu) {
  width: 100%;
}

:global(.demo-menu-collapse__sidebar .xy-menu--vertical) {
  gap: 4px;
  padding: 6px;
  border-radius: 18px;
}

:global(.demo-menu-collapse__sidebar .xy-menu--vertical > .xy-menu-item),
:global(.demo-menu-collapse__sidebar .xy-menu--vertical > .xy-sub-menu > .xy-menu__item-surface) {
  min-height: 34px;
  padding: 5px 10px;
  border-radius: 11px;
  line-height: 1.2;
}

:global(.demo-menu-collapse__sidebar .xy-menu__item-content) {
  gap: 7px;
}

:global(.demo-menu-collapse__sidebar .xy-menu__sub-list) {
  margin: 0;
  padding: 4px 0 4px 10px;
}

:global(.demo-menu-collapse__sidebar .xy-menu__sub-list > .xy-menu-item) {
  min-height: 34px;
  padding: 5px 10px;
  border-radius: 10px;
  line-height: 1.2;
}

:global(.demo-menu-collapse__sidebar .xy-menu--vertical.is-collapse) {
  width: 78px;
  padding: 8px 6px;
  gap: 8px;
  border-radius: 22px;
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 92%, white);
}

:global(.demo-menu-collapse__sidebar .xy-menu--vertical.is-collapse > .xy-menu-item),
:global(.demo-menu-collapse__sidebar .xy-menu--vertical.is-collapse > .xy-sub-menu > .xy-menu__item-surface) {
  min-height: 42px;
  padding-inline: 8px;
  border-radius: 14px;
}

:global(.demo-menu-collapse__sidebar .xy-menu--vertical.is-collapse > .xy-menu-item:hover),
:global(.demo-menu-collapse__sidebar .xy-menu--vertical.is-collapse > .xy-sub-menu > .xy-menu__item-surface:hover) {
  transform: none;
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--xy-color-primary) 14%, var(--xy-border-color-subtle));
}

:global(.demo-menu-collapse__sidebar .xy-menu--vertical.is-collapse > .xy-menu-item.is-active),
:global(.demo-menu-collapse__sidebar .xy-menu--vertical.is-collapse > .xy-sub-menu.is-active > .xy-menu__item-surface) {
  color: var(--xy-color-primary);
  background: var(--xy-color-primary-soft);
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--xy-color-primary) 16%, var(--xy-border-color-subtle));
}

:global(.demo-menu-collapse__sidebar .xy-menu--vertical.is-collapse .xy-icon) {
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

.demo-menu-collapse__panel-title {
  margin: 0 0 10px;
}

.demo-menu-collapse__panel-description {
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
