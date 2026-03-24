---
title: Tabs 标签页
description: 页面分区、局部导航和视图切换的基础页签组件。
outline: deep
---

# Tabs 标签页

`xy-tabs` 适合做页面分区、局部导航和视图切换。当前版本强调键盘可达性、禁用项跳过和插槽化面板内容。

## 基础用法

:::demo 最常见的用法是传一组 `items`，再通过默认插槽渲染当前激活面板内容。
tabs/basic
:::

## 禁用页签

:::demo 禁用页签会被键盘导航自动跳过，适合放“暂未开放”或当前不可切换的面板。
tabs/disabled
:::

## 风格与位置

:::demo `type` 和 `tab-position` 用于区分视觉语义和布局方向，`stretch` 则适合更强的分区感。
tabs/position
:::

## 滚动导航

:::demo 当页签数量过多超出容器宽度时，会自动显示前后滚动按钮，并把激活项滚动到可见区域。
tabs/scrollable
:::

## 切换前守卫

:::demo `before-leave` 适合未保存变更提醒、权限校验或异步确认。
tabs/before-leave
:::

## 新增与关闭页签

:::demo `editable` 适合后台控制台、详情抽屉和工作台式视图切换，父层通过事件维护 `items` 即可。
tabs/editable
:::

## 方法与外部控制

:::demo 通过 expose 出来的 `currentName`，可以把 Tabs 接进更复杂的页面流程或工具栏操作。
tabs/methods
:::

## API

### Tabs Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前激活项 | `string` | 首个可用项 |
| `default-value` | 非受控场景下的初始激活项 | `string` | `undefined` |
| `items` | 页签项配置 | `TabItem[]` | `[]` |
| `type` | 页签风格 | `'' \| 'card' \| 'border-card'` | `''` |
| `tab-position` | 页签位置 | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` |
| `closable` | 是否默认显示关闭按钮 | `boolean` | `false` |
| `addable` | 是否显示新增按钮 | `boolean` | `false` |
| `editable` | 是否同时开启新增和关闭能力 | `boolean` | `false` |
| `stretch` | 是否拉伸平铺页签 | `boolean` | `false` |
| `before-leave` | 切换前守卫 | `(newKey, oldKey) => boolean \| void \| Promise<boolean \| void>` | `undefined` |
| `tabindex` | 激活页签的 tabindex | `string \| number` | `0` |

### TabItem

| 字段       | 说明       | 类型      | 默认值  |
| ---------- | ---------- | --------- | ------- |
| `key`      | 唯一标识   | `string`  | —       |
| `label`    | 展示文案   | `string`  | —       |
| `disabled` | 是否禁用   | `boolean` | `false` |
| `closable` | 是否显示关闭按钮 | `boolean` | 跟随 Tabs |

### Tabs Events

| 事件                 | 说明           | 参数       |
| -------------------- | -------------- | ---------- |
| `update:model-value` | 激活项变化     | `string`   |
| `change`             | 切换页签时触发 | `string`   |
| `tab-click`          | 点击页签时触发 | `(key: string, event: MouseEvent \| KeyboardEvent)` |
| `edit`               | 新增或关闭页签时触发 | `(key: string \| undefined, action: 'remove' \| 'add')` |
| `tab-remove`         | 关闭页签时触发 | `string` |
| `tab-add`            | 点击新增页签时触发 | — |

### Tabs Slots

| 插槽      | 说明                                          |
| --------- | --------------------------------------------- |
| `default` | 面板内容，暴露 `activeKey` 与 `activeItem`    |
| `add-icon` | 自定义新增按钮图标                           |

### Tabs Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `currentName` | 当前激活页签 key | `string` |
