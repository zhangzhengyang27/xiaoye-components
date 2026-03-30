---
title: Descriptions 描述列表
description: 用于详情页、审核页和只读信息块的描述列表组件。
outline: deep
---

# Descriptions 描述列表

`xy-descriptions` 适合详情页、审核页和信息回显区。它的定位是“只读字段编排”，不是表单或表格的替代品。

## 基础用法

:::demo 通过 `xy-descriptions-item` 声明条目，适合快速组织一组稳定的只读字段。
descriptions/basic
:::

## 边框和多列

:::demo 开启 `border` 并指定 `column` 后，可以更接近后台详情页常见的资料卡布局。
descriptions/bordered
:::

## 垂直布局与跨度

:::demo `direction="vertical"` 适合内容较长的说明字段，`span` 可以让重点项横跨多列。
descriptions/vertical
:::

## API

### Descriptions Attributes

| 属性          | 说明         | 类型                         | 默认值         |
| ------------- | ------------ | ---------------------------- | -------------- |
| `column`      | 列数         | `number`                     | `3`            |
| `border`      | 是否展示边框 | `boolean`                    | `false`        |
| `size`        | 组件尺寸     | `'sm' \| 'md' \| 'lg'`       | 跟随全局配置   |
| `title`       | 标题文案     | `string`                     | `''`           |
| `extra`       | 额外说明     | `string`                     | `''`           |
| `label-width` | 标签宽度     | `string \| number`           | `undefined`    |
| `direction`   | 布局方向     | `'horizontal' \| 'vertical'` | `'horizontal'` |

### Descriptions Slots

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 条目内容     |
| `title`   | 自定义标题区 |
| `extra`   | 自定义额外区 |

### DescriptionsItem Attributes

| 属性    | 说明     | 类型     | 默认值 |
| ------- | -------- | -------- | ------ |
| `label` | 标签文案 | `string` | `''`   |
| `span`  | 占据列数 | `number` | `1`    |

### DescriptionsItem Slots

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 内容区       |
| `label`   | 自定义标签区 |
