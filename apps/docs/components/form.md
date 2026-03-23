---
title: Form 表单
description: 组织录入结构和字段级校验的基础表单组件。
outline: deep
---

# Form 表单

`xy-form` 和 `xy-form-item` 用于组织录入结构和字段级校验。它的重点不是大而全，而是让中后台常见录入链路更顺手。

## 基础用法

:::demo 最常见的场景是把 Input、Select 这类录入控件包进 `xy-form-item`，再用 `rules` 定义字段校验。
form/basic
:::

## 字段级方法

:::demo `validateField`、`clearValidate`、`resetFields` 更适合局部保存、步骤表单和字段回滚。
form/methods
:::

## 为什么它适合中后台表单

- 支持 `validateField`，适合局部保存和向导式步骤。
- 支持 `clearValidate`，适合切换数据源后清掉旧错误。
- 支持 `resetFields`，适合分区回滚而不是整表单重置。

## Form API

### Form Attributes

| 属性             | 说明         | 类型                           | 默认值    |
| ---------------- | ------------ | ------------------------------ | --------- |
| `model`          | 表单数据对象 | `Record<string, unknown>`      | —         |
| `rules`          | 校验规则集合 | `FormRules`                    | `{}`      |
| `label-width`    | 标签宽度     | `string \| number`             | `'112px'` |
| `label-position` | 标签布局方式 | `'left' \| 'top'`              | `'left'`  |
| `size`           | 表单默认尺寸 | `ComponentSize`                | `'md'`    |

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
| `prop`     | 对应的模型字段名               | `string`       | `''`    |
| `rules`    | 当前项额外规则                 | `XyFormRule[]` | `[]`    |
| `required` | 是否必填                       | `boolean`      | `false` |
| `help`     | 帮助或占位提示文案             | `string`       | `''`    |

### FormItem Slots

| 插槽      | 说明           |
| --------- | -------------- |
| `default` | 字段内容区     |
