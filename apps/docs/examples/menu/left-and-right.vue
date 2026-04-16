<template>
  <section class="demo-menu-left-right">
    <header class="demo-menu-left-right__header">
      <div class="demo-menu-left-right__title">
        <strong class="demo-menu-left-right__title-text">左右分区导航带</strong>
        <p class="demo-menu-left-right__description">品牌区保持独立，主导航居中，右侧操作入口通过示例级布局自然右收。</p>
      </div>

      <xy-space wrap>
        <xy-tag round>品牌左置</xy-tag>
        <xy-tag status="primary" round>操作右收</xy-tag>
      </xy-space>
    </header>

    <div class="demo-menu-left-right__shell">
      <div class="demo-menu-left-right__meta">
        <span class="demo-menu-left-right__env">LEFT / RIGHT NAV</span>
        <span class="demo-menu-left-right__meta-note">品牌独立 / 右侧入口自动对齐尾部</span>
      </div>

      <div class="demo-menu-left-right__mainbar">
        <div class="demo-menu-left-right__brand">
          <span class="demo-menu-left-right__brand-mark">XO</span>
          <span class="demo-menu-left-right__brand-copy">
            <strong class="demo-menu-left-right__brand-title">Xiaoye Console</strong>
            <small class="demo-menu-left-right__brand-caption">运营中枢</small>
          </span>
        </div>

        <xy-menu
          class="demo-menu-left-right__menu"
          mode="horizontal"
          default-active="workspace"
          :ellipsis="false"
          popper-class="demo-menu-left-right__popup"
        >
          <xy-menu-item index="workspace">工作区</xy-menu-item>
          <xy-sub-menu index="ops">
            <template #title>运维中心</template>
            <xy-menu-item index="ops-alerts">告警</xy-menu-item>
            <xy-menu-item index="ops-slo">SLO 面板</xy-menu-item>
          </xy-sub-menu>
          <xy-menu-item index="releases">发布记录</xy-menu-item>
          <xy-menu-item
            index="search"
            class="demo-menu-left-right__right-start demo-menu-left-right__action-item"
          >
            全局搜索
          </xy-menu-item>
          <xy-menu-item index="notifications" class="demo-menu-left-right__action-item"
            >通知</xy-menu-item
          >
          <xy-menu-item index="profile" class="demo-menu-left-right__action-item"
            >管理员</xy-menu-item
          >
        </xy-menu>
      </div>
    </div>
  </section>
</template>

<style scoped>
.demo-menu-left-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.demo-menu-left-right__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.demo-menu-left-right__title {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 680px;
}

.demo-menu-left-right__title-text {
  color: var(--xy-text-color);
  font-size: 18px;
}

.demo-menu-left-right__description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

.demo-menu-left-right__shell {
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

.demo-menu-left-right__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
}

.demo-menu-left-right__meta-note {
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.demo-menu-left-right__env {
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

.demo-menu-left-right__mainbar {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 18px;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--xy-color-primary) 10%, var(--xy-border-color-subtle));
  border-radius: var(--xy-radius-md);
  background: color-mix(in srgb, var(--xy-bg-color) 96%, white);
  box-shadow: var(--xy-shadow-xs);
}

.demo-menu-left-right__menu {
  min-width: 0;
}

:global(.demo-menu-left-right__menu .xy-menu--horizontal) {
  min-height: 48px;
  padding: 6px;
  border: none;
  border-radius: 16px;
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 86%, white) !important;
  box-shadow: none;
}

:global(.demo-menu-left-right__menu .xy-menu--horizontal > .xy-menu-item),
:global(.demo-menu-left-right__menu .xy-menu--horizontal > .xy-sub-menu),
:global(.demo-menu-left-right__menu .xy-menu--horizontal > .xy-menu__more) {
  margin: 0;
}

:global(.demo-menu-left-right__menu .xy-menu--horizontal > .demo-menu-left-right__right-start) {
  margin-left: auto;
  position: relative;
}

:global(.demo-menu-left-right__menu .xy-menu--horizontal > .demo-menu-left-right__right-start::before) {
  content: "";
  position: absolute;
  left: -8px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: var(--xy-border-color-subtle);
}

:global(.demo-menu-left-right__menu .xy-menu--horizontal > .demo-menu-left-right__action-item:not(.is-active)) {
  color: var(--xy-text-color-secondary);
  font-weight: 550;
  letter-spacing: 0.005em;
  padding-inline: 12px;
}

:global(.demo-menu-left-right__menu .xy-menu--horizontal > .xy-menu-item),
:global(.demo-menu-left-right__menu .xy-menu--horizontal > .xy-sub-menu > .xy-menu__horizontal-trigger),
:global(.demo-menu-left-right__menu .xy-menu--horizontal > .xy-menu__more > .xy-menu__horizontal-trigger) {
  min-height: 42px;
  padding-inline: 14px;
  border-radius: 12px;
  color: var(--xy-text-color);
  font-weight: 600;
  letter-spacing: 0.01em;
  box-shadow: inset 0 0 0 1px transparent;
}

:global(.demo-menu-left-right__menu .xy-menu--horizontal > .xy-menu-item:hover),
:global(.demo-menu-left-right__menu .xy-menu--horizontal > .xy-sub-menu > .xy-menu__horizontal-trigger:hover),
:global(.demo-menu-left-right__menu .xy-menu--horizontal > .xy-menu__more > .xy-menu__horizontal-trigger:hover),
:global(.demo-menu-left-right__menu .xy-menu--horizontal > .xy-sub-menu.is-opened > .xy-menu__horizontal-trigger) {
  background: var(--xy-bg-color-subtle);
  color: var(--xy-text-color-heading);
  box-shadow: inset 0 0 0 1px var(--xy-border-color-subtle);
}

:global(.demo-menu-left-right__menu .xy-menu--horizontal > .demo-menu-left-right__action-item:hover) {
  background: var(--xy-bg-color-subtle);
  color: var(--xy-text-color-heading);
  box-shadow: inset 0 0 0 1px var(--xy-border-color-subtle);
}

:global(.demo-menu-left-right__menu .xy-menu--horizontal > .xy-menu-item.is-active),
:global(.demo-menu-left-right__menu .xy-menu--horizontal > .xy-sub-menu.is-active > .xy-menu__horizontal-trigger) {
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--xy-color-primary) 16%, var(--xy-border-color-subtle));
}

:global(.xy-menu__popup.demo-menu-left-right__popup) {
  min-width: 224px;
  padding: 10px;
  border-color: var(--xy-border-color-subtle);
  border-radius: 20px;
  background: var(--xy-bg-color-floating);
  box-shadow: var(--xy-shadow-popup);
}

:global(.xy-menu__popup.demo-menu-left-right__popup .xy-menu__item-surface) {
  min-height: 40px;
  padding-inline: 14px;
  border-radius: 13px;
  color: var(--xy-text-color);
  font-weight: 600;
}

:global(.xy-menu__popup.demo-menu-left-right__popup .xy-menu__group-title) {
  padding: 8px 14px 10px;
  color: var(--xy-text-color-muted);
  letter-spacing: 0.08em;
}

:global(.xy-menu__popup.demo-menu-left-right__popup .xy-menu__item-surface:hover) {
  background: var(--xy-bg-color-subtle);
  box-shadow: inset 0 0 0 1px var(--xy-border-color-subtle);
}

:global(.xy-menu__popup.demo-menu-left-right__popup .xy-menu__item-surface.is-active),
:global(.xy-menu__popup.demo-menu-left-right__popup .xy-sub-menu.is-active > .xy-menu__item-surface) {
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
}

.demo-menu-left-right__brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: max-content;
  padding-right: 16px;
  border-right: 1px solid var(--xy-border-color-subtle);
}

.demo-menu-left-right__brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.demo-menu-left-right__brand-copy {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
}

.demo-menu-left-right__brand-title {
  display: block;
  color: var(--xy-text-color-heading);
}

.demo-menu-left-right__brand-caption {
  color: var(--xy-text-color-secondary);
}

@media (max-width: 860px) {
  .demo-menu-left-right__header,
  .demo-menu-left-right__meta,
  .demo-menu-left-right__mainbar {
    flex-direction: column;
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .demo-menu-left-right__meta-note {
    white-space: normal;
  }

  .demo-menu-left-right__brand {
    padding-right: 0;
    border-right: none;
  }

  :global(.demo-menu-left-right__menu .xy-menu--horizontal > .demo-menu-left-right__right-start) {
    margin: 0;
  }
}
</style>
