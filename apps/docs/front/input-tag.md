---
title: InputTag 标签输入
description: 标签输入组件，用于输入多个标签。
outline: deep
---

# InputTag 标签输入

`xyu-input-tag` 是前台组件库的标签输入组件，用于输入和展示多个标签。

## 基础用法

:::demo 基础标签输入用法。
input-tag/basic
:::

## 可清空

:::demo 使用 `clearable` 属性显示清空按钮。
input-tag/clearable
:::

## 禁用状态

:::demo 使用 `disabled` 属性禁用输入框。
input-tag/disabled
:::

## 最大标签数

:::demo 使用 `max` 属性限制最大标签数。
input-tag/max
:::

## 分隔符

:::demo 使用 `split` 属性设置分隔符。
input-tag/split
:::

## API

### InputTag Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 绑定值 | `string[]` | - |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `type` | 输入框类型 | `string` | `'text'` |
| `placeholder` | 占位文本 | `string` | `'输入标签后按回车'` |
| `max` | 最大标签数 | `number` | `Infinity` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `readonly` | 是否只读 | `boolean` | `false` |
| `clearable` | 是否可清空 | `boolean` | `false` |
| `allow-duplicate` | 是否允许重复标签 | `boolean` | `false` |
| `split` | 分隔符 | `string` | `','` |
| `maxlength` | 最大输入长度 | `number` | - |

### InputTag Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 标签列表变化时触发 | `(value: string[])` |
| `change` | 标签列表变化时触发 | `(value: string[])` |
| `add` | 添加标签时触发 | `(tag: string)` |
| `remove` | 移除标签时触发 | `(tag: string, index: number)` |
| `clear` | 清空所有标签时触发 | - |

### InputTag Exposes

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| `focus` | 使输入框获得焦点 | - |
| `addTag` | 添加标签 | `(tag: string)` |
| `removeTag` | 移除标签 | `(index: number)` |
