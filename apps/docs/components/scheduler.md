---
title: Scheduler 排期日历
description: 月、周、日排期视图与常见交互能力的高级日历组件。
outline: deep
---

# Scheduler 排期日历

`xy-scheduler` 是当前仓库里的高级 Calendar / 排期组件，聚焦 `month / week / day` 三种视图和常见排期交互。这个页面只保留组件定位、接入顺序和完整 API；如果你想先看分段示例和完整效果，优先去场景页。

## 示例与联调

<div class="xy-doc-grid">
  <div>
    <h3>查看场景示例</h3>
    <p>想看整块日历、月 / 周 / 日切换、框选新建、事件拖拽和外部拖入，先去场景页。</p>
    <a href="/examples/scheduler">打开 Scheduler 场景示例</a>
  </div>
  <div>
    <h3>业务接入模板</h3>
    <p>如果你已经准备接接口、抽屉和回写逻辑，优先看一份可运行的业务模板。</p>
    <a href="/examples/scheduler-template">打开 Scheduler 业务接入模板</a>
  </div>
  <div>
    <h3>本地联调</h3>
    <p>准备改代码或接业务数据时，先启动 playground，再进入专用场景页做真实联调。</p>
    <a href="http://localhost:5175/?scene=scheduler" target="_blank" rel="noreferrer">
      打开本地 Scheduler 场景
    </a>
  </div>
</div>

## 能力边界

- 默认覆盖 `month / week / day` 三种排期视图，适合月历、值班表、会议编排和轻量日程面板。
- 标准交互包括事件点击、拖拽改期、resize、日期区间框选和外部事件拖入。
- `rrule` 只支持当前组件约定的常用子集，不等价于完整调度引擎。
- 当前版本不支持资源排程、时间轴和 Premium 能力。
- 日期值延续当前仓库的字符串优先约定：全天事件优先用 `YYYY-MM-DD`，定时事件优先用 ISO 字符串。

## 最小用法

```vue
<script setup lang="ts">
import { ref } from "vue";
import type { SchedulerEvent } from "xiaoye-components";

const focusDate = ref("2026-03-24");
const events: SchedulerEvent[] = [
  {
    id: "kickoff",
    title: "项目 Kickoff",
    start: "2026-03-24T10:00:00",
    end: "2026-03-24T11:00:00"
  }
];
</script>

<template>
  <xy-scheduler v-model="focusDate" :events="events" />
</template>
```

## 建议接入顺序

1. 先只接 `model-value`、`view` 和 `events`，把月 / 周 / 日三种基础显示跑通。
2. 再按需开启 `editable`、`selectable`、`droppable`，把真实交互链路补齐。
3. 最后在 `date-select`、`event-change`、`event-receive` 里接自己的抽屉、表单和数据同步逻辑。

## 什么时候去看示例页

- 想确认“操作栏下面是一整块完整日历”，去 [Scheduler 场景示例](/examples/scheduler)。
- 想看“接口数据 -> events 映射 -> 抽屉编辑 -> 回写”的完整骨架，去 [Scheduler 业务接入模板](/examples/scheduler-template)。
- 想看外部事件池、抽屉新建事件、侧栏事件列表这些成套交互，也去示例页。
- 只想查 props、events、slots 和类型定义，继续看下面的 API 即可。

## 最常用组合

| 目标 | 推荐组合 | 说明 |
| --- | --- | --- |
| 只读排期总览 | `v-model` + `events` | 先把月 / 周 / 日展示跑通，不开启写操作 |
| 框选创建事件 | `selectable` + `date-select` | 适合在回调里接抽屉、弹窗或表单 |
| 拖拽改期 | `editable` + `event-change` | 拖拽和 resize 统一从一个回调回写 |
| 外部拖入 | `droppable` + `drop` + `event-receive` | `drop` 看落点，`event-receive` 真正写入事件列表 |

## 重复事件说明

- 当前版本只支持受控 `rrule` 子集，适合日频、周频和少量月频的固定规律事件。
- 推荐优先使用对象写法，这样更容易和业务数据结构对齐。
- `duration` 用来补齐重复实例的时长；如果没有明确结束时间，周 / 日视图里的展示会依赖这个字段。
- 回调中的重复事件实例会带 `sourceId` 和 `occurrenceStart`，用来回溯到源规则和当前实例。
- 如果你的场景需要复杂排班规则、资源排程或时间轴，请不要把当前实现当成完整调度引擎。

## 事件数据约定

- `start` 是必填字段。全天事件建议使用 `YYYY-MM-DD`，定时事件建议使用 ISO 8601 字符串。
- `end` 是可选字段。全天单日事件可以不传 `end`；跨天事件再补结束日期。
- `allDay` 用来区分全天事件和定时事件，直接影响月视图和时间栅格里的渲染方式。
- `sourceId` 和 `occurrenceStart` 主要出现在重复事件实例回调里，普通事件通常不需要业务侧主动传入。
- 额外业务字段统一建议放到 `extendedProps`，再配合 `event-content` 插槽读取和展示。

## API

### Scheduler Attributes

| 属性                 | 说明                   | 类型                              | 默认值                     | 典型用途 |
| -------------------- | ---------------------- | --------------------------------- | -------------------------- | -------- |
| `model-value`        | 当前焦点日期           | `string`                          | `undefined`                | 跟随用户翻页同步当前日期，或和页面状态、URL 参数联动 |
| `view`               | 当前视图               | `'month' \| 'week' \| 'day'`      | `'month'`                  | 初始化成月视图、周视图或日视图 |
| `views`              | 允许切换的视图列表     | `SchedulerView[]`                 | `['month', 'week', 'day']` | 限制用户只能在指定视图之间切换 |
| `events`             | 事件列表               | `SchedulerEvent[]`                | `[]`                       | 渲染业务排期、会议、值班或日程数据 |
| `locale`             | 日历语言               | `string`                          | `'zh-cn'`                  | 切换中英文或对接国际化页面 |
| `editable`           | 是否开启拖拽与 resize  | `boolean`                         | `false`                    | 承接排期改期、拖拽调整和时长修改 |
| `droppable`          | 是否允许外部事件拖入   | `boolean`                         | `false`                    | 从待办池、任务列表或模板区拖入日历 |
| `selectable`         | 是否允许框选日期区间   | `boolean`                         | `false`                    | 用于“框一段时间后创建事件” |
| `select-mirror`      | 框选时是否显示镜像态   | `boolean`                         | `true`                     | 让用户在拖选时提前看到选区反馈 |
| `week-start`         | 一周起始日             | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | `1`                        | 按地区或业务习惯把周一、周日设为每周起点 |
| `height`             | 日历高度               | `string \| number`                | `'auto'`                   | 固定在卡片、抽屉或页面主内容区的高度 |
| `show-now-indicator` | 是否显示当前时间指示线 | `boolean`                         | `true`                     | 周 / 日视图里标出当前时间位置 |

### Scheduler Events

| 事件                 | 说明                 | 参数                           | 典型用途 |
| -------------------- | -------------------- | ------------------------------ | -------- |
| `update:model-value` | 焦点日期变化         | `string`                       | 把当前日期同步到页面状态、URL 或外部统计面板 |
| `update:view`        | 视图变化             | `SchedulerView`                | 让外部按钮组、Tabs 或筛选栏与当前视图保持一致 |
| `date-click`         | 点击日期单元格       | `SchedulerDateClickPayload`    | 点击某天后打开当天详情、侧栏或快捷创建入口 |
| `drop`               | 外部元素落入日历     | `SchedulerDropPayload`         | 只关心落点日期和视图时，先接这个事件 |
| `date-select`        | 框选日期区间         | `SchedulerDateSelectPayload`   | 打开抽屉、弹窗或表单创建新事件 |
| `event-click`        | 点击事件块           | `SchedulerEventClickPayload`   | 查看事件详情、编辑排期或跳转业务页面 |
| `event-change`       | 拖拽或 resize 后触发 | `SchedulerEventChangePayload`  | 统一回收改期结果并回写业务数据 |
| `event-receive`      | 接收外部拖入事件     | `SchedulerEventReceivePayload` | 真正把外部拖入项写入事件列表 |
| `view-change`        | 视图区间变化         | `SchedulerViewChangePayload`   | 同步当前可见区间，用于请求接口或刷新侧栏数据 |

### Payload 示例

`date-select` 常见返回结构：

```json
{
  "start": "2026-03-24T09:00:00+08:00",
  "end": "2026-03-24T11:00:00+08:00",
  "allDay": false,
  "view": "week"
}
```

`event-change` 常见返回结构：

```json
{
  "event": {
    "id": "meeting-1",
    "title": "10:30 会议",
    "start": "2026-03-24T11:00:00+08:00",
    "end": "2026-03-24T12:00:00+08:00",
    "allDay": false
  },
  "oldEvent": {
    "id": "meeting-1",
    "title": "10:30 会议",
    "start": "2026-03-24T10:30:00",
    "end": "2026-03-24T11:30:00",
    "allDay": false
  },
  "relatedEvents": [],
  "view": "day"
}
```

`event-receive` 常见返回结构：

```json
{
  "event": {
    "id": "external-standup",
    "title": "外部待办：站会",
    "start": "2026-03-24T12:00:00+08:00",
    "allDay": false,
    "extendedProps": {
      "externalTemplateId": "template-standup"
    }
  },
  "relatedEvents": [],
  "view": "week"
}
```

### Scheduler Slots

| 插槽               | 说明                 | 典型用途 |
| ------------------ | -------------------- | -------- |
| `event-content`    | 自定义事件块内容     | 给事件块补标签、状态、负责人等业务信息 |
| `day-cell-content` | 自定义日期单元格内容 | 给日期格补统计数字、节日、今日标识等辅助信息 |

### SchedulerEvent

| 字段              | 说明                    | 类型                                |
| ----------------- | ----------------------- | ----------------------------------- |
| `id`              | 事件唯一标识            | `string`                            |
| `title`           | 事件标题                | `string`                            |
| `start`           | 开始时间                | `string \| Date`                    |
| `end`             | 结束时间                | `string \| Date`                    |
| `allDay`          | 是否全天事件            | `boolean`                           |
| `rrule`           | 重复规则                | `string \| Record<string, unknown>` |
| `duration`        | 重复事件时长            | `string`                            |
| `editable`        | 事件级是否可拖拽        | `boolean`                           |
| `className`       | 事件类名                | `string \| string[]`                |
| `sourceId`        | 重复实例对应的源事件 id | `string`                            |
| `occurrenceStart` | 重复实例起始时间        | `string`                            |
| `extendedProps`   | 透传的额外业务字段      | `Record<string, unknown>`           |
