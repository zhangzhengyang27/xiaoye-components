<template>
  <section class="demo-menu-overflow">
    <header class="demo-menu-overflow__header">
      <div class="demo-menu-overflow__title">
        <strong>收缩后的运营入口带</strong>
        <p>把横向菜单嵌进一条受限宽度的运营工作带里，让超出的一级入口自然进入“更多”，同时保留菜单级和子菜单级的偏移配置。</p>
      </div>

      <xy-space wrap>
        <xy-tag round>宽度 520px</xy-tag>
        <xy-tag status="primary" round>更多入口 + Offset</xy-tag>
      </xy-space>
    </header>

    <div class="demo-menu-overflow__hint">
      <span class="demo-menu-overflow__hint-pill">WIDTH WATCH</span>
      <span>把容器宽度收窄后，超出的一级入口会被收进更多菜单。</span>
    </div>

    <div class="demo-menu-overflow__frame">
      <div class="demo-menu-overflow__meta">
        <span class="demo-menu-overflow__env">OPS WORKSTRIP</span>
        <span class="demo-menu-overflow__meta-note">520px 受限宽度下演示更多入口与弹层偏移</span>
      </div>

      <div class="demo-menu-overflow__bar">
        <div class="demo-menu-overflow__brand">
          <span class="demo-menu-overflow__brand-mark">XO</span>
          <span class="demo-menu-overflow__brand-copy">
            <strong>Ops Rail</strong>
            <small>Constrained Width</small>
          </span>
        </div>

        <xy-menu
          class="demo-menu-overflow__menu"
          mode="horizontal"
          ellipsis
          default-active="ops"
          :popper-offset="16"
          popper-effect="dark"
          popper-class="demo-menu-overflow__popup"
        >
          <xy-menu-item index="ops">运维看板</xy-menu-item>
          <xy-sub-menu index="workspace">
            <template #title>团队协作</template>
            <xy-menu-item index="workspace-files">文件中心</xy-menu-item>
            <xy-menu-item index="workspace-members">成员面板</xy-menu-item>
            <xy-sub-menu index="workspace-audit" :popper-offset="20">
              <template #title>审计追踪</template>
              <xy-menu-item index="workspace-audit-log">日志</xy-menu-item>
              <xy-menu-item index="workspace-audit-policy">策略</xy-menu-item>
            </xy-sub-menu>
          </xy-sub-menu>
          <xy-menu-item index="orders">订单履约</xy-menu-item>
          <xy-menu-item index="finance">财务复核</xy-menu-item>
          <xy-menu-item index="channel">渠道投放</xy-menu-item>
          <xy-menu-item index="support">客服支持</xy-menu-item>
          <xy-menu-item index="settings">系统设置</xy-menu-item>
        </xy-menu>
      </div>
    </div>
  </section>
</template>

<style scoped>
.demo-menu-overflow {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--xy-color-primary) 8%, white), transparent 36%),
    linear-gradient(180deg, color-mix(in srgb, var(--xy-bg-color) 96%, white), var(--xy-bg-color));
}

.demo-menu-overflow__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.demo-menu-overflow__title {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-menu-overflow__title strong {
  color: var(--xy-text-color);
  font-size: 18px;
}

.demo-menu-overflow__title p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

.demo-menu-overflow__hint {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 18px;
  background: color-mix(in srgb, var(--xy-bg-color-muted) 76%, white);
  color: var(--xy-text-color-secondary);
}

.demo-menu-overflow__hint-pill {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--xy-color-primary) 10%, white);
  color: color-mix(in srgb, var(--xy-color-primary) 82%, black);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-menu-overflow__frame {
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

.demo-menu-overflow__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: rgba(226, 232, 240, 0.66);
  font-size: 12px;
}

.demo-menu-overflow__env {
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

.demo-menu-overflow__meta-note {
  letter-spacing: 0.02em;
  white-space: nowrap;
  font-size: 11.5px;
}

.demo-menu-overflow__bar {
  display: grid;
  grid-template-columns: auto minmax(0, 520px);
  gap: 18px;
  align-items: center;
  justify-content: space-between;
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

.demo-menu-overflow__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: max-content;
  padding-right: 14px;
  border-right: 1px solid rgba(148, 163, 184, 0.12);
}

.demo-menu-overflow__brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: linear-gradient(135deg, var(--xy-color-primary), #0ea5e9);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.demo-menu-overflow__brand-copy {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
}

.demo-menu-overflow__brand-copy strong {
  display: block;
  color: rgba(248, 250, 252, 0.96);
  font-size: 15px;
  font-weight: 600;
}

.demo-menu-overflow__brand-copy small {
  color: rgba(148, 163, 184, 0.62);
  font-size: 11.5px;
  letter-spacing: 0.01em;
}

.demo-menu-overflow__menu {
  min-width: 0;
  width: 100%;
}

.demo-menu-overflow__menu :deep(.xy-menu--horizontal) {
  min-height: 48px;
  padding: 6px;
  border: none;
  border-radius: 16px;
  background: transparent;
  box-shadow: none;
}

.demo-menu-overflow__menu :deep(.xy-menu--horizontal > .xy-menu-item),
.demo-menu-overflow__menu :deep(.xy-menu--horizontal > .xy-sub-menu),
.demo-menu-overflow__menu :deep(.xy-menu--horizontal > .xy-menu__more),
.demo-menu-overflow__menu :deep(.xy-menu--horizontal > .xy-sub-menu > .xy-sub-menu__title),
.demo-menu-overflow__menu :deep(.xy-menu--horizontal > .xy-menu__more > .xy-menu__more-button) {
  margin: 0;
  flex: 0 0 auto;
  min-height: 42px;
  padding-inline: 14px;
  border-radius: 12px;
  color: rgba(226, 232, 240, 0.8);
  font-weight: 600;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.demo-menu-overflow__menu :deep(.xy-menu--horizontal > .xy-menu-item:hover),
.demo-menu-overflow__menu :deep(.xy-menu--horizontal > .xy-sub-menu > .xy-sub-menu__title:hover),
.demo-menu-overflow__menu :deep(.xy-menu--horizontal > .xy-menu__more > .xy-menu__more-button:hover),
.demo-menu-overflow__menu :deep(.xy-menu--horizontal > .xy-sub-menu.is-opened > .xy-sub-menu__title) {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(248, 250, 252, 0.98);
  box-shadow:
    inset 0 0 0 1px rgba(148, 163, 184, 0.18),
    0 8px 18px rgba(15, 23, 42, 0.16);
}

.demo-menu-overflow__menu :deep(.xy-menu--horizontal > .xy-menu-item.is-active),
.demo-menu-overflow__menu :deep(.xy-menu--horizontal > .xy-sub-menu.is-active > .xy-sub-menu__title) {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.84), rgba(14, 165, 233, 0.8));
  color: #fff;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.16),
    0 10px 20px rgba(37, 99, 235, 0.22);
}

:global(.xy-menu__popup.demo-menu-overflow__popup) {
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

:global(.xy-menu__popup.demo-menu-overflow__popup .xy-menu-item),
:global(.xy-menu__popup.demo-menu-overflow__popup .xy-sub-menu__title) {
  min-height: 40px;
  padding-inline: 14px;
  border-radius: 12px;
  color: rgba(241, 245, 249, 0.92);
  font-weight: 600;
}

:global(.xy-menu__popup.demo-menu-overflow__popup .xy-menu-item-group__title) {
  padding: 8px 14px 10px;
  color: rgba(148, 163, 184, 0.78);
  letter-spacing: 0.08em;
}

@media (max-width: 860px) {
  .demo-menu-overflow__header,
  .demo-menu-overflow__meta,
  .demo-menu-overflow__bar {
    flex-direction: column;
    grid-template-columns: 1fr;
    align-items: stretch;
  }

  .demo-menu-overflow__hint {
    flex-direction: column;
    align-items: flex-start;
  }

  .demo-menu-overflow__meta-note {
    white-space: normal;
  }

  .demo-menu-overflow__brand {
    padding-right: 0;
    border-right: none;
  }
}
</style>
