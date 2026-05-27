---
title: Empty 空状态
description: 用于承接空数据、空搜索结果和首次进入时暂无内容的页面状态。
outline: deep
---

# Empty 空状态

`xy-empty` 用来承接列表为空、筛选无结果和首次进入时暂无内容的页面状态。它关注的是“信息兜底 + 下一步动作”这条链路。

## 基础用法

:::demo 最基础的空状态可以直接使用内置标题、描述和插画，适合先把页面空态快速补齐。
empty/basic
:::

## 隐藏描述区

:::demo 显式传入空字符串时不会再回退默认文案，而是直接隐藏对应区域。这个模式适合只保留标题或只保留自定义操作入口。
empty/without-description
:::

## 自定义插画与文案区域

:::demo 当默认插画不够贴合业务语义时，可以通过 `image`、`image-alt`、`image-size` 或命名插槽把空态替换成更明确的引导内容。
empty/custom-media
:::

## 全局文案回退

当没有显式传入 `title` 或 `description` 时，`xy-empty` 会优先读取 `xy-config-provider` 的 `locale.emptyTitle` 和 `locale.emptyDescription`，否则回退到内置默认文案。显式传入空字符串时，对应区域会被隐藏。

## 何时使用

- 列表页当前没有任何数据。
- 筛选条件过严，结果集为空。
- 首次进入某个模块，需要引导用户完成第一步操作。

## API

### Empty Attributes

| 属性          | 说明 | 类型 | 默认值 |
| ------------- | ---- | ---- | ------ |
| `title`       | 标题文案；未传时回退到 `locale.emptyTitle` 或 `'暂无数据'`，显式传 `''` 时隐藏标题区 | `string` | `undefined` |
| `description` | 描述文案；未传时回退到 `locale.emptyDescription` 或 `'这里还没有可展示的内容'`，显式传 `''` 时隐藏描述区 | `string` | `undefined` |
| `image`       | 自定义图片地址 | `string` | `''` |
| `image-alt`   | 自定义图片的 `alt` 文案 | `string` | `''` |
| `image-size`  | 图片区域宽度；优先级高于 `--xy-empty-image-width` | `string \| number` | `''` |

### Empty CSS Variables

| 变量名 | 说明 | 默认值 |
| ------ | ---- | ------ |
| `--xy-empty-padding` | 空态容器内边距 | `32px 16px` |
| `--xy-empty-gap` | 插画、文案之间的垂直间距 | `var(--xy-space-2)` |
| `--xy-empty-image-width` | 默认图片区域宽度 | `160px` |
| `--xy-empty-title-color` | 标题颜色 | `var(--xy-text-color)` |
| `--xy-empty-description-color` | 描述颜色 | `var(--xy-text-color-secondary)` |
| `--xy-empty-footer-margin-top` | 底部操作区上边距 | `var(--xy-space-2)` |

### Empty Slots

| 插槽          | 说明                 |
| ------------- | -------------------- |
| `image`       | 自定义图片或插画区域 |
| `title`       | 自定义标题内容       |
| `description` | 自定义描述内容       |
| `default`     | 底部操作区或补充说明 |
