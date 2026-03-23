---
title: DatePicker 日期选择器
description: 中后台筛选栏和表单中的单日期选择组件。
outline: deep
---

# DatePicker 日期选择器

`xy-date-picker` 适合中后台筛选栏和表单中的单日期选择。当前版本只覆盖单日期模式，不提供范围选择。

## 基础用法

:::demo 最常见的用法是绑定一个 `YYYY-MM-DD` 字符串，并允许用户清空选择。
date-picker/basic
:::

## 可选范围限制

:::demo `min` 和 `max` 用来限制可选日期范围，适合筛选栏里只允许选择某个时间窗口的场景。
date-picker/limit
:::

## 表单场景

:::demo DatePicker 放在 `xy-form-item` 内部时，会参与 `change / blur` 校验。
date-picker/form
:::

## 键盘与行为约定

- 触发器支持 `Enter / Space / ArrowDown` 打开面板。
- 面板中支持方向键移动日期，`Enter / Space` 选中，`Escape` 关闭。
- 当前组件只处理单日期值，格式统一为 `YYYY-MM-DD`。

## API

### DatePicker Attributes

| 属性          | 说明                         | 类型                | 默认值         |
| ------------- | ---------------------------- | ------------------- | -------------- |
| `model-value` | 当前日期，格式为 `YYYY-MM-DD` | `string \| null`   | `null`         |
| `placeholder` | 占位文本                     | `string`            | `'请选择日期'` |
| `disabled`    | 是否禁用                     | `boolean`           | `false`        |
| `clearable`   | 是否支持清空                 | `boolean`           | `false`        |
| `size`        | 组件尺寸                     | `'sm' \| 'md' \| 'lg'` | 跟随全局配置 |
| `min`         | 最小可选日期                 | `string`            | `undefined`    |
| `max`         | 最大可选日期                 | `string`            | `undefined`    |

### DatePicker Events

| 事件                 | 说明               | 参数                   |
| -------------------- | ------------------ | ---------------------- |
| `update:model-value` | 更新日期值         | `string \| null`       |
| `change`             | 选中值变化         | `string \| null`       |
| `clear`              | 清空日期           | —                      |
| `visible-change`     | 面板开关状态       | `boolean`              |
| `focus`              | 打开面板时触发     | —                      |
| `blur`               | 关闭面板时触发     | —                      |
