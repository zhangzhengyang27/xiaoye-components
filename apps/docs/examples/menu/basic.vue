<script setup lang="ts">
import { ref } from "vue";

const feedback = ref("当前激活：dashboard");

function handleSelect(index: string, indexPath: string[]) {
  feedback.value = `当前激活：${index} / ${indexPath.join(" > ")}`;
}
</script>

<template>
  <div class="demo-menu-basic">
    <section class="demo-menu-basic__hero">
      <header class="demo-menu-basic__header">
        <div class="demo-menu-basic__title">
          <strong class="demo-menu-basic__title-text">运营工作台导航</strong>
          <p class="demo-menu-basic__description">
            把横向菜单放进一个真实产品头部语境里，强调品牌区、导航区和右侧操作区的节奏，而不只是平铺一个导航条。
          </p>
        </div>

        <xy-space wrap>
          <xy-tag status="primary" round>{{ feedback }}</xy-tag>
          <xy-tag round>hover 打开协作空间</xy-tag>
        </xy-space>
      </header>

      <div class="demo-menu-basic__nav-shell">
        <div class="demo-menu-basic__meta">
          <span class="demo-menu-basic__env">Workspace Live</span>
          <span class="demo-menu-basic__meta-note">最后同步于 09:42</span>
        </div>

        <div class="demo-menu-basic__mainbar">
          <div class="demo-menu-basic__brand">
            <span class="demo-menu-basic__brand-mark">XO</span>
            <div>
              <strong class="demo-menu-basic__brand-title">Xiaoye Ops</strong>
              <small class="demo-menu-basic__brand-caption">导航主骨架示意</small>
            </div>
          </div>

          <xy-menu
            class="demo-menu-basic__menu"
            mode="horizontal"
            default-active="dashboard"
            popper-class="demo-menu-basic__popup"
            @select="handleSelect"
          >
            <xy-menu-item index="dashboard">工作台</xy-menu-item>

            <xy-sub-menu index="workspace">
              <template #title>协作空间</template>
              <xy-menu-item index="workspace-files">文件</xy-menu-item>
              <xy-menu-item index="workspace-members">成员</xy-menu-item>
              <xy-sub-menu index="workspace-audit">
                <template #title>审计中心</template>
                <xy-menu-item index="workspace-audit-log">日志</xy-menu-item>
                <xy-menu-item index="workspace-audit-policy">策略</xy-menu-item>
              </xy-sub-menu>
            </xy-sub-menu>

            <xy-menu-item index="orders">订单</xy-menu-item>
            <xy-menu-item index="disabled" disabled>停用入口</xy-menu-item>
            <xy-menu-item index="settings">设置</xy-menu-item>
          </xy-menu>

          <div class="demo-menu-basic__actions">
            <xy-button circle plain icon="mdi:bell-outline" aria-label="通知中心" />
            <xy-button plain>搜索</xy-button>
            <xy-button type="primary">新建任务</xy-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-menu-basic {
  width: 100%;
}

.demo-menu-basic__hero {
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

.demo-menu-basic__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.demo-menu-basic__title {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-menu-basic__title-text {
  color: var(--xy-text-color);
  font-size: 18px;
}

.demo-menu-basic__description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

.demo-menu-basic__nav-shell {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-lg);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--xy-color-primary-soft) 30%, white),
    var(--xy-surface-raised)
  );
  box-shadow: var(--xy-shadow-card);
}

.demo-menu-basic__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
}

.demo-menu-basic__env {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-menu-basic__mainbar {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 18px;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--xy-color-primary) 10%, var(--xy-border-color-subtle));
  border-radius: var(--xy-radius-md);
  background: color-mix(in srgb, var(--xy-bg-color) 96%, white);
  box-shadow: var(--xy-shadow-xs);
}

.demo-menu-basic__brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: max-content;
}

.demo-menu-basic__brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.demo-menu-basic__brand-title {
  display: block;
  color: var(--xy-text-color-heading);
}

.demo-menu-basic__brand-caption {
  color: var(--xy-text-color-secondary);
}

.demo-menu-basic__actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

:global(.demo-menu-basic__menu .xy-menu--horizontal) {
  min-height: 48px;
  padding: 6px;
  border: none;
  border-radius: 16px;
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 86%, white) !important;
  box-shadow: none;
}

:global(.demo-menu-basic__menu .xy-menu--horizontal > .xy-menu-item),
:global(.demo-menu-basic__menu .xy-menu--horizontal > .xy-sub-menu),
:global(.demo-menu-basic__menu .xy-menu--horizontal > .xy-menu__more) {
  margin: 0;
}

:global(.demo-menu-basic__menu .xy-menu--horizontal > .xy-menu-item),
:global(.demo-menu-basic__menu .xy-menu--horizontal > .xy-sub-menu > .xy-menu__horizontal-trigger),
:global(.demo-menu-basic__menu .xy-menu--horizontal > .xy-menu__more > .xy-menu__horizontal-trigger) {
  min-height: 42px;
  align-items: center;
  margin: 0;
  padding-inline: 14px;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  box-shadow: inset 0 0 0 1px transparent;
}

:global(.demo-menu-basic__menu .xy-menu--horizontal > .xy-menu-item:hover),
:global(.demo-menu-basic__menu .xy-menu--horizontal > .xy-sub-menu > .xy-menu__horizontal-trigger:hover),
:global(.demo-menu-basic__menu .xy-menu--horizontal > .xy-menu__more > .xy-menu__horizontal-trigger:hover),
:global(.demo-menu-basic__menu .xy-menu--horizontal > .xy-sub-menu.is-opened > .xy-menu__horizontal-trigger) {
  background: var(--xy-bg-color-subtle);
  color: var(--xy-text-color-heading);
  box-shadow: inset 0 0 0 1px var(--xy-border-color-subtle);
}

:global(.demo-menu-basic__menu .xy-menu--horizontal > .xy-menu-item.is-active),
:global(.demo-menu-basic__menu .xy-menu--horizontal > .xy-sub-menu.is-active > .xy-menu__horizontal-trigger) {
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--xy-color-primary) 16%, var(--xy-border-color-subtle));
}

:global(.xy-menu__popup.demo-menu-basic__popup) {
  min-width: 224px;
  padding: 10px;
  border-color: var(--xy-border-color-subtle);
  border-radius: 20px;
  background: var(--xy-bg-color-floating);
  box-shadow: var(--xy-shadow-popup);
}

:global(.xy-menu__popup.demo-menu-basic__popup .xy-menu__item-surface) {
  min-height: 40px;
  padding-inline: 14px;
  border-radius: 13px;
  color: var(--xy-text-color);
  font-weight: 600;
}

:global(.xy-menu__popup.demo-menu-basic__popup .xy-menu__group-title) {
  padding: 8px 14px 10px;
  color: var(--xy-text-color-muted);
  letter-spacing: 0.08em;
}

:global(.xy-menu__popup.demo-menu-basic__popup .xy-menu__item-surface:hover) {
  background: var(--xy-bg-color-subtle);
  box-shadow: inset 0 0 0 1px var(--xy-border-color-subtle);
}

:global(.xy-menu__popup.demo-menu-basic__popup .xy-menu__item-surface.is-active),
:global(.xy-menu__popup.demo-menu-basic__popup .xy-sub-menu.is-active > .xy-menu__item-surface) {
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
}

@media (max-width: 860px) {
  .demo-menu-basic__header,
  .demo-menu-basic__mainbar {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: stretch;
  }

  .demo-menu-basic__actions {
    justify-content: flex-end;
  }

  .demo-menu-basic__meta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
