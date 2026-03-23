---
title: Input 输入框
description: 单行文本录入组件，适合搜索、名称和短文本字段。
outline: deep
---

# Input 输入框

`xy-input` 用于单行文本录入和轻量多行文本录入，适合搜索、名称输入、密码、备注和短摘要字段。

## 基础用法

:::demo 最常见的用法是 `v-model` 绑定输入值，必要时配合 `clearable` 做筛选栏清空。
input/basic
:::

## 前后缀内容

:::demo `prefix` 和 `suffix` 插槽适合搭配图标、状态标签或单位说明使用。
input/prefix-suffix
:::

## 组合输入区

:::demo `prepend / append` 适合域名、金额、检索前缀这类有固定上下文的输入场景。
input/group
:::

## 密码显隐与字数统计

:::demo `show-password` 和 `show-word-limit` 是表单录入里最常见的两类增强能力。
input/password-word-limit
:::

## 多行表单场景

:::demo `textarea + autosize + show-word-limit` 很适合项目摘要、备注说明和审批意见这类字段。
input/textarea-form
:::

## 格式化与解析

:::demo `formatter / parser` 适合金额、比例、编号等“展示格式”和“真实值”不同的录入场景。
input/formatter-parser
:::

## 方法控制

:::demo 通过组件暴露的 `focus / blur / select / clear`，可以把输入框接进更复杂的流程，例如搜索条聚焦、快捷清空和批量编辑。
input/methods
:::

## 与表单联动

:::demo `xy-input` 位于 `xy-form-item` 内部时，会自动接入 `blur / change` 校验链路。
input/form
:::

## 行为约定

- `change` 时触发 `change` 类规则。
- `blur` 时触发 `blur` 类规则。
- 点击清空按钮时会同步清除当前字段的校验状态。
- `textarea` 支持 `autosize` 自动高度和 `resize` 控制。
- 未显式传 `title` 时，`truncated` 和 `line-clamp` 由 `xy-text` 承担，`xy-input` 不负责文本省略提示。

## API

### Input Attributes

| 属性                  | 说明                 | 类型                                                                                      | 默认值               |
| --------------------- | -------------------- | ----------------------------------------------------------------------------------------- | -------------------- |
| `model-value`         | 当前值               | `string \| number \| null \| undefined`                                                   | `''`                 |
| `model-modifiers`     | `v-model` 修饰符     | `{ lazy?: true; number?: true; trim?: true }`                                             | `{}`                 |
| `id`                  | 原生 id              | `string`                                                                                  | —                    |
| `placeholder`         | 占位文本             | `string`                                                                                  | `''`                 |
| `disabled`            | 是否禁用             | `boolean`                                                                                 | `false`              |
| `readonly`            | 是否只读             | `boolean`                                                                                 | `false`              |
| `clearable`           | 是否显示清空按钮     | `boolean`                                                                                 | `false`              |
| `clear-icon`          | 自定义清空图标       | `string`                                                                                  | `'mdi:close-circle'` |
| `show-password`       | 是否显示密码切换按钮 | `boolean`                                                                                 | `false`              |
| `show-word-limit`     | 是否显示字数统计     | `boolean`                                                                                 | `false`              |
| `word-limit-position` | 字数统计位置         | `'inside' \| 'outside'`                                                                   | `'inside'`           |
| `type`                | 输入类型             | `'text' \| 'textarea' \| 'number' \| 'password' \| 'email' \| 'search' \| 'tel' \| 'url'` | `'text'`             |
| `size`                | 组件尺寸             | `ComponentSize`                                                                           | 跟随全局配置         |
| `maxlength`           | 最大长度             | `string \| number`                                                                        | —                    |
| `minlength`           | 最小长度             | `string \| number`                                                                        | —                    |
| `rows`                | textarea 行数        | `number`                                                                                  | `2`                  |
| `resize`              | textarea resize 方向 | `'none' \| 'both' \| 'horizontal' \| 'vertical'`                                          | `'vertical'`         |
| `autosize`            | textarea 自动高度    | `boolean \| { minRows?: number; maxRows?: number }`                                       | `false`              |
| `prefix-icon`         | 前置图标             | `string`                                                                                  | `''`                 |
| `suffix-icon`         | 后置图标             | `string`                                                                                  | `''`                 |
| `formatter`           | 显示格式化函数       | `(value: string) => string`                                                               | —                    |
| `parser`              | 输入解析函数         | `(value: string) => string`                                                               | —                    |
| `autocomplete`        | 原生 autocomplete    | `string`                                                                                  | `'off'`              |
| `form`                | 原生 form            | `string`                                                                                  | —                    |
| `tabindex`            | 原生 tabindex        | `string \| number`                                                                        | —                    |
| `validate-event`      | 是否触发表单校验     | `boolean`                                                                                 | `true`               |
| `input-style`         | 原生输入框样式       | `StyleValue`                                                                              | `''`                 |
| `autofocus`           | 原生 autofocus       | `boolean`                                                                                 | `false`              |
| `aria-label`          | 原生 aria-label      | `string`                                                                                  | —                    |
| `inputmode`           | 原生 inputmode       | `HTMLAttributes['inputmode']`                                                             | —                    |
| `name`                | 原生 name            | `string`                                                                                  | —                    |

### Input Events

| 事件                 | 说明                           | 参数               |
| -------------------- | ------------------------------ | ------------------ |
| `update:model-value` | 输入值变化时触发               | `string \| number` |
| `input`              | 原生输入联动时触发             | `string \| number` |
| `change`             | 原生 `change` 触发时返回当前值 | `string \| number` |
| `clear`              | 点击清空按钮时触发             | —                  |
| `focus`              | 获得焦点时触发                 | `FocusEvent`       |
| `blur`               | 失去焦点时触发                 | `FocusEvent`       |

### Input Slots

| 插槽            | 说明                                   |
| --------------- | -------------------------------------- |
| `prepend`       | 输入框前置区域                         |
| `append`        | 输入框后置区域                         |
| `prefix`        | 输入框前缀内容                         |
| `suffix`        | 输入框后缀内容                         |
| `password-icon` | 自定义密码切换图标，接收 `{ visible }` |

### Input Exposes

| 暴露项     | 说明                 | 类型                                                           |
| ---------- | -------------------- | -------------------------------------------------------------- |
| `ref`      | 当前原生输入元素引用 | `ComputedRef<HTMLInputElement \| HTMLTextAreaElement \| null>` |
| `input`    | 单行输入框引用       | `ShallowRef<HTMLInputElement \| null>`                         |
| `textarea` | 多行输入框引用       | `ShallowRef<HTMLTextAreaElement \| null>`                      |
| `focus`    | 聚焦输入框           | `() => void`                                                   |
| `blur`     | 让输入框失焦         | `() => void`                                                   |
| `select`   | 选中当前文本         | `() => void`                                                   |
| `clear`    | 清空当前值           | `() => void`                                                   |
