<template>
  <section class="demo-menu-left-right">
    <header class="demo-menu-left-right__header">
      <div class="demo-menu-left-right__title">
        <strong>左右分区导航带</strong>
        <p>品牌区保持独立，主导航居中，右侧操作入口通过示例级布局自然右收。</p>
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
            <strong>Xiaoye Console</strong>
            <small>运营中枢</small>
          </span>
        </div>

        <xy-menu
          class="demo-menu-left-right__menu"
          mode="horizontal"
          default-active="workspace"
          :ellipsis="false"
          background-color="#0f172a"
          text-color="rgba(226, 232, 240, 0.78)"
          active-text-color="#f8fafc"
          popper-effect="dark"
          popper-class="demo-menu-left-right__popup"
        >
          <xy-menu-item index="workspace">工作区</xy-menu-item>
          <xy-sub-menu index="ops">
            <template #title>运维中心</template>
            <xy-menu-item index="ops-alerts">告警</xy-menu-item>
            <xy-menu-item index="ops-slo">SLO 面板</xy-menu-item>
          </xy-sub-menu>
          <xy-menu-item index="releases">发布记录</xy-menu-item>
          <xy-menu-item index="search" class="demo-menu-left-right__right-start demo-menu-left-right__action-item">
            全局搜索
          </xy-menu-item>
          <xy-menu-item index="notifications" class="demo-menu-left-right__action-item">通知</xy-menu-item>
          <xy-menu-item index="profile" class="demo-menu-left-right__action-item">管理员</xy-menu-item>
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
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--xy-color-primary) 8%, white), transparent 34%),
    linear-gradient(180deg, color-mix(in srgb, var(--xy-bg-color) 96%, white), var(--xy-bg-color));
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

.demo-menu-left-right__title strong {
  color: var(--xy-text-color);
  font-size: 18px;
}

.demo-menu-left-right__title p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

.demo-menu-left-right__shell {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  border: 1px solid rgba(15, 23, 42, 0.06);
  border-radius: 22px;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.9)),
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.28), transparent 36%);
  box-shadow: 0 22px 42px rgba(15, 23, 42, 0.12);
}

.demo-menu-left-right__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: rgba(226, 232, 240, 0.66);
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
  background: rgba(59, 130, 246, 0.16);
  color: rgba(248, 250, 252, 0.9);
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
  border: 1px solid rgba(148, 163, 184, 0.1);
  border-radius: 18px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02)),
    rgba(15, 23, 42, 0.42);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    inset 0 -1px 0 rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(18px);
}

.demo-menu-left-right__menu {
  min-width: 0;
}

.demo-menu-left-right__menu :deep(.xy-menu--horizontal) {
  min-height: 48px;
  padding: 6px;
  border: none;
  border-radius: 16px;
  background: transparent;
  box-shadow: none;
}

.demo-menu-left-right__menu :deep(.xy-menu--horizontal > .xy-menu-item),
.demo-menu-left-right__menu :deep(.xy-menu--horizontal > .xy-sub-menu),
.demo-menu-left-right__menu :deep(.xy-menu--horizontal > .xy-menu__more) {
  margin: 0;
}

.demo-menu-left-right__menu :deep(.xy-menu--horizontal > .demo-menu-left-right__right-start) {
  margin-left: auto;
  position: relative;
}

.demo-menu-left-right__menu :deep(.xy-menu--horizontal > .demo-menu-left-right__right-start::before) {
  content: "";
  position: absolute;
  left: -8px;
  top: 8px;
  bottom: 8px;
  width: 1px;
  background: rgba(148, 163, 184, 0.14);
}

.demo-menu-left-right__menu :deep(.xy-menu--horizontal > .demo-menu-left-right__action-item:not(.is-active)) {
  color: rgba(226, 232, 240, 0.72);
  font-weight: 550;
  letter-spacing: 0.005em;
  padding-inline: 12px;
}

.demo-menu-left-right__menu :deep(.xy-menu--horizontal > .xy-menu-item),
.demo-menu-left-right__menu :deep(.xy-menu--horizontal > .xy-sub-menu > .xy-sub-menu__title),
.demo-menu-left-right__menu :deep(.xy-menu--horizontal > .xy-menu__more > .xy-menu__more-button) {
  min-height: 42px;
  padding-inline: 14px;
  border-radius: 12px;
  color: rgba(226, 232, 240, 0.78);
  font-weight: 600;
  letter-spacing: 0.01em;
  box-shadow: inset 0 0 0 1px transparent;
}

.demo-menu-left-right__menu :deep(.xy-menu--horizontal > .xy-menu-item:hover),
.demo-menu-left-right__menu :deep(.xy-menu--horizontal > .xy-sub-menu > .xy-sub-menu__title:hover),
.demo-menu-left-right__menu :deep(.xy-menu--horizontal > .xy-menu__more > .xy-menu__more-button:hover),
.demo-menu-left-right__menu :deep(.xy-menu--horizontal > .xy-sub-menu.is-opened > .xy-sub-menu__title) {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(248, 250, 252, 0.96);
  box-shadow:
    inset 0 0 0 1px rgba(148, 163, 184, 0.18),
    0 8px 20px rgba(15, 23, 42, 0.18);
}

.demo-menu-left-right__menu :deep(.xy-menu--horizontal > .demo-menu-left-right__action-item:hover) {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(248, 250, 252, 0.9);
  box-shadow:
    inset 0 0 0 1px rgba(148, 163, 184, 0.12),
    0 6px 16px rgba(15, 23, 42, 0.14);
}

.demo-menu-left-right__menu :deep(.xy-menu--horizontal > .xy-menu-item.is-active),
.demo-menu-left-right__menu :deep(.xy-menu--horizontal > .xy-sub-menu.is-active > .xy-sub-menu__title) {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.88), rgba(14, 165, 233, 0.86));
  color: #fff;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.14),
    0 12px 24px rgba(37, 99, 235, 0.24);
}

:global(.xy-menu__popup.demo-menu-left-right__popup) {
  min-width: 224px;
  padding: 10px;
  border-color: rgba(148, 163, 184, 0.18);
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, rgba(59, 130, 246, 0.18), transparent 36%),
    linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.95));
  box-shadow:
    0 24px 48px rgba(15, 23, 42, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

:global(.xy-menu__popup.demo-menu-left-right__popup .xy-menu-item),
:global(.xy-menu__popup.demo-menu-left-right__popup .xy-sub-menu__title) {
  min-height: 40px;
  padding-inline: 14px;
  border-radius: 13px;
  color: rgba(241, 245, 249, 0.92);
  font-weight: 600;
}

:global(.xy-menu__popup.demo-menu-left-right__popup .xy-menu-item-group__title) {
  padding: 8px 14px 10px;
  color: rgba(148, 163, 184, 0.78);
  letter-spacing: 0.08em;
}

:global(.xy-menu__popup.demo-menu-left-right__popup .xy-menu-item:hover),
:global(.xy-menu__popup.demo-menu-left-right__popup .xy-sub-menu__title:hover) {
  background: rgba(59, 130, 246, 0.18);
  box-shadow:
    inset 0 0 0 1px rgba(96, 165, 250, 0.16),
    0 10px 18px rgba(15, 23, 42, 0.16);
}

:global(.xy-menu__popup.demo-menu-left-right__popup .xy-menu-item.is-active),
:global(.xy-menu__popup.demo-menu-left-right__popup .xy-sub-menu.is-active > .xy-sub-menu__title) {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.28), rgba(14, 165, 233, 0.18));
  color: #fff;
}

.demo-menu-left-right__brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: max-content;
  padding-right: 16px;
  border-right: 1px solid rgba(148, 163, 184, 0.16);
}

.demo-menu-left-right__brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--xy-color-primary), #0ea5e9);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.demo-menu-left-right__brand-copy {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
}

.demo-menu-left-right__brand-copy strong {
  display: block;
  color: rgba(248, 250, 252, 0.96);
}

.demo-menu-left-right__brand-copy small {
  color: rgba(148, 163, 184, 0.78);
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

  .demo-menu-left-right__menu :deep(.xy-menu--horizontal > .demo-menu-left-right__right-start) {
    margin: 0;
  }
}
</style>
