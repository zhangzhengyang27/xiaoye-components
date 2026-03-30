---
title: Avatar 头像
description: 图片、图标或文字头像展示组件。
outline: deep
---

# Avatar 头像

`xy-avatar` 覆盖图片头像、图标头像、文字头像，以及 `xy-avatar-group` 分组折叠展示。

## 基础用法

:::demo 图片、图标和文字头像可以放在同一组场景里混用，适合成员列表、审批流和消息卡片。
avatar/basic
:::

## 尺寸与形状

:::demo `size` 支持预设尺寸和数字尺寸，`shape` 可以在圆形与方形之间切换。
avatar/size-shape
:::

## 图片适配

:::demo `fit` 适合处理横图、竖图和不同比例的裁切方式，常见于用户上传头像和第三方同步头像。
avatar/fit
:::

## 加载失败回退

:::demo 当图片加载失败时，组件会自动回退到 `icon` 或默认插槽，并抛出 `error` 事件。
avatar/fallback
:::

## 头像组

:::demo `xy-avatar-group` 适合团队成员、审批人链路和协作场景。它会透传 `size / shape` 给未显式声明的头像。
avatar/group
:::

## 数据驱动头像组

:::demo 当头像来源于接口数据而不是手写插槽时，可以直接使用 `items` 驱动渲染。
avatar/data-items
:::

## 纵向堆叠

:::demo `direction="vertical"` 适合审批链、轮值人员和时间线旁的头像列表。
avatar/vertical
:::

## Reverse 堆叠

:::demo `reverse` 只改变视觉层叠顺序，不改写传入数据数组。
avatar/reverse
:::

## 折叠头像组

:::demo 开启 `collapse-avatars` 后，多余头像会折叠成 `+N`。配合 `collapse-avatars-tooltip` 可以在悬浮时展开隐藏成员。
avatar/collapse
:::

## 页面协作成员场景

:::demo 更接近真实后台时，AvatarGroup 往往和 `PageContainer`、`Card` 一起使用。
avatar/page-collaboration
:::

## API

### Avatar Attributes

| 属性      | 说明                     | 类型                                                                   | 默认值       |
| --------- | ------------------------ | ---------------------------------------------------------------------- | ------------ |
| `size`    | 头像尺寸                 | `number \| ComponentSize`                                              | 跟随全局配置 |
| `shape`   | 头像形状                 | `'circle' \| 'square'`                                                 | `'circle'`   |
| `icon`    | 图片失败或无图片时的图标 | `string`                                                               | `''`         |
| `src`     | 图片地址                 | `string`                                                               | `''`         |
| `alt`     | 原生图片 `alt`           | `string`                                                               | `''`         |
| `src-set` | 原生图片 `srcset`        | `string`                                                               | `''`         |
| `fit`     | 图片裁切方式             | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'`             | `'cover'`    |

### Avatar Events

| 事件    | 说明               | 参数    |
| ------- | ------------------ | ------- |
| `error` | 图片加载失败时触发 | `Event` |

### Avatar Slots

| 插槽      | 说明                       |
| --------- | -------------------------- |
| `default` | 当无图片且无 `icon` 时展示 |

### AvatarGroup Attributes

| 属性                       | 说明                         | 类型                                     | 默认值   |
| -------------------------- | ---------------------------- | ---------------------------------------- | -------- |
| `size`                     | 分组内头像默认尺寸           | `number \| ComponentSize`                | —        |
| `shape`                    | 分组内头像默认形状           | `'circle' \| 'square'`                   | —        |
| `items`                    | 数据驱动头像项列表           | `AvatarGroupItem[]`                      | `[]`     |
| `direction`                | 堆叠方向                     | `'horizontal' \| 'vertical'`             | `'horizontal'` |
| `gutter`                   | 头像重叠间距，单位 px        | `number`                                 | `8`      |
| `reverse`                  | 是否反转视觉层叠顺序         | `boolean`                                | `false`  |
| `inline`                   | 是否使用 `inline-flex` 布局  | `boolean`                                | `true`   |
| `collapse-avatars`         | 是否折叠多余头像             | `boolean`                                | `false`  |
| `collapse-avatars-tooltip` | 折叠头像是否支持 tooltip 展开 | `boolean`                                | `false`  |
| `max-collapse-avatars`     | 可见头像上限                 | `number`                                 | `1`      |
| `placement`                | 折叠 tooltip 位置            | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'`  |
| `collapse-class`           | 折叠头像自定义类名           | `string`                                 | `''`     |
| `collapse-style`           | 折叠头像自定义样式           | `StyleValue`                             | `''`     |

### AvatarGroupItem

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| `key` | 头像项唯一标识 | `string \| number` |
| `text` | 文字头像内容 | `string` |
| `icon` | 图标头像图标名 | `string` |
| `src` | 图片头像地址 | `string` |
| `alt` | 图片头像替代文本 | `string` |
| `src-set` | 图片头像 `srcset` | `string` |
| `fit` | 图片裁切方式 | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` |
| `size` | 当前头像项尺寸 | `number \| ComponentSize` |
| `shape` | 当前头像项形状 | `'circle' \| 'square'` |
| `className` | 头像项根节点类名 | `string` |
| `style` | 头像项根节点样式 | `StyleValue` |

### AvatarGroup Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `item-click` | 数据驱动模式下点击头像项时触发 | `(item, index) => void` |

### AvatarGroup Slots

| 插槽      | 说明 |
| --------- | ---- |
| `default` | 插槽模式下的头像组内容 |
| `item` | 数据驱动模式下自定义头像项渲染，入参为 `{ item, index }` |
