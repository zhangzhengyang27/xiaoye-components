<template>
  <div class="demo-menu-vertical">
    <section class="demo-menu-vertical__shell">
      <header class="demo-menu-vertical__header">
        <div class="demo-menu-vertical__title">
          <strong>策略侧栏导航</strong>
          <p>把纵向菜单放进一个更完整的工作区骨架里，左侧负责导航切换，右侧负责承接当前模块的摘要和操作。</p>
        </div>

        <xy-space wrap>
          <xy-tag status="primary" round>default-active = analysis-overview</xy-tag>
          <xy-tag round>default-openeds = analysis / system</xy-tag>
        </xy-space>
      </header>

      <div class="demo-menu-vertical__workspace">
        <div class="demo-menu-vertical__sidebar">
          <xy-menu
            default-active="analysis-overview"
            :default-openeds="['analysis', 'system']"
          >
            <xy-sub-menu index="analysis">
              <template #title>
                <xy-icon icon="mdi:chart-box-outline" />
                <span>分析中心</span>
              </template>

              <xy-menu-item-group title="经营指标">
                <xy-menu-item index="analysis-overview">概览</xy-menu-item>
                <xy-menu-item index="analysis-report">经营报表</xy-menu-item>
              </xy-menu-item-group>

              <xy-menu-item-group>
                <template #title>自动化</template>
                <xy-menu-item index="analysis-rules">规则引擎</xy-menu-item>
              </xy-menu-item-group>
            </xy-sub-menu>

            <xy-menu-item index="workbench">
              <xy-icon icon="mdi:view-dashboard-outline" />
              <span>工作台</span>
            </xy-menu-item>

            <xy-sub-menu index="system">
              <template #title>
                <xy-icon icon="mdi:cog-outline" />
                <span>系统设置</span>
              </template>
              <xy-menu-item index="system-users">用户</xy-menu-item>
              <xy-menu-item index="system-roles">角色</xy-menu-item>
              <xy-menu-item index="system-permissions">权限</xy-menu-item>
            </xy-sub-menu>
          </xy-menu>
        </div>

        <div class="demo-menu-vertical__content">
          <xy-card class="demo-menu-vertical__spotlight" shadow="always">
            <div class="demo-menu-vertical__spotlight-head">
              <div class="demo-menu-vertical__spotlight-copy">
                <span class="demo-menu-vertical__kicker">Current Module</span>
                <h4>分析中心 / 概览</h4>
                <p>这里模拟侧栏右侧的主工作区，用来承接当前激活模块的摘要、关键指标和下一步动作。</p>
              </div>

              <xy-space wrap>
                <xy-tag status="success" round>实时监控</xy-tag>
                <xy-tag round>最近 15 分钟已同步</xy-tag>
              </xy-space>
            </div>

            <div class="demo-menu-vertical__summary">
              <div class="demo-menu-vertical__summary-item">
                <span>待跟进策略</span>
                <strong>18 项</strong>
              </div>
              <div class="demo-menu-vertical__summary-item">
                <span>数据刷新频率</span>
                <strong>30 秒</strong>
              </div>
              <div class="demo-menu-vertical__summary-item">
                <span>告警 SLA</span>
                <strong>99.95%</strong>
              </div>
            </div>
          </xy-card>

          <div class="demo-menu-vertical__grid">
            <xy-card class="demo-menu-vertical__metric" shadow="hover">
              <span class="demo-menu-vertical__metric-kicker">噪音同比</span>
              <h5>今日告警压降</h5>
              <strong>32%</strong>
              <p>与昨日同口径相比，异常噪音持续下降。</p>
            </xy-card>

            <xy-card class="demo-menu-vertical__metric" shadow="hover">
              <span class="demo-menu-vertical__metric-kicker">自动化效率</span>
              <h5>规则自动命中</h5>
              <strong>1,248</strong>
              <p>自动化模块保持稳定，夜间批次已完成回灌。</p>
            </xy-card>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.demo-menu-vertical {
  width: 100%;
}

.demo-menu-vertical__shell {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 88%, white);
  border-radius: 24px;
  background:
    radial-gradient(circle at top right, color-mix(in srgb, var(--xy-color-primary) 8%, white), transparent 36%),
    linear-gradient(180deg, color-mix(in srgb, var(--xy-bg-color) 96%, white), var(--xy-bg-color));
}

.demo-menu-vertical__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.demo-menu-vertical__title {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demo-menu-vertical__title strong {
  color: var(--xy-text-color);
  font-size: 18px;
}

.demo-menu-vertical__title p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.7;
}

.demo-menu-vertical__workspace {
  display: grid;
  grid-template-columns: auto minmax(320px, 1fr);
  gap: 18px;
  align-items: stretch;
}

.demo-menu-vertical__sidebar {
  padding: 8px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 86%, white);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.06);
}

.demo-menu-vertical__sidebar :deep(.xy-menu--vertical) {
  gap: 4px;
  padding: 6px;
  border-radius: 18px;
}

.demo-menu-vertical__sidebar :deep(.xy-menu--vertical > li + li),
.demo-menu-vertical__sidebar :deep(.xy-menu-item-group__list > li + li),
.demo-menu-vertical__sidebar :deep(.xy-sub-menu__wrap > li + li) {
  margin-top: 0;
}

.demo-menu-vertical__sidebar :deep(.xy-menu--vertical > .xy-menu-item),
.demo-menu-vertical__sidebar :deep(.xy-menu--vertical > .xy-sub-menu > .xy-sub-menu__title) {
  min-height: 34px;
  padding: 5px 10px;
  border-radius: 11px;
  line-height: 1.2;
}

.demo-menu-vertical__sidebar :deep(.xy-menu-item:hover),
.demo-menu-vertical__sidebar :deep(.xy-sub-menu__title:hover) {
  background: color-mix(in srgb, var(--xy-color-primary) 7%, white);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--xy-color-primary) 14%, white),
    0 8px 16px rgba(15, 23, 42, 0.05);
  transform: none;
}

.demo-menu-vertical__sidebar :deep(.xy-menu-item.is-active),
.demo-menu-vertical__sidebar :deep(.xy-sub-menu.is-active > .xy-sub-menu__title) {
  color: color-mix(in srgb, var(--xy-color-primary) 90%, #1d4ed8);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--xy-color-primary) 11%, white),
    color-mix(in srgb, var(--xy-color-primary) 6%, white)
  );
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--xy-color-primary) 16%, white),
    0 10px 20px rgba(37, 99, 235, 0.08);
}

.demo-menu-vertical__sidebar :deep(.xy-menu-item__content),
.demo-menu-vertical__sidebar :deep(.xy-sub-menu__title-content) {
  gap: 7px;
}

.demo-menu-vertical__sidebar :deep(.xy-menu-item-group) {
  margin: 4px 0;
}

.demo-menu-vertical__sidebar :deep(.xy-menu-item-group__title) {
  padding: 2px 10px 4px;
  color: color-mix(in srgb, var(--xy-text-color-secondary) 92%, #64748b);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.2;
}

.demo-menu-vertical__sidebar :deep(.xy-sub-menu__wrap) {
  margin: 0;
  padding: 4px 0 4px 10px;
}

.demo-menu-vertical__sidebar :deep(.xy-sub-menu__wrap .xy-menu-item) {
  min-height: 34px;
  padding: 5px 10px;
  border-radius: 10px;
  line-height: 1.2;
}

.demo-menu-vertical__sidebar :deep(.xy-icon) {
  font-size: 17px;
  color: color-mix(in srgb, var(--xy-color-primary) 88%, #2563eb);
}

.demo-menu-vertical__content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-menu-vertical__spotlight {
  min-height: 168px;
}

.demo-menu-vertical__spotlight-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.demo-menu-vertical__spotlight-copy {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-menu-vertical__kicker {
  display: inline-flex;
  margin: 0;
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.demo-menu-vertical__spotlight h4,
.demo-menu-vertical__grid h5 {
  margin: 0;
}

.demo-menu-vertical__spotlight p,
.demo-menu-vertical__grid p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.65;
}

.demo-menu-vertical__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.demo-menu-vertical__summary-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 86%, white);
  border-radius: 16px;
  background:
    linear-gradient(180deg, color-mix(in srgb, var(--xy-bg-color) 96%, white), color-mix(in srgb, var(--xy-bg-color-muted) 78%, white));
}

.demo-menu-vertical__summary-item span,
.demo-menu-vertical__metric-kicker {
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.demo-menu-vertical__summary-item strong {
  color: var(--xy-text-color);
  font-size: 20px;
  line-height: 1.1;
}

.demo-menu-vertical__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.demo-menu-vertical__metric {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-menu-vertical__grid strong {
  display: block;
  color: var(--xy-text-color);
  font-size: 28px;
  line-height: 1.1;
}

@media (max-width: 900px) {
  .demo-menu-vertical__header,
  .demo-menu-vertical__workspace,
  .demo-menu-vertical__grid,
  .demo-menu-vertical__summary {
    grid-template-columns: 1fr;
  }

  .demo-menu-vertical__spotlight-head {
    flex-direction: column;
  }
}
</style>
