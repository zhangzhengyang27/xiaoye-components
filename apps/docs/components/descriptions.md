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

## 数据驱动与折叠

:::demo 当详情字段来自接口 schema 时，可以直接使用 `items` 渲染，并配合 `collapse` 收起内容区。
descriptions/data-driven
:::

## 数据驱动写法

:::demo 当详情字段来自接口 schema 或后台配置时，可以直接通过 `items` 数组声明，减少模板样板代码。
descriptions/items
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
| `collapse`    | 是否默认收起并显示折叠切换 | `boolean` | `false` |
| `items`       | 数据驱动条目数组 | `DescriptionsDataItem[]` | `[]` |
| `items`       | 数据驱动条目数组 | `DescriptionsDataItem[]`   | `[]`           |

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

### DescriptionsDataItem Attributes

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| `label` | 条目标签 | `string` |
| `value` | 条目值 | `string \| number` |
| `icon` | 标签前图标 | `string` |
| `tag` | 标签态渲染配置 | `string \| { text: string; props?: TagProps }` |
| `link` | 链接态渲染配置 | `LinkProps` |
| `class-name` | 条目根类名 | `string` |
| `label-class-name` | 标签区类名 | `string` |
| `content-class-name` | 内容区类名 | `string` |

### DescriptionsItem Slots

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 内容区       |
| `label`   | 自定义标签区 |
