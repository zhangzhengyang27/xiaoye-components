---
title: Select 选择器
description: 下拉选择器组件。
outline: deep
---

# Select 选择器

`xyu-select` 是前台组件库的下拉选择器组件，支持单选、多选和搜索功能。

## 基础用法

:::demo 使用 `options` 传入选项列表。
select/basic
:::

## 禁用状态

:::demo 使用 `disabled` 属性禁用选择器。
select/disabled
:::

## 可清空

:::demo 使用 `clearable` 属性显示清空按钮。
select/clearable
:::

## 多选

:::demo 使用 `multiple` 属性开启多选模式。
select/multiple
:::

## 搜索

:::demo 当选项超过 5 个时自动显示搜索框。
select/search
:::

## API

### Select Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 绑定值 | `string \| number \| (string \| number)[]` | - |
| `options` | 选项列表 | `SelectOption[]` | `[]` |
| `placeholder` | 占位文本 | `string` | `'请选择'` |
| `size` | 尺寸 | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `clearable` | 是否可清空 | `boolean` | `false` |
| `multiple` | 是否多选 | `boolean` | `false` |
| `collapse-tags` | 多选时是否折叠标签 | `boolean` | `false` |
| `max-tag-count` | 多选时最多显示标签数 | `number` | - |
| `no-data-text` | 无数据时显示的文本 | `string` | `'暂无选项'` |

### SelectOption 类型

```ts
interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}
```

### Select Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 绑定值变化时触发 | `(value: unknown)` |
| `change` | 选择变化时触发 | `(value: unknown)` |

### Select Slots

| 插槽名 | 说明 |
| --- | --- |
| `options` | 自定义选项列表 |
| `tag` | 自定义标签内容 |
