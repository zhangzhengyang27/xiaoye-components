---
title: Timeline 场景示例
description: 把时间线放回操作审计、项目里程碑和侧栏详情页这三类真实后台语境里查看。
outline: deep
---

# Timeline 场景示例

这页不重复 `xy-timeline` / `xy-timeline-group` / `xy-timeline-item` 的基础 API，而是直接看它在真实后台页面里怎样承接操作审计、项目里程碑和侧栏详情页。当前这三类场景都统一建立在 `Group + state + structured slots + compact` 这套核心能力上，而不是继续靠 demo 自己拼一套内容骨架；默认起点仍然是左侧单线的 `mode='start'`。

## 推荐阅读路径

1. 先看操作审计，确认 `Group + compact + actions` 是否足够承接活动流。
2. 再看项目里程碑，判断 `state` 和 `alternate` 是否足够承接阶段流。
3. 最后看侧栏详情页，确认紧凑模式下结构化区域是否仍然稳定。

<div class="xy-scene-strip">
  <div>
    <strong>操作审计</strong>
    <span>后台操作记录 / 审批流转 / 发布日志</span>
  </div>
  <div>
    <strong>项目里程碑</strong>
    <span>版本节点 / 排期里程碑 / 交付阶段</span>
  </div>
  <div>
    <strong>侧栏详情页</strong>
    <span>最近动态 / 备注 / 处理记录</span>
  </div>
</div>

## 适合什么

- 审计日志、审批链路、发布流水这类天然按时间顺序阅读的后台页面。
- 里程碑总览、阶段复盘、版本节奏同步这类需要双侧布局承载说明的页面。
- 抽屉、侧栏和详情页中的最近动态、处理记录和补充备注区块。

## 不适合什么

- 需要完整泳道、依赖关系和资源排布的甘特图或排期视图。
- 需要并列比较多条流程、而不是阅读单条事件链路的复杂流程编排页面。
- 只想做轻量状态摘要、不需要明确时间顺序的统计卡片或概览面板。

## 操作审计

:::demo 这个场景把后台操作记录、审批流转和发布日志收口到同一条时间线上，适合管理台、运营台和变更中心。
timeline/audit
:::

## 项目里程碑

:::demo 交替布局更适合承接版本节点、阶段目标和交付说明，阅读时不容易把每一项都挤在同一侧。
timeline/milestone
:::

## 侧栏详情页

:::demo 窄侧栏里最常见的就是最近动态、备注和处理记录；这里展示时间线在右侧详情面板里的收口方式。
timeline/detail-panel
:::

## 数据流说明

1. 页面层维护真实事件数组，并决定每个节点属于哪个 `group`、使用什么 `state`、是否切到 `compact`。
2. `xy-timeline` 负责布局模式、渲染顺序和密度；`xy-timeline-group` 负责分段标题；`xy-timeline-item` 负责节点内容区域。
3. 业务字段仍然应该在页面层组织成 `title / meta / actions / default / extra` 这几个区域，而不是继续把整块业务卡片塞进一个默认插槽。

## 可复用模块总结

1. 分组流模板：`Timeline + TimelineGroup`，适合按日期、版本、阶段分段。
2. 流程态模板：`state + type`，适合同时表达当前阶段和视觉语义。
3. 紧凑模板：`density='compact' + structured slots`，适合侧栏、抽屉和详情面板。
