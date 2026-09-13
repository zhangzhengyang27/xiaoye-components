---
title: HeaderTabs 头部页签
description: 工作台头部页签与批量操作菜单。
outline: deep
---

# HeaderTabs 头部页签

`xy-header-tabs` 用来承接多页签后台壳子的顶部标签切换和批量关闭动作。

## 基础用法

:::demo 适合在管理后台壳子里统一承接标签页切换。
pro/header-tabs/basic
:::

## HeaderTabs API

### HeaderTabs Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前激活页签 key，受控模式 | `string` | `undefined` |
| `default-value` | 默认激活页签 key，非受控模式 | `string` | `undefined` |
| `items` | 页签数据，`HeaderTabItem` 继承自 `TabItem` 并扩展 `badge?: string \| number` | `HeaderTabItem[]` | `[]` |
| `type` | 页签风格 | `TabsType`（`'' \| 'card' \| 'border-card'`） | `'card'` |
| `tab-position` | 页签位置 | `TabsPosition`（`'top' \| 'right' \| 'bottom' \| 'left'`） | `'top'` |
| `closable` | 是否显示页签关闭按钮 | `boolean` | `true` |
| `addable` | 是否允许新增页签 | `boolean` | `false` |
| `editable` | 是否编辑模式（同时开启新增和关闭） | `boolean` | `false` |
| `before-leave` | 切换页签前的拦截钩子 | `TabsBeforeLeave` | `undefined` |
| `menu-actions` | 右侧批量操作菜单项 | `Array<{ key: HeaderTabsMenuAction; label: string }>` | 内置五个关闭动作：关闭当前、关闭其他、关闭左侧、关闭右侧、关闭全部 |

### HeaderTabs Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 激活页签变化时派发 | `(value: string) => void` |
| `change` | 激活页签变化时派发 | `(value: string) => void` |
| `edit` | 页签新增或关闭时派发 | `(key: string \| undefined, action: 'remove' \| 'add') => void` |
| `tabRemove` | 关闭页签时派发 | `(key: string) => void` |
| `tabAdd` | 点击新增页签时派发 | `() => void` |
| `tabMenuClick` | 点击右侧菜单动作时派发 | `(action: HeaderTabsMenuAction) => void`，`HeaderTabsMenuAction` 即 `'close-current' \| 'close-others' \| 'close-left' \| 'close-right' \| 'close-all'` |
