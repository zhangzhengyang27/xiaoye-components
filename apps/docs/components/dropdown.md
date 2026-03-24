---
title: Dropdown 下拉菜单
description: 用于承载操作菜单，而不是承载值选择。
outline: deep
---

# Dropdown 下拉菜单

`xy-dropdown` 负责“操作菜单”，不是“值选择器”。如果用户是在做操作，而不是在选择枚举值，优先用 Dropdown。

## 基础用法

:::demo 行操作菜单是 Dropdown 最典型的使用场景，适合把弱操作、危险操作和说明文案收进一个菜单里。
dropdown/basic
:::

## 动态位置切换

:::demo 在工具栏、表格行操作和卡片角标里，菜单位置往往需要根据页面结构切换。
dropdown/dynamic-placement
:::

## 选择后保持展开

:::demo 关闭行为可以由 `close-on-select` 控制，适合一些连续操作或辅助说明场景。
dropdown/manual-close
:::

## 触发方式与命令派发

:::demo `trigger`、`max-height` 和 `command` 适合把 Dropdown 用成更接近后台操作菜单的形态。
dropdown/trigger-command
:::

## role 与键盘路径

Dropdown 当前支持 roving tabindex 管理焦点，默认以 `menu` 语义渲染；如果是站点导航或快捷入口，也可以切到 `navigation` 语义。

## 键盘与行为约定

- `ArrowUp / ArrowDown / Home / End` 在菜单项之间移动。
- `Enter / Space` 选择当前高亮项。
- `Escape` 关闭菜单并把焦点还给触发器。
- `Tab` 会关闭菜单；当前高亮项通过 roving tabindex 管理。

## API

### Dropdown Attributes

| 属性              | 说明           | 类型             | 默认值           |
| ----------------- | -------------- | ---------------- | ---------------- |
| `model-value`     | 受控显示状态   | `boolean`        | `false`          |
| `items`           | 菜单项列表     | `DropdownItem[]` | `[]`             |
| `placement`       | 菜单位置       | `Placement`      | `'bottom-start'` |
| `disabled`        | 是否禁用       | `boolean`        | `false`          |
| `close-on-select` | 选择后是否关闭 | `boolean`        | `true`           |
| `role`            | 菜单语义       | `'menu' \| 'navigation'` | `'menu'` |
| `trigger`         | 触发方式       | `'hover' \| 'click' \| 'contextmenu'` | `'hover'` |
| `open-delay`      | hover 打开延迟 | `number`         | `80`             |
| `close-delay`     | hover 关闭延迟 | `number`         | `120`            |
| `show-after`      | 打开延迟别名，优先级高于 `open-delay` | `number` | `undefined` |
| `hide-after`      | 关闭延迟别名，优先级高于 `close-delay` | `number` | `undefined` |
| `max-height`      | 菜单最大高度   | `string \| number` | `''`           |
| `teleported`      | 是否通过 Teleport 挂载到外层容器 | `boolean` | `true` |
| `append-to`       | Teleport 的挂载目标 | `string \| HTMLElement` | `'body'` |
| `persistent`      | 关闭后是否保留 DOM | `boolean` | `false` |
| `popper-class`    | 菜单容器自定义类名 | `string` | `''` |
| `popper-style`    | 菜单容器自定义样式 | `StyleValue` | `undefined` |

### DropdownItem

| 字段          | 说明             | 类型      | 默认值      |
| ------------- | ---------------- | --------- | ----------- |
| `key`         | 菜单项标识       | `string`  | —           |
| `label`       | 展示文案         | `string`  | —           |
| `disabled`    | 是否禁用         | `boolean` | `false`     |
| `danger`      | 是否危险操作样式 | `boolean` | `false`     |
| `description` | 辅助描述         | `string`  | `undefined` |
| `command`     | 额外派发值       | `string \| number \| Record<string, unknown>` | `key` |

### Dropdown Events

| 事件             | 说明             | 参数           |
| ---------------- | ---------------- | -------------- |
| `update:model-value` | 开关状态变化 | `boolean`      |
| `select`         | 选择菜单项       | `DropdownItem` |
| `command`        | 触发命令派发     | `command, item` |
| `visible-change` | 菜单开关状态变化 | `boolean`      |

### Dropdown Slots

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 触发区域 |
