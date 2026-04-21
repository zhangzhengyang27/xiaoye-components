---
title: Cascader 级联选择
description: 级联选择器组件，用于多级数据选择。
outline: deep
---

# Cascader 级联选择

`xyu-cascader` 是前台组件库的级联选择器组件，用于多级数据的逐级选择。

## 基础用法

:::demo 基础级联选择器用法。
cascader/basic
:::

## 禁用状态

:::demo 使用 `disabled` 属性禁用选择器。
cascader/disabled
:::

## 清空选项

:::demo 使用 `clearable` 属性显示清空按钮。
cascader/clearable
:::

## 选择任意一级

:::demo 使用 `check-strictly` 属性允许选择任意级别。
cascader/any
:::

## 多选模式

:::demo 使用 `multiple` 属性开启多选模式。
cascader/multiple
:::

## API

### Cascader Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `v-model` | 绑定值 | `string \| string[]` | - |
| `options` | 级联数据 | `CascaderOption[]` | `[]` |
| `placeholder` | 占位文本 | `string` | `'请选择'` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `clearable` | 是否可清空 | `boolean` | `false` |
| `check-strictly` | 是否选择任意级别 | `boolean` | `false` |
| `multiple` | 是否多选 | `boolean` | `false` |
| `separator` | 选项分隔符 | `string` | `'/'` |
| `show-all-levels` | 是否显示完整路径 | `boolean` | `true` |

### CascaderOption 类型

```ts
interface CascaderOption {
  value: string | number;
  label: string;
  children?: CascaderOption[];
  disabled?: boolean;
}
```

### Cascader Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 绑定值变化时触发 | `(value: unknown)` |
| `change` | 选择变化时触发 | `(value: unknown)` |
