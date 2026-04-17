<template>
  <section class="demo-menu-overflow">
    <header class="demo-menu-overflow__header">
      <div class="demo-menu-overflow__title">
        <strong class="demo-menu-overflow__title-text">收缩后的运营入口带</strong>
        <p class="demo-menu-overflow__description">
          把横向菜单嵌进一条受限宽度的运营工作带里，让超出的一级入口自然进入“更多”，同时保留菜单级和子菜单级的偏移配置。
        </p>
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
            <strong class="demo-menu-overflow__brand-title">Ops Rail</strong>
            <small class="demo-menu-overflow__brand-caption">Constrained Width</small>
          </span>
        </div>

        <xy-menu
          class="demo-menu-overflow__menu"
          mode="horizontal"
          ellipsis
          default-active="ops"
          :popper-offset="16"
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
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-xl);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--xy-bg-color-subtle) 92%, white),
    var(--xy-surface-raised)
  );
  box-shadow: var(--xy-shadow-xs);
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

.demo-menu-overflow__title-text {
  color: var(--xy-text-color);
  font-size: 18px;
}

.demo-menu-overflow__description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

.demo-menu-overflow__hint {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 18px;
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 92%, white);
  color: var(--xy-text-color-secondary);
}

.demo-menu-overflow__hint-pill {
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
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
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-lg);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--xy-color-primary-soft) 30%, white),
    var(--xy-surface-raised)
  );
  box-shadow: var(--xy-shadow-card);
}

.demo-menu-overflow__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
}

.demo-menu-overflow__env {
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
  border: 1px solid color-mix(in srgb, var(--xy-color-primary) 10%, var(--xy-border-color-subtle));
  border-radius: var(--xy-radius-md);
  background: color-mix(in srgb, var(--xy-bg-color) 96%, white);
  box-shadow: var(--xy-shadow-xs);
}

.demo-menu-overflow__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: max-content;
  padding-right: 14px;
  border-right: 1px solid var(--xy-border-color-subtle);
}

.demo-menu-overflow__brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: var(--xy-color-primary-soft);
  color: var(--xy-color-primary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.demo-menu-overflow__brand-copy {
  display: inline-flex;
  flex-direction: column;
  gap: 2px;
}

.demo-menu-overflow__brand-title {
  display: block;
  color: var(--xy-text-color-heading);
  font-size: 15px;
  font-weight: 600;
}

.demo-menu-overflow__brand-caption {
  color: var(--xy-text-color-secondary);
  font-size: 11.5px;
  letter-spacing: 0.01em;
}

.demo-menu-overflow__menu {
  min-width: 0;
  width: 100%;
  --xy-menu-horizontal-height: 48px;
  --xy-menu-padding: 6px;
  --xy-menu-border: none;
  --xy-menu-radius: 16px;
  --xy-menu-bg-color: color-mix(in srgb, var(--xy-bg-color-subtle) 86%, white);
  --xy-menu-shadow: none;
  --xy-menu-horizontal-item-min-height: 42px;
  --xy-menu-horizontal-item-padding-inline: 14px;
  --xy-menu-item-radius: 12px;
  --xy-menu-item-font-weight: 600;
  --xy-menu-item-letter-spacing: 0.01em;
  --xy-menu-hover-shadow: inset 0 0 0 1px var(--xy-border-color-subtle);
  --xy-menu-active-bg: var(--xy-color-primary-soft);
  --xy-menu-active-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--xy-color-primary) 16%, var(--xy-border-color-subtle));
}

.demo-menu-overflow__popup {
  --xy-menu-popup-min-width: 224px;
  --xy-menu-popup-padding: 10px;
  --xy-menu-popup-border-color: var(--xy-border-color-subtle);
  --xy-menu-popup-radius: 20px;
  --xy-menu-popup-bg: var(--xy-bg-color-floating);
  --xy-menu-popup-shadow: var(--xy-shadow-popup);
  --xy-menu-item-min-height: 40px;
  --xy-menu-item-padding-inline: 14px;
  --xy-menu-item-radius: 12px;
  --xy-menu-item-font-weight: 600;
  --xy-menu-group-title-padding: 8px 14px 10px;
  --xy-menu-group-title-color: var(--xy-text-color-muted);
  --xy-menu-group-title-letter-spacing: 0.08em;
  --xy-menu-hover-shadow: inset 0 0 0 1px var(--xy-border-color-subtle);
  --xy-menu-active-bg: var(--xy-color-primary-soft);
  --xy-menu-active-shadow: none;
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
