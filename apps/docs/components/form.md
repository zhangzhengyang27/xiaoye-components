---
title: Form 表单
description: 组织录入结构和字段级校验的基础表单组件。
outline: deep
---

# Form 表单

`xy-form` 和 `xy-form-item` 用于组织录入结构和字段级校验。当前版本补上了内联布局、整表禁用、嵌套路径字段和滚动到错误项这些后台表单高频能力。

## 基础用法

:::demo 最常见的场景是把 Input、Select 这类录入控件包进 `xy-form-item`，再用 `rules` 定义字段校验。
form/basic
:::

## 字段级方法

:::demo `validateField`、`clearValidate`、`resetFields` 更适合局部保存、步骤表单和字段回滚。
form/methods
:::

## 内联布局与禁用继承

:::demo `inline` 适合筛选条和轻量查询表单，`disabled` 会向表单项和内层录入控件传递禁用状态。
form/inline
:::

## 嵌套字段与滚动到错误项

:::demo `prop` 支持点路径和路径数组，`scroll-to-error` 适合长表单提交失败时快速定位首个错误字段。
form/nested
:::

## 为什么它适合中后台表单

- 支持 `validateField`，适合局部保存和向导式步骤。
- 支持 `clearValidate`，适合切换数据源后清掉旧错误。
- 支持 `resetFields`，适合分区回滚而不是整表单重置。
- 支持嵌套字段路径，适合把表单直接绑定到业务对象结构。
- 支持 `scroll-to-error`，适合长表单失败后的错误定位。

## Form API

### Form Attributes

| 属性             | 说明         | 类型                           | 默认值    |
| ---------------- | ------------ | ------------------------------ | --------- |
| `model`          | 表单数据对象 | `Record<string, unknown>`      | —         |
| `rules`          | 校验规则集合 | `FormRules`                    | `{}`      |
| `label-width`    | 标签宽度     | `string \| number`             | `'112px'` |
| `label-position` | 标签布局方式 | `'left' \| 'top'`              | `'left'`  |
| `size`           | 表单默认尺寸 | `ComponentSize`                | `'md'`    |
| `inline`         | 是否启用内联布局 | `boolean`                   | `false`   |
| `disabled`       | 是否整表禁用 | `boolean`                     | `false`   |
| `scroll-to-error` | 校验失败时滚动到首个错误字段 | `boolean`  | `false`   |
| `validate-on-rule-change` | 规则变化后是否自动重新校验 | `boolean` | `true` |

### Form Exposes

| 方法                             | 说明                                         |
| -------------------------------- | -------------------------------------------- |
| `validate()`                     | 校验整个表单                                 |
| `validateField(props, trigger?)` | 校验指定字段                                 |
| `resetFields(props?)`            | 重置指定字段或整表单                         |
| `clearValidate(props?)`          | 清空指定字段或整表单的校验信息               |

## FormItem API

### FormItem Attributes

| 属性       | 说明                           | 类型           | 默认值  |
| ---------- | ------------------------------ | -------------- | ------- |
| `label`    | 字段标签                       | `string`       | `''`    |
| `prop`     | 对应的模型字段名               | `string \| string[]` | `''` |
| `rules`    | 当前项额外规则                 | `XyFormRule[]` | `[]`    |
| `required` | 是否必填                       | `boolean`      | `false` |
| `help`     | 帮助或占位提示文案             | `string`       | `''`    |

### FormItem Slots

| 插槽      | 说明           |
| --------- | -------------- |
| `default` | 字段内容区     |
