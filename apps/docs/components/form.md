---
title: Form 表单
description: 组织录入结构和字段级校验的基础表单组件。
outline: deep
---

# Form 表单

`xy-form` 和 `xy-form-item` 用于组织录入结构和字段级校验。当前版本补上了内联布局、整表禁用、嵌套路径字段和滚动到错误项这些后台表单高频能力。

## 何时使用

- 需要对用户输入做字段级校验（必填、格式、范围等）时。
- 需要统一管理表单数据对象和校验规则时，配合 `model` + `rules` 使用。
- 需要局部保存、步骤表单或字段回滚时，使用 `validateField` / `clearValidate` / `resetFields`。
- 需要长表单提交失败后自动滚动到首个错误字段时，开启 `scroll-to-error`。
- 需要整表禁用（如审批流中"只读查看"态）时，使用 `disabled` 向下传递。

## 何时不使用

- 只需要简单展示数据而不需要校验时，直接用布局组件组织即可，不必包裹 Form。
- 需要动态增减字段的复杂表单时，建议使用 `xy-pro-form` 或自行管理数组结构，Form 本身不提供动态字段 API。
- 需要跨表单联动校验时，Form 的 `rules` 仅作用于当前表单实例，跨表单逻辑需自行编排。
- 需要可视化拖拽搭建表单时，Form 不提供设计器能力，应使用上层方案。

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
| `model`          | 表单数据对象 | `FormProps["model"]`           | —         |
| `rules`          | 校验规则集合 | `FormRules`                    | `{}`      |
| `label-width`    | 标签宽度     | `string \| number`             | `'112px'` |
| `label-position` | 标签布局方式 | `FormProps["labelPosition"]`   | `'left'`  |
| `size`           | 表单默认尺寸 | `FormProps["size"]`            | `'md'`    |
| `inline`         | 是否启用内联布局 | `boolean`                   | `false`   |
| `disabled`       | 是否整表禁用 | `boolean`                     | `false`   |
| `scroll-to-error` | 校验失败时滚动到首个错误字段 | `boolean`  | `false`   |
| `validate-on-rule-change` | 规则变化后是否自动重新校验 | `boolean` | `true` |

### Form Exposes

| 方法                             | 说明                                         | 签名 |
| -------------------------------- | -------------------------------------------- | ---- |
| `validate()`                     | 校验整个表单                                 | `FormInstance["validate"]` |
| `validateField(props, trigger?)` | 校验指定字段                                 | `FormInstance["validateField"]` |
| `resetFields(props?)`            | 重置指定字段或整表单                         | `FormInstance["resetFields"]` |
| `clearValidate(props?)`          | 清空指定字段或整表单的校验信息               | `FormInstance["clearValidate"]` |

## FormItem API

### FormItem Attributes

| 属性       | 说明                           | 类型           | 默认值  |
| ---------- | ------------------------------ | -------------- | ------- |
| `label`    | 字段标签                       | `string`       | `''`    |
| `prop`     | 对应的模型字段名               | `FormProp` | `''` |
| `rules`    | 当前项额外规则                 | `XyFormRule[]` | `[]`    |
| `required` | 是否必填                       | `boolean`      | `false` |
| `help`     | 帮助或占位提示文案             | `string`       | `''`    |

### FormItem Slots

| 插槽      | 说明           |
| --------- | -------------- |
| `default` | 字段内容区     |
