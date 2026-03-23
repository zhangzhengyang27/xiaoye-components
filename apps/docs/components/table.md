---
title: Table 表格
description: 后台列表页的数据展示、行交互和插槽扩展。
outline: deep
---

# Table 表格

`xy-table` 用于后台列表页的数据展示。当前版本优先覆盖“读操作 + 行点击 + 加载态 + 空态 + 基础单元格插槽”这条高频路径。

## 基础用法

:::demo 基础表格支持列配置、行点击和基于列 `slot` 的单元格扩展。
table/basic
:::

## 加载态与空态

:::demo 列表页里最常见的不是“渲染一张表”，而是“表格需要跟加载态、空态一起工作”。
table/state
:::

## 何时使用

- 后台列表页、状态总览和数据只读视图。
- 需要根据列配置快速组织表格结构。
- 需要给状态列、操作列补充自定义插槽。

## API

### Table Attributes

| 属性             | 说明                       | 类型                                             | 默认值       |
| ---------------- | -------------------------- | ------------------------------------------------ | ------------ |
| `columns`        | 列配置数组                 | `TableColumn[]`                                  | `[]`         |
| `data`           | 数据源                     | `T[]`                                            | `[]`         |
| `loading`        | 是否显示加载态             | `boolean`                                        | `false`      |
| `striped`        | 是否显示斑马纹             | `boolean`                                        | `false`      |
| `bordered`       | 是否显示边框风格           | `boolean`                                        | `false`      |
| `empty-text`     | 默认空态文案               | `string`                                         | `'暂无数据'` |
| `loading-text`   | 默认加载文案               | `string`                                         | `'Loading...'` |
| `row-key`        | 行唯一标识字段或函数       | `keyof T \| (row, rowIndex) => string \| number` | `undefined`  |
| `row-class-name` | 行 class 或 class 计算函数 | `string \| (row, rowIndex) => string`            | `''`         |
| `clickable`      | 是否开启键盘可聚焦行       | `boolean`                                        | `false`      |

### Table Events

| 事件        | 说明                   | 参数                     |
| ----------- | ---------------------- | ------------------------ |
| `row-click` | 行点击或键盘触发时派发 | `(row, rowIndex, event)` |

### TableColumn

| 字段        | 说明               |
| ----------- | ------------------ |
| `key`       | 列唯一标识         |
| `title`     | 列标题             |
| `dataIndex` | 读取行数据的字段名 |
| `width`     | 列宽               |
| `align`     | 对齐方式           |
| `slot`      | 自定义插槽名后缀   |
| `formatter` | 自定义格式化函数   |
