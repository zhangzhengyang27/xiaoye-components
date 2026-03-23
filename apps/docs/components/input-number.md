---
title: Input Number 数字输入框
description: 带步进控制、精度约束和表单校验联动的数值输入组件。
outline: deep
---

# Input Number 数字输入框

`xy-input-number` 适合数量、金额、时长、阈值这类“既能手输，又要能稳定步进”的字段。它在当前仓库里重点覆盖后台表单和筛选面板的常见数值录入。

## 基础用法

:::demo 最常见的用法是配合 `v-model` 绑定数值，再通过 `min / max / step` 约束可选范围。
input-number/basic
:::

## 控制按钮与对齐

:::demo `controls-position="right"` 适合列表筛选栏，`align` 用来控制输入框内数值的阅读节奏。
input-number/controls
:::

## 精度、步长和清空策略

:::demo 金额、费率和比例字段通常需要一起配置 `precision`、`step-strictly` 和 `value-on-clear`。
input-number/precision
:::

## 清空策略与输入限制

:::demo `value-on-clear` 和 `disabled-scientific` 适合金额、比例这类不希望出现空值漂移或科学计数法的录入字段。
input-number/clear-scientific
:::

## 表单场景

:::demo 放在 `xy-form-item` 里时，`xy-input-number` 会参与 `change / blur` 校验链路。
input-number/form
:::

## 方法控制与自定义图标

:::demo 通过 expose 的 `focus / blur / increase / decrease`，可以把数字输入接进更复杂的编辑流程；`increase-icon / decrease-icon` 则适合接入项目自己的图标系统。
input-number/methods
:::

## 键盘与行为约定

- `ArrowUp / ArrowDown` 会按 `step` 增减当前值。
- 开启 `step-strictly` 后，手输结果会在确认时校正为步长倍数。
- 清空输入框后，默认回写 `null`；可通过 `value-on-clear` 改成 `min`、`max` 或某个固定数字。
- `disabled-scientific` 会阻止输入 `e / E`，适合不希望出现科学计数法的录入场景。

## API

### Input Number Attributes

| 属性                  | 说明                  | 类型                               | 默认值                    |
| --------------------- | --------------------- | ---------------------------------- | ------------------------- |
| `model-value`         | 当前值                | `number \| null`                   | `null`                    |
| `min`                 | 最小值                | `number`                           | `Number.MIN_SAFE_INTEGER` |
| `max`                 | 最大值                | `number`                           | `Number.MAX_SAFE_INTEGER` |
| `step`                | 步进值                | `number`                           | `1`                       |
| `step-strictly`       | 是否只允许步长倍数    | `boolean`                          | `false`                   |
| `precision`           | 数值精度              | `number`                           | `undefined`               |
| `size`                | 组件尺寸              | `'sm' \| 'md' \| 'lg'`             | 跟随全局配置              |
| `disabled`            | 是否禁用              | `boolean`                          | `false`                   |
| `readonly`            | 是否只读              | `boolean`                          | `false`                   |
| `controls`            | 是否显示步进按钮      | `boolean`                          | `true`                    |
| `controls-position`   | 控制按钮位置          | `'' \| 'right'`                    | `''`                      |
| `value-on-clear`      | 清空后的回写值        | `'min' \| 'max' \| number \| null` | `null`                    |
| `placeholder`         | 占位文本              | `string`                           | `''`                      |
| `name`                | 原生 `name`           | `string`                           | `undefined`               |
| `validate-event`      | 是否触发表单校验      | `boolean`                          | `true`                    |
| `aria-label`          | 原生 `aria-label`     | `string`                           | `undefined`               |
| `inputmode`           | 原生 `inputmode`      | `HTMLAttributes['inputmode']`      | 自动推导                  |
| `align`               | 数值对齐方式          | `'left' \| 'center' \| 'right'`    | `'center'`                |
| `disabled-scientific` | 是否禁用 `e / E` 输入 | `boolean`                          | `false`                   |

### Input Number Events

| 事件                 | 说明             | 参数                                                |
| -------------------- | ---------------- | --------------------------------------------------- |
| `update:model-value` | 当前值变化时触发 | `number \| null`                                    |
| `input`              | 输入中触发       | `number \| null`                                    |
| `change`             | 确认变更时触发   | `(value: number \| null, oldValue: number \| null)` |
| `focus`              | 获得焦点时触发   | `FocusEvent`                                        |
| `blur`               | 失去焦点时触发   | `FocusEvent`                                        |

### Input Number Slots

| 插槽            | 说明               |
| --------------- | ------------------ |
| `increase-icon` | 自定义增加按钮图标 |
| `decrease-icon` | 自定义减少按钮图标 |

### Input Number Exposes

| 暴露项     | 说明           | 类型                                   |
| ---------- | -------------- | -------------------------------------- |
| `input`    | 原生输入框引用 | `ShallowRef<HTMLInputElement \| null>` |
| `focus`    | 聚焦输入框     | `() => void`                           |
| `blur`     | 让输入框失焦   | `() => void`                           |
| `increase` | 按当前步长增加 | `() => void`                           |
| `decrease` | 按当前步长减少 | `() => void`                           |
