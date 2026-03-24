---
title: Switch 开关
description: 用于二值状态切换、功能启停和轻量模式切换的基础组件。
outline: deep
---

# Switch 开关

`xy-switch` 适合启用/停用、公开/私密、自动/手动这类二值状态切换场景。和 `radio` 不同，它强调的是当前状态的即时切换，而不是一组互斥选项中的选择。

## 基础用法

:::demo 最常见的用法是直接用 `v-model` 绑定布尔值，再通过 `active-text / inactive-text` 说明状态语义。
switch/basic
:::

## 文案、图标和枚举值

:::demo `active-value / inactive-value` 适合和后端枚举值直连，`inline-prompt` 适合空间更紧凑的场景。
switch/text
:::

## 状态插槽

:::demo 当你需要更强的语义表达时，优先使用 `active / inactive / active-action / inactive-action` 插槽，而不是继续堆叠文本属性。
switch/slots
:::

## 方法与可访问性

:::demo `xy-switch` 暴露了 `focus` 和 `checked`，适合接入步骤流、快捷键聚焦和无障碍引导。
switch/methods
:::

## 禁用、加载与切换前校验

:::demo `loading` 会临时锁定交互，`before-change` 适合异步确认或前置校验。
switch/loading
:::

## 表单场景

:::demo 放在 `xy-form-item` 内部时，`xy-switch` 会在状态变更后参与 `change` 校验。
switch/form
:::

## 行为约定

- 点击组件主体会切换状态。
- `Space` 使用原生 checkbox 语义切换，`Enter` 也支持手动触发切换。
- `loading` 和 `disabled` 都会阻止交互。
- `before-change` 返回 `false`，或返回的 Promise reject 时，不会切换状态。
- 建议在无可见文案时补 `aria-label`，便于读屏和自动化测试识别。

## API

### Switch Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前值 | `boolean \| string \| number` | `false` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `loading` | 是否显示加载态并阻止交互 | `boolean` | `false` |
| `size` | 组件尺寸 | `ComponentSize` | 跟随全局配置 |
| `width` | 自定义轨道宽度 | `string \| number` | `undefined` |
| `inline-prompt` | 是否把状态内容放到轨道内部 | `boolean` | `false` |
| `inactive-action-icon` | 未选中时拇指内图标 | `string` | `''` |
| `active-action-icon` | 选中时拇指内图标 | `string` | `''` |
| `active-icon` | 选中状态图标 | `string` | `''` |
| `inactive-icon` | 未选中状态图标 | `string` | `''` |
| `active-text` | 选中状态文案 | `string` | `''` |
| `inactive-text` | 未选中状态文案 | `string` | `''` |
| `active-value` | 选中状态值 | `boolean \| string \| number` | `true` |
| `inactive-value` | 未选中状态值 | `boolean \| string \| number` | `false` |
| `name` | 原生 `name` | `string` | `undefined` |
| `validate-event` | 是否触发表单校验 | `boolean` | `true` |
| `before-change` | 切换前守卫 | `() => boolean \| Promise<boolean>` | `undefined` |
| `id` | 原生 id | `string` | `undefined` |
| `tabindex` | 原生 tabindex | `string \| number` | `undefined` |
| `aria-label` | 原生 aria-label | `string` | `undefined` |

### Switch Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:model-value` | 状态变化时触发 | `boolean \| string \| number` |
| `change` | 用户确认切换后触发 | `boolean \| string \| number` |
| `input` | 状态变化时同步触发 | `boolean \| string \| number` |
| `focus` | 获得焦点时触发 | `FocusEvent` |
| `blur` | 失去焦点时触发 | `FocusEvent` |

### Switch Slots

| 插槽 | 说明 |
| --- | --- |
| `active` | 自定义选中状态内容 |
| `inactive` | 自定义未选中状态内容 |
| `active-action` | 自定义选中状态拇指内容 |
| `inactive-action` | 自定义未选中状态拇指内容 |

### Switch Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `focus` | 聚焦开关 | `() => void` |
| `checked` | 当前是否处于选中态 | `ComputedRef<boolean>` |
