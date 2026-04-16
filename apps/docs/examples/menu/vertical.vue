<template>
  <div class="demo-menu-vertical">
    <section class="demo-menu-vertical__shell">
      <header class="demo-menu-vertical__header">
        <div class="demo-menu-vertical__title">
          <strong class="demo-menu-vertical__title-text">策略侧栏导航</strong>
          <p class="demo-menu-vertical__description">
            把纵向菜单放进一个更完整的工作区骨架里，左侧负责导航切换，右侧负责承接当前模块的摘要和操作。
          </p>
        </div>

        <xy-space wrap>
          <xy-tag status="primary" round>default-active = analysis-overview</xy-tag>
          <xy-tag round>default-openeds = analysis / system</xy-tag>
        </xy-space>
      </header>

      <div class="demo-menu-vertical__workspace">
        <div class="demo-menu-vertical__sidebar">
          <xy-menu default-active="analysis-overview" :default-openeds="['analysis', 'system']">
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
                <h4 class="demo-menu-vertical__spotlight-title">分析中心 / 概览</h4>
                <p class="demo-menu-vertical__spotlight-description">
                  这里模拟侧栏右侧的主工作区，用来承接当前激活模块的摘要、关键指标和下一步动作。
                </p>
              </div>

              <xy-space wrap>
                <xy-tag status="success" round>实时监控</xy-tag>
                <xy-tag round>最近 15 分钟已同步</xy-tag>
              </xy-space>
            </div>

            <div class="demo-menu-vertical__summary">
              <div class="demo-menu-vertical__summary-item">
                <span>待跟进策略</span>
                <strong class="demo-menu-vertical__summary-value">18 项</strong>
              </div>
              <div class="demo-menu-vertical__summary-item">
                <span>数据刷新频率</span>
                <strong class="demo-menu-vertical__summary-value">30 秒</strong>
              </div>
              <div class="demo-menu-vertical__summary-item">
                <span>告警 SLA</span>
                <strong class="demo-menu-vertical__summary-value">99.95%</strong>
              </div>
            </div>
          </xy-card>

          <div class="demo-menu-vertical__grid">
            <xy-card class="demo-menu-vertical__metric" shadow="hover">
              <span class="demo-menu-vertical__metric-kicker">噪音同比</span>
              <h5 class="demo-menu-vertical__metric-title">今日告警压降</h5>
              <strong class="demo-menu-vertical__metric-value">32%</strong>
              <p class="demo-menu-vertical__metric-description">与昨日同口径相比，异常噪音持续下降。</p>
            </xy-card>

            <xy-card class="demo-menu-vertical__metric" shadow="hover">
              <span class="demo-menu-vertical__metric-kicker">自动化效率</span>
              <h5 class="demo-menu-vertical__metric-title">规则自动命中</h5>
              <strong class="demo-menu-vertical__metric-value">1,248</strong>
              <p class="demo-menu-vertical__metric-description">自动化模块保持稳定，夜间批次已完成回灌。</p>
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
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-xl);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--xy-bg-color-subtle) 92%, white),
    var(--xy-surface-raised)
  );
  box-shadow: var(--xy-shadow-xs);
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

.demo-menu-vertical__title-text {
  color: var(--xy-text-color);
  font-size: 18px;
}

.demo-menu-vertical__description {
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
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-lg);
  background: var(--xy-surface-raised);
  box-shadow: var(--xy-shadow-card);
}

:global(.demo-menu-vertical__sidebar .xy-menu--vertical) {
  gap: 4px;
  padding: 6px;
  border-radius: 18px;
}

:global(.demo-menu-vertical__sidebar .xy-menu--vertical > .xy-menu-item),
:global(.demo-menu-vertical__sidebar .xy-menu--vertical > .xy-sub-menu > .xy-menu__item-surface) {
  min-height: 34px;
  padding: 5px 10px;
  border-radius: 11px;
  line-height: 1.2;
}

:global(.demo-menu-vertical__sidebar .xy-menu-item:hover),
:global(.demo-menu-vertical__sidebar .xy-sub-menu > .xy-menu__item-surface:hover) {
  background: var(--xy-bg-color-subtle);
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--xy-color-primary) 14%, var(--xy-border-color-subtle));
  transform: none;
}

:global(.demo-menu-vertical__sidebar .xy-menu-item.is-active),
:global(.demo-menu-vertical__sidebar .xy-sub-menu.is-active > .xy-menu__item-surface) {
  color: var(--xy-color-primary);
  background: var(--xy-color-primary-soft);
  box-shadow: inset 0 0 0 1px
    color-mix(in srgb, var(--xy-color-primary) 16%, var(--xy-border-color-subtle));
}

:global(.demo-menu-vertical__sidebar .xy-menu__item-content) {
  gap: 7px;
}

:global(.demo-menu-vertical__sidebar .xy-menu-item-group) {
  margin: 4px 0;
}

:global(.demo-menu-vertical__sidebar .xy-menu__group-title) {
  padding: 2px 10px 4px;
  color: color-mix(in srgb, var(--xy-text-color-secondary) 92%, #64748b);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.2;
}

:global(.demo-menu-vertical__sidebar .xy-menu__sub-list) {
  margin: 0;
  padding: 4px 0 4px 10px;
}

:global(.demo-menu-vertical__sidebar .xy-menu__sub-list > .xy-menu-item) {
  min-height: 34px;
  padding: 5px 10px;
  border-radius: 10px;
  line-height: 1.2;
}

:global(.demo-menu-vertical__sidebar .xy-icon) {
  font-size: 17px;
  color: color-mix(in srgb, var(--xy-color-primary) 88%, var(--xy-text-color));
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

.demo-menu-vertical__spotlight-title,
.demo-menu-vertical__metric-title {
  margin: 0;
}

.demo-menu-vertical__spotlight-description,
.demo-menu-vertical__metric-description {
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
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: 16px;
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--xy-bg-color-subtle) 92%, white),
    var(--xy-surface-raised)
  );
}

.demo-menu-vertical__summary-item span,
.demo-menu-vertical__metric-kicker {
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.demo-menu-vertical__summary-value {
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

.demo-menu-vertical__metric-value {
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
