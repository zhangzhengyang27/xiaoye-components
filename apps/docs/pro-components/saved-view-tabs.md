---
title: SavedViewTabs 视图页签
description: 把常用列表视图和快捷切换收成页签结构。
outline: deep
---

# SavedViewTabs 视图页签

`xy-saved-view-tabs` 适合承接“全部订单、待处理、异常单”这类常见业务视图，给列表页一个稳定的视图切换层。

## 基础用法

:::demo 页签视图通常和列表工具栏、筛选区、表格一起出现，用来承接不同看板口径。
pro/saved-view-tabs/basic
:::

## 当前定位

- 负责视图页签展示、切换、新建和移除。
- 适合作为列表页的高层筛选入口。

## 当前边界

- 当前不处理视图内容持久化、共享权限和复杂筛选表达式。
- 页签切换后的真实查询参数仍需页面层维护。

## SavedViewTabs API

### SavedViewTabs Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `items` | 视图页签数据，每项含 `key / label`，可选 `count`（展示为 `label (count)`）和 `closable` | `SavedViewTabItem[]` | `[]` |
| `active-key` | 当前激活页签 key，支持 `v-model:active-key` | `string` | `''` |
| `addable` | 是否显示新增页签入口 | `boolean` | `false` |

### SavedViewTabs Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:activeKey` | 激活页签变化时派发 | `(value: string) => void` |
| `select` | 选中某个视图页签时派发 | `(item: SavedViewTabItem) => void` |
| `remove` | 关闭某个视图页签时派发 | `(item: SavedViewTabItem) => void` |
| `create` | 点击新增页签入口时派发 | `() => void` |

### SavedViewTabs Slots

| 插槽 | 说明 | 接收参数 |
| --- | --- | --- |
| `default` | 页签内容区，原样透传给内部 `xy-tabs` 的默认插槽 | `-` |
