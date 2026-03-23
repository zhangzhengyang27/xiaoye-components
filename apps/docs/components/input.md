---
title: Input 输入框
description: 单行文本录入组件，适合搜索、名称和短文本字段。
outline: deep
---

# Input 输入框

`xy-input` 用于单行文本录入，适合搜索、名称输入、邮箱输入等轻量表单场景。

## 基础用法

:::demo 最常见的用法是 `v-model` 绑定输入值，必要时配合 `clearable` 做筛选栏清空。
input/basic
:::

## 前后缀内容

:::demo `prefix` 和 `suffix` 插槽适合搭配图标、状态标签或单位说明使用。
input/prefix-suffix
:::

## 与表单联动

:::demo `xy-input` 位于 `xy-form-item` 内部时，会自动接入 `blur / change` 校验链路。
input/form
:::

## 行为约定

- `change` 时触发 `change` 类规则。
- `blur` 时触发 `blur` 类规则。
- 点击清空按钮时会同步清除当前字段的校验状态。

## API

### Input Attributes

| 属性          | 说明             | 类型                                                      | 默认值       |
| ------------- | ---------------- | --------------------------------------------------------- | ------------ |
| `model-value` | 当前值           | `string \| number`                                        | `''`         |
| `placeholder` | 占位文本         | `string`                                                  | `''`         |
| `disabled`    | 是否禁用         | `boolean`                                                 | `false`      |
| `clearable`   | 是否显示清空按钮 | `boolean`                                                 | `false`      |
| `readonly`    | 是否只读         | `boolean`                                                 | `false`      |
| `type`        | 输入类型         | `'text' \| 'password' \| 'email' \| 'search' \| 'number'` | `'text'`     |
| `size`        | 组件尺寸         | `ComponentSize`                                           | 跟随全局配置 |

### Input Events

| 事件                 | 说明                         | 参数         |
| -------------------- | ---------------------------- | ------------ |
| `update:model-value` | 输入值变化时触发             | `string`     |
| `change`             | 原生 `change` 触发时返回当前值 | `string`   |
| `clear`              | 点击清空按钮时触发           | —            |
| `focus`              | 获得焦点时触发               | `FocusEvent` |
| `blur`               | 失去焦点时触发               | `FocusEvent` |

### Input Slots

| 插槽      | 说明           |
| --------- | -------------- |
| `prefix`  | 输入框前缀内容 |
| `suffix`  | 输入框后缀内容 |
