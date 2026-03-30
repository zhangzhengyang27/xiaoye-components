---
title: Image 图片
description: 用于承载图片展示、懒加载和大图预览。
outline: deep
---

# Image 图片

`xy-image` 覆盖图片展示、占位态、失败态、懒加载和大图预览这几条常见链路。它适合封面图、截图回显、详情页大图查看和列表缩略图场景。

## 推荐阅读路径

如果你是第一次接入 `xy-image`，建议按下面这条顺序往下看，这样会更容易建立完整心智：

1. 先看基础用法，确认“图片如何挂进页面容器”。
2. 再看图片适配，判断你的业务图是更适合 `cover` 还是 `contain`。
3. 接着看懒加载与占位，把长列表和滚动容器场景一起补齐。
4. 然后看默认预览，把“点击缩略图进入大图查看”这条链路接起来。
5. 最后看自定义预览工具栏，决定是否需要把预览层升级成更完整的业务操作台。

## 基础用法

:::demo 第一步先把图片稳定放进页面容器里。大多数封面卡片、详情头图和内容插图，到这里就已经够用了。
image/basic
:::

## 图片适配

:::demo 第二步再处理裁切策略。`fit` 对应原生 `object-fit`，适合判断封面、截图和素材图在不同容器里的最佳呈现方式。
image/fit
:::

## 懒加载与占位

:::demo 第三步补齐加载体验。`lazy` 适合长列表图片流，`placeholder` 和 `error` 插槽适合把加载态和失败态一起纳入页面设计。
image/lazy
:::

## 大图预览

:::demo 第四步把查看链路接起来。配置 `preview-src-list` 后，点击图片即可进入预览层，适合详情页大图、文档截图和素材浏览。
image/preview
:::

## 自定义预览工具栏

:::demo 最后再决定是否需要升级成业务操作台。如果默认预览还不够，可以通过 `progress / toolbar / viewer-error` 插槽接管进度、工具栏和预览失败态。
image/preview-toolbar
:::

## API

### Image Attributes

| 属性 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| `src` | 图片地址 | `string` | `''` |
| `alt` | 原生图片 `alt` 文案 | `string` | `''` |
| `fit` | 图片裁切方式 | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'` |
| `loading` | 原生图片加载策略 | `'eager' \| 'lazy'` | `undefined` |
| `lazy` | 是否启用基于 `IntersectionObserver` 的懒加载 | `boolean` | `false` |
| `scroll-container` | 懒加载监听容器，支持选择器或 HTMLElement | `string \| HTMLElement` | `undefined` |
| `preview-src-list` | 预览图片列表 | `string[]` | `[]` |
| `preview-teleported` | 预览层是否 Teleport 到 `body` | `boolean` | `false` |
| `z-index` | 预览层层级 | `number` | `undefined` |
| `initial-index` | 预览初始索引 | `number` | `0` |
| `infinite` | 预览翻页是否循环 | `boolean` | `true` |
| `hide-on-click-modal` | 点击遮罩是否关闭预览 | `boolean` | `false` |
| `close-on-press-escape` | 按下 `Escape` 是否关闭预览 | `boolean` | `true` |
| `zoom-rate` | 预览层每次缩放的倍率 | `number` | `1.2` |
| `scale` | 预览层初始缩放比例 | `number` | `1` |
| `min-scale` | 预览层最小缩放比例 | `number` | `0.2` |
| `max-scale` | 预览层最大缩放比例 | `number` | `7` |
| `show-progress` | 是否显示预览进度 | `boolean` | `false` |
| `crossorigin` | 原生图片 `crossorigin` 属性 | `'' \| 'anonymous' \| 'use-credentials'` | `''` |

### Image Events

| 事件 | 说明 | 参数 |
| ---- | ---- | ---- |
| `load` | 图片加载成功时触发 | `Event` |
| `error` | 图片加载失败时触发 | `Event` |
| `show` | 打开预览层时触发 | — |
| `close` | 关闭预览层时触发 | — |
| `switch` | 预览图片切换时触发 | `number` |

### Image Slots

| 插槽 | 说明 |
| ---- | ---- |
| `placeholder` | 自定义加载占位内容 |
| `error` | 自定义加载失败内容 |
| `progress` | 自定义预览进度内容，接收 `{ activeIndex, total }` |
| `toolbar` | 自定义预览工具栏，接收 `{ actions, prev, next, reset, activeIndex, setActiveItem }` |
| `viewer-error` | 自定义预览大图失败内容，接收 `{ activeIndex, src, retry }` |

### Image Exposes

| 暴露项 | 说明 | 类型 |
| ---- | ---- | ---- |
| `showPreview` | 手动打开预览层 | `() => void` |
| `closePreview` | 手动关闭预览层 | `() => void` |

## 预览交互约定

- `ArrowLeft / ArrowRight`：切换上一张、下一张。
- `ArrowUp / ArrowDown`：放大、缩小当前图片。
- `Space`：在适应窗口和原始尺寸之间切换。
- 鼠标滚轮：在预览层内快速缩放。
- 双击图片：在快速放大和重置视图之间切换。
- 放大后或切到原始尺寸模式后，可以直接拖拽图片进行平移；触摸设备支持单指拖动。
- 预览大图加载失败时，默认会显示“重新加载”入口；自定义 `viewer-error` 插槽时也可以调用 `retry()` 手动重试。
- 预览层会补充 `dialog`、`status`、`alert`、`aria-busy` 等可访问性语义，便于屏幕阅读器感知当前进度、加载态和错误态。
- 当前图片还在加载或已经失败时，底部工具栏会自动收起，避免出现不可用的缩放、旋转和重置动作。
