---
title: Checkbox 多选框
description: 多选框组件，用于多选操作。
outline: deep
---

# Checkbox 多选框

`xyu-checkbox` 是前台组件库的多选框组件，支持单独使用和组合使用。

## 基础用法

:::demo 单独使用多选框。
checkbox/basic
:::

## 禁用状态

:::demo 使用 `disabled` 属性禁用多选框。
checkbox/disabled
:::

## 多选框组

:::demo 使用 `xyu-checkbox-group` 管理多选框组。
checkbox/group
:::

## 不确定状态

:::demo 使用 `indeterminate` 属性设置不确定状态。
checkbox/indeterminate
:::

## 带边框

:::demo 使用 `border` 属性显示边框。
checkbox/border
:::

## API

### Checkbox Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 绑定值 | `boolean` | - |
| `label` | 标签文本 | `string` | - |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `checked` | 是否选中 | `boolean` | `false` |
| `indeterminate` | 是否不确定状态 | `boolean` | `false` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `border` | 是否显示边框 | `boolean` | `false` |

### CheckboxGroup Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 绑定值 | `(string \| number)[]` | - |
| `options` | 选项列表 | `CheckboxGroupOption[]` | `[]` |
| `disabled` | 是否全部禁用 | `boolean` | `false` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |

### CheckboxGroupOption 类型

```ts
interface CheckboxGroupOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}
```

### Checkbox Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 绑定值变化时触发 | `(value: boolean)` |
| `change` | 选中状态变化时触发 | `(value: boolean)` |
