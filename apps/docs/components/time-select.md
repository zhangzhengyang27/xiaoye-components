---
title: TimeSelect 时间选择
description: 固定时间点下拉选择，适合预约、营业时间和开始/结束时间联动。
outline: deep
---

# TimeSelect 时间选择

`xy-time-select` 参考 Element Plus 的 `TimeSelect` 交互，聚焦“固定步长时间点选择”这一类场景，适合预约时段、营业窗口、开始/结束时间联动。当前版本只覆盖下拉选择，不提供自由输入。

## 基础用法

:::demo 默认以 `09:00 - 18:00`、`30 分钟`步长生成选项，回写格式默认为 `HH:mm`。
time-select/basic
:::

## 开始 / 结束时间联动

:::demo 通过 `min-time` 和 `max-time` 可以快速搭出开始时间与结束时间的相互约束。
time-select/range
:::

## 时间格式与包含结束时间

:::demo `format` 可以把展示值切到 12 小时制，`include-end-time` 适合保留最后一个截止时间点。
time-select/format
:::

## 表单场景

:::demo 放在 `xy-form-item` 内部时，TimeSelect 会接入 `change / blur` 校验链路。
time-select/form
:::

## 受控回填与快捷打开

:::demo 通过 expose 的 `open / close` 和外部回填值，可以接进筛选栏快捷操作、默认时间回填和批量预约流程。
time-select/controlled
:::

## 行为约定

- `ArrowDown / ArrowUp / Home / End` 在菜单项之间移动。
- `Enter / Space` 在打开状态下选择当前高亮项。
- `Escape` 关闭面板并把焦点还给触发器。
- `min-time / max-time` 只控制禁用态，不会自动清空当前已有值。

## API

### TimeSelect Attributes

| 属性               | 说明                   | 类型             | 默认值         |
| ------------------ | ---------------------- | ---------------- | -------------- |
| `model-value`      | 当前选中值             | `string \| null` | `null`         |
| `placeholder`      | 占位提示               | `string`         | `'请选择时间'` |
| `disabled`         | 是否禁用               | `boolean`        | `false`        |
| `clearable`        | 是否允许清空           | `boolean`        | `false`        |
| `size`             | 组件尺寸               | `ComponentSize`  | 跟随全局配置   |
| `start`            | 开始时间               | `string`         | `'09:00'`      |
| `end`              | 结束时间               | `string`         | `'18:00'`      |
| `step`             | 步长                   | `string`         | `'00:30'`      |
| `min-time`         | 最小可选时间           | `string`         | —              |
| `max-time`         | 最大可选时间           | `string`         | —              |
| `include-end-time` | 是否把结束时间纳入选项 | `boolean`        | `false`        |
| `format`           | 展示与回传格式         | `string`         | `'HH:mm'`      |
| `validate-event`   | 是否触发表单校验       | `boolean`        | `true`         |

### TimeSelect Events

| 事件                 | 说明               | 参数             |
| -------------------- | ------------------ | ---------------- |
| `update:model-value` | 选中值变化时触发   | `string \| null` |
| `change`             | 值变化后触发       | `string \| null` |
| `clear`              | 点击清空按钮时触发 | —                |
| `visible-change`     | 面板显隐变化时触发 | `boolean`        |
| `focus`              | 打开面板时触发     | —                |
| `blur`               | 面板关闭时触发     | —                |

### TimeSelect Exposes

| 暴露项  | 说明               | 类型                  |
| ------- | ------------------ | --------------------- |
| `focus` | 聚焦触发器         | `() => void`          |
| `blur`  | 关闭并让触发器失焦 | `() => Promise<void>` |
| `open`  | 打开下拉面板       | `() => Promise<void>` |
| `close` | 关闭下拉面板       | `() => Promise<void>` |
