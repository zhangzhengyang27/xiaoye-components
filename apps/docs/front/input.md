---
title: Input 输入框
description: 文本输入框，支持多种类型和功能。
outline: deep
---

# Input 输入框

`xyu-input` 是前台组件库的基础输入框组件，支持文本、密码、文本域等多种类型。

## 基础用法

:::demo 使用 `v-model` 绑定输入值。
input/basic
:::

## 禁用状态

:::demo 使用 `disabled` 属性禁用输入框。
input/disabled
:::

## 可清空

:::demo 使用 `clearable` 属性显示清空按钮。
input/clearable
:::

## 密码输入

:::demo 使用 `type="password"` 创建密码输入框，配合 `show-password` 显示密码切换按钮。
input/password
:::

## 图标

:::demo 使用 `prefix-icon` 和 `suffix-icon` 添加前缀和后缀图标。
input/icon
:::

## 文本域

:::demo 使用 `type="textarea"` 创建多行文本输入框。
input/textarea
:::

## API

### Input Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 绑定值 | `string \| number` | - |
| `type` | 输入框类型 | `'text' \| 'password' \| 'textarea'` | `'text'` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `readonly` | 是否只读 | `boolean` | `false` |
| `clearable` | 是否可清空 | `boolean` | `false` |
| `show-password` | 是否显示密码切换按钮 | `boolean` | `false` |
| `placeholder` | 占位文本 | `string` | - |
| `rows` | 文本域行数 | `number` | `3` |

### Input Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 绑定值变化时触发 | `(value: string \| number)` |
| `focus` | 聚焦时触发 | `(event: FocusEvent)` |
| `blur` | 失焦时触发 | `(event: FocusEvent)` |
| `clear` | 点击清空按钮时触发 | `(event: Event)` |

### Input Slots

| 插槽名 | 说明 |
| --- | --- |
| `prefix` | 前缀内容 |
| `suffix` | 后缀内容 |
| `clear-icon` | 自定义清空图标 |
