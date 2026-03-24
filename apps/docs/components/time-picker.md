---
title: TimePicker 时间选择器
description: 支持单值、范围和格式化显示的时间选择器。
outline: deep
---

# TimePicker 时间选择器

`xy-time-picker` 适合提醒时间、营业时段、排班时间和后台配置里的时分秒选择。当前版本聚焦草稿选择、确认提交、范围模式和禁用规则这几类中后台高频时间场景。

## 基础用法

:::demo 绑定一个时间字符串，默认格式为 `HH:mm:ss`。
time-picker/basic
:::

## HH:mm 精简时间

:::demo 只保留小时和分钟时，适合提醒时间、预约时间和排班起始点这类不关心秒位的场景。
time-picker/hhmm
:::

## 禁用时分秒

:::demo 通过 `disabled-hours / disabled-minutes / disabled-seconds` 分别控制不可选的时段、分钟和秒位。
time-picker/disabled-sections
:::

## 范围选择

:::demo 开启 `is-range` 后，会输出 `[start, end]` 形式的时间数组，适合营业窗口和值班时段。
time-picker/range
:::

## 表单场景

:::demo TimePicker 放在 `xy-form-item` 内时，会参与 `change / blur` 校验链路。
time-picker/form
:::

## 行为约定

- 触发器支持 `Enter / Space / ArrowDown` 打开面板。
- 面板内支持 `Enter` 确认当前草稿时间，`Escape` 关闭面板。
- `format="HH:mm"` 时不渲染秒列，输出值也会同步去掉秒。
- `is-range` 模式下若开始时间晚于结束时间，确认时会自动按从早到晚排序。

## API

### TimePicker Attributes

| 属性                | 说明             | 类型                                         | 默认值         |
| ------------------- | ---------------- | -------------------------------------------- | -------------- |
| `model-value`       | 当前值           | `string \| [string, string] \| null`         | `null`         |
| `placeholder`       | 单值占位文本     | `string`                                     | `'请选择时间'` |
| `start-placeholder` | 范围开始占位文本 | `string`                                     | `'开始时间'`   |
| `end-placeholder`   | 范围结束占位文本 | `string`                                     | `'结束时间'`   |
| `disabled`          | 是否禁用         | `boolean`                                    | `false`        |
| `clearable`         | 是否支持清空     | `boolean`                                    | `false`        |
| `size`              | 组件尺寸         | `'sm' \| 'md' \| 'lg'`                       | 跟随全局配置   |
| `format`            | 显示与输出格式   | `string`                                     | `'HH:mm:ss'`   |
| `is-range`          | 是否开启范围选择 | `boolean`                                    | `false`        |
| `validate-event`    | 是否触发表单校验 | `boolean`                                    | `true`         |
| `disabled-hours`    | 禁用小时         | `() => number[]`                             | `undefined`    |
| `disabled-minutes`  | 禁用分钟         | `(hour: number) => number[]`                 | `undefined`    |
| `disabled-seconds`  | 禁用秒           | `(hour: number, minute: number) => number[]` | `undefined`    |

### TimePicker Events

| 事件                 | 说明         | 参数                                 |
| -------------------- | ------------ | ------------------------------------ |
| `update:model-value` | 更新时间值   | `string \| [string, string] \| null` |
| `change`             | 确认值变化   | `string \| [string, string] \| null` |
| `clear`              | 清空值       | —                                    |
| `visible-change`     | 面板开关状态 | `boolean`                            |
| `focus`              | 打开面板触发 | —                                    |
| `blur`               | 关闭面板触发 | —                                    |
