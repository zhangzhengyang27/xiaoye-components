---
title: Scheduler 场景示例
description: 用官方示例的阅读方式查看 xy-scheduler 的展示、交互和完整场景。
outline: deep
---

<script setup lang="ts">
import SchedulerPlaygroundFrame from "../.vitepress/theme/components/SchedulerPlaygroundFrame.vue";
</script>

# Scheduler 场景示例

这页按官方组件示例的阅读顺序组织 `xy-scheduler`：先分别查看基础展示、常见交互和插槽扩展，再在页尾进入完整场景。组件定位和完整 API 仍然放在 [Scheduler 排期日历](/components/scheduler) 页面。

:::tip 阅读方式
先按下面的分段示例理解单项能力，再去页尾的完整场景查看这些能力如何组合在同一块页面里工作。
:::

## 推荐阅读路径

1. 先看“基础月视图”，确认组件的默认展示和事件密度。
2. 再看“视图切换”和“日期区间选择”，理解页面层最常见的控制方式。
3. 接着看“可编辑事件”和“重复事件”，判断是否满足你的真实排期需求。
4. 最后看“自定义内容”和“完整场景”，把展示层和业务交互串起来理解。

<div class="xy-scene-strip">
  <div>
    <strong>基础展示</strong>
    <span>月视图 / 视图切换 / 重复事件</span>
  </div>
  <div>
    <strong>交互链路</strong>
    <span>框选创建 / 拖拽改期 / 插槽定制</span>
  </div>
  <div>
    <strong>完整场景</strong>
    <span>外部拖入 / 侧栏联动 / 抽屉新建</span>
  </div>
</div>

## 适合什么

- 排期看板、会议编排、值班日历、日程面板这类以月 / 周 / 日为主的页面。
- 需要“先渲染日历，再逐步接拖拽、框选和外部拖入”的业务场景。
- 已经有自己的抽屉、弹窗或表单组件，只需要日历负责展示和交互入口的场景。

## 不适合什么

- 资源排程、时间轴、纵向资源视图这类 FullCalendar Premium 场景。
- 需要非常复杂的重复规则、排班规则或审批流状态机的系统。
- 只需要一个轻量月历面板，而不需要排期交互的只读日期选择场景。

## 基础月视图

:::demo 基础月视图用于展示全天事件、跨天事件和定时事件，是排期面板最常见的起点。
scheduler/basic
:::

## 视图切换

:::demo 通过 `v-model:view` 可以在 month、week、day 之间切换，适合把视图控制权交给外部按钮组。
scheduler/views
:::

## 日期区间选择

:::demo 开启 `selectable` 后，可以直接承接“框选一段时间后创建事件”的录入链路。
scheduler/selectable
:::

## 可编辑事件

:::demo 开启 `editable` 后，事件拖拽和 resize 的结果会统一通过 `event-change` 回收。
scheduler/editable
:::

## 重复事件

:::demo 当前组件支持受控 `rrule` 子集，适合站会、值班和其他固定规律事件。
scheduler/recurring
:::

## 自定义内容

:::demo 通过 `event-content` 和 `day-cell-content` 插槽，可以定制事件块和日期单元格的展示方式。
scheduler/slots
:::

## 数据流说明

1. `events` 是源数据，负责决定当前日历要渲染哪些事件。
2. `model-value` 和 `view` 是页面层状态，负责决定当前焦点日期和当前视图。
3. `date-select`、`event-change`、`event-receive` 是最常见的写回入口，通常分别对应“新建”“改期”“接收外部拖入”。
4. 组件本身不负责持久化数据，真正的保存、回写和接口请求应由页面层完成。

## 场景与 API 对照

| 场景 | 关键 props / emits | 说明 |
| --- | --- | --- |
| 月 / 周 / 日切换 | `view`、`views`、`update:view` | 控制当前视图与允许切换的范围 |
| 点击或定位日期 | `model-value`、`update:model-value`、`date-click` | 同步焦点日期并承接日期点击行为 |
| 框选创建事件 | `selectable`、`date-select` | 承接“框选时间段后打开表单” |
| 拖拽改期 / resize | `editable`、`event-change` | 统一回收拖拽和 resize 后的结果 |
| 外部事件拖入 | `droppable`、`drop`、`event-receive` | 承接左侧事件池或外部列表拖入 |
| 重复事件展开 | `events[].rrule`、`events[].duration` | 用受控规则子集生成可见实例 |
| 自定义事件块 / 日期格 | `event-content`、`day-cell-content` | 覆盖默认展示层，不直接暴露 FullCalendar 全量模板 API |

## 从需求到 API

| 如果你要做的事 | 先用什么 | 通常还要配什么 | 说明 |
| --- | --- | --- | --- |
| 只想先渲染一块完整月历 | `model-value`、`events` | `view="month"`、`views=['month']` | 最小接入方式，先把展示跑通再补交互 |
| 让页面外部按钮控制月 / 周 / 日切换 | `v-model:view` | `views`、`update:view` | 适合把切换按钮放在页面自己的工具栏里 |
| 跟随用户翻页同步当前焦点日期 | `v-model` / `update:model-value` | `view-change` | 适合做侧栏详情、统计面板或 URL 同步 |
| 点击某天打开侧边抽屉或详情 | `date-click` | `model-value` | 常用于“点击日期后查看当天安排” |
| 框一段时间后创建事件 | `selectable`、`date-select` | `select-mirror` | 推荐在回调里接自己的抽屉或表单 |
| 拖动或拉伸事件后回写业务数据 | `editable`、`event-change` | 事件级 `editable` | 拖拽和 resize 统一走同一个回调收口 |
| 从左侧待办池拖入日历 | `droppable`、`event-receive` | `drop` | `drop` 适合接收落点信息，`event-receive` 适合真正写入事件数据 |
| 做固定规律的站会 / 值班安排 | `events[].rrule` | `events[].duration`、`sourceId`、`occurrenceStart` | 当前适合常见周频、日频和少量月频规则 |
| 给事件块加业务标签或改日期格样式 | `event-content`、`day-cell-content` | `events[].extendedProps` | 插槽是展示层扩展入口，业务字段建议走 `extendedProps` |
| 限制成只读排班面板 | 只传 `events` | 不开 `editable`、`selectable`、`droppable` | 适合公告排期、值班日历和只读总览 |

## 常见接法

### `date-select` 打开抽屉

```ts
function handleDateSelect(payload: SchedulerDateSelectPayload) {
  creatorOpen.value = true;
  creatorDraft.start = payload.start;
  creatorDraft.end = payload.end;
  creatorDraft.allDay = payload.allDay;
}
```

### `event-change` 回写事件数组

```ts
function handleEventChange(payload: SchedulerEventChangePayload) {
  events.value = events.value.map((item) =>
    item.id === payload.event.id ? payload.event : item
  );
}
```

### `event-receive` 接外部拖入

```ts
function handleEventReceive(payload: SchedulerEventReceivePayload) {
  events.value = [...events.value, payload.event];
}
```

## 业务词汇表

| 业务里常说什么 | 在文档里的对应术语 | 关键 API |
| --- | --- | --- |
| 改期 / 挪时间 | 拖拽改期 / resize | `editable`、`event-change` |
| 框一段时间新建 | 日期区间选择 | `selectable`、`date-select` |
| 从待办池拖进日历 | 外部事件拖入 | `droppable`、`drop`、`event-receive` |
| 固定规律站会 / 值班 | 重复事件 | `events[].rrule`、`events[].duration` |
| 给事件块补业务标签 | 自定义内容 | `event-content`、`extendedProps` |

## 推荐接入顺序

1. 先只接 `model-value`、`view` 和 `events`，确认展示结果符合你的业务时间模型。
2. 再决定是否需要 `editable`、`selectable`、`droppable` 这三类交互入口。
3. 最后把 `date-select`、`event-change`、`event-receive` 接到自己的抽屉、表单和数据同步逻辑里。

## 常见坑

- 全天事件优先使用 `YYYY-MM-DD`，不要把本地时间字符串和全天事件写法混在一起。
- 定时事件优先使用完整 ISO 字符串，避免不同浏览器对模糊时间格式解析不一致。
- 当前 `rrule` 不是完整规则引擎，复杂规则请先拆成更明确的业务数据。
- 如果你要真正写入数据，不要只接 `drop`，通常还需要接 `event-receive`。

## 完整场景

如果你想把这些能力放回同一块页面里查看，再看下面的完整场景。这里会把左侧操作区、事件列表、外部事件池和抽屉新建链路组合在一起。

<SchedulerPlaygroundFrame />

## 继续往业务里接

如果你已经确认这些交互能力满足需求，下一步直接看 [Scheduler 业务接入模板](/examples/scheduler-template)。那一页会把接口数据、事件映射、抽屉编辑和回写骨架整理成一份可迁移示例。

## 本地联调

1. 在仓库根目录运行 `pnpm dev:playground`
2. 打开上面的内嵌页面，或点击右上角按钮在新窗口打开
3. 依次查看月视图、周 / 日切换、框选创建、拖拽改期和外部拖入
