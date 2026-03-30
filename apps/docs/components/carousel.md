---
title: Carousel 走马灯
description: 自动播放、指示器和卡片模式的内容轮播组件。
outline: deep
---

# Carousel 走马灯

`xy-carousel` 提供更适合中后台编排的受控、拖拽、自适应高度和内容流布局能力。适合首页焦点位、图文轮播、活动推荐和运营位展示。

## 基础用法

:::demo 最常见的场景是横向焦点图，自动轮播配合指示器展示当前页。
carousel/basic
:::

## 无缝循环边界

:::demo 普通单页 `slide` 循环会把首尾切换收成更连续的轨道，边界点击会排队执行，自动播放进度也会在边界过渡完成后再重置。
carousel/seamless-loop
:::

## 指示器与箭头

:::demo 可以调整箭头显示时机和指示器位置，适合不同密度的轮播位。
carousel/controls
:::

## 受控模式

:::demo 通过 `activeIndex + update:activeIndex` 把轮播接进外部状态管理或路由编排。
carousel/controlled
:::

## 自适应高度

:::demo `height='auto'` 适合不同内容高度的图文卡片和公告流。
carousel/auto-height
:::

## 拖拽切换

:::demo 默认支持鼠标和触摸拖拽切换，适合更自然的运营位浏览体验。
carousel/draggable
:::

## 垂直方向

:::demo 纵向走马灯适合公告流、更新日志和步骤式提示。
carousel/vertical
:::

## 卡片模式

:::demo `type="card"` 适合推荐位和内容流预览，支持点击左右卡片切换。
carousel/card
:::

## 内容流布局

:::demo `slidesPerView / slidesPerGroup / gap / centered` 适合露出下一张和多卡并列的内容流轮播。
carousel/flow
:::

## Fade 动画

:::demo `effect='fade'` 适合 Hero Banner 和强视觉海报切换。
carousel/fade
:::

## 缩略图联动

:::demo `thumbs` 适合图库详情、商品图和媒体预览场景。
carousel/thumbs
:::

## 自动播放进度条

:::demo `show-progress` 可以让用户感知自动播放节奏。
carousel/progress
:::

## 自定义控制区

:::demo 通过 `indicator / arrow-prev / arrow-next / progress` 插槽，可以把控制区改成更贴业务的样式。
carousel/custom-controls
:::

## 单项播放节奏

:::demo `CarouselItem.duration` 和 `autoplayDisabled` 适合运营位混排场景。
carousel/per-item-duration
:::

## Lazy 渲染

:::demo `lazy` 适合内容较重、图片较多，但总量还不算特别大的轮播序列。
carousel/lazy
:::

## Virtual 窗口化

:::demo `virtual` 适合数量更多的轮播序列，只保留当前窗口附近内容。
carousel/virtual
:::

## 图库场景

:::demo 主轮播 + 缩略图条是图库和商品图详情页最常见的轮播形态。
carousel/gallery
:::

## 方法控制

:::demo 通过 expose 的 `prev / next / setActiveItem / activeIndex`，可以把走马灯接进更复杂的运营编排流程。
carousel/methods
:::

## 使用提示

- `effect='fade'` 只在普通单页模式下生效；当 `type='card'`、`slides-per-view > 1` 或 `centered` 开启时，会自动回退为普通滑动。
- `type='card'` 是独立模式，不与 `slides-per-view / slides-per-group / gap / centered` 这类内容流布局能力混用。
- 普通单页 `slide` 且 `loop=true` 时，首尾切换会进入无缝边界轨道；边界过渡中的再次点击会排队到当前过渡结束后再执行。
- `height='auto'` 配合 `virtual` 且一屏展示多项时，会退回按当前激活项测量高度，避免窗口化场景的高度抖动。
- 自动播放除了受 `pause-on-hover` 控制外，在焦点进入轮播区和拖拽过程中也会暂停，交互结束后再恢复计时。
- 开启 `show-progress` 时，自动播放在无缝边界过渡期间会保留进度，等边界过渡完成后再开始下一轮计时。
- 开启 `keyboard` 后，横向支持 `Left / Right`，纵向支持 `Up / Down`，同时支持 `Home / End` 快速跳到首尾。

## API

### Carousel Attributes

| 属性                  | 说明                 | 类型                                                      | 默认值        |
| --------------------- | -------------------- | --------------------------------------------------------- | ------------- |
| `initial-index`       | 初始激活项索引       | `number`                                                  | `0`           |
| `active-index`        | 当前激活项索引（受控） | `number`                                                | —             |
| `height`              | 走马灯高度           | `string`                                                  | `''`          |
| `trigger`             | 指示器触发方式       | `'hover' \| 'click'`                                      | `'hover'`     |
| `autoplay`            | 是否自动播放         | `boolean`                                                 | `true`        |
| `interval`            | 自动播放间隔         | `number`                                                  | `3000`        |
| `indicator-position`  | 指示器位置           | `'' \| 'none' \| 'outside'`                               | `''`          |
| `arrow`               | 箭头显示时机         | `'always' \| 'hover' \| 'never'`                          | `'hover'`     |
| `type`                | 走马灯类型           | `'' \| 'card'`                                            | `''`          |
| `card-scale`          | 卡片模式缩放比例     | `number`                                                  | `0.83`        |
| `loop`                | 是否循环显示         | `boolean`                                                 | `true`        |
| `direction`           | 展示方向             | `'horizontal' \| 'vertical'`                              | `'horizontal'` |
| `pause-on-hover`      | 鼠标移入时是否暂停   | `boolean`                                                 | `true`        |
| `draggable`           | 是否支持拖拽切换     | `boolean`                                                 | `true`        |
| `effect`              | 动画效果             | `'slide' \| 'fade'`                                       | `'slide'`     |
| `duration`            | 动画时长             | `number`                                                  | `400`         |
| `easing`              | 动画缓动函数         | `string`                                                  | `cubic-bezier(0.22, 0.61, 0.36, 1)` |
| `slides-per-view`     | 可视 slide 数量      | `number`                                                  | `1`           |
| `slides-per-group`    | 每次翻页数量         | `number`                                                  | `1`           |
| `gap`                 | slide 间距           | `number \| string`                                        | `0`           |
| `centered`            | 是否居中当前页       | `boolean`                                                 | `false`       |
| `indicator-type`      | 指示器样式           | `'line' \| 'dot'`                                         | `line`        |
| `thumbs`              | 是否显示缩略图条     | `boolean`                                                 | `false`       |
| `thumbs-placement`    | 缩略图条位置         | `'bottom' \| 'top' \| 'left' \| 'right'`                 | `'bottom'`    |
| `thumbs-per-view`     | 缩略图条每屏可见数量 | `number`                                                  | `5`           |
| `thumbs-gap`          | 缩略图间距           | `number \| string`                                        | `8`           |
| `thumbs-indicator-type` | 缩略图样式         | `'thumbnail' \| 'line' \| 'dot'`                          | `'thumbnail'` |
| `show-progress`       | 是否显示自动播放进度 | `boolean`                                                 | `false`       |
| `progress-placement`  | 进度条位置           | `'bottom' \| 'top' \| 'indicator'`                        | `'bottom'`    |
| `progress-color`      | 进度条颜色           | `string`                                                  | `''`          |
| `align`               | 内容流对齐方式       | `'start' \| 'center' \| 'end'`                            | `'start'`     |
| `contain-scroll`      | 内容流边界策略       | `'trim' \| 'keep'`                                        | `'trim'`      |
| `peek`                | 露出边缘尺寸         | `number \| string`                                        | `0`           |
| `lazy`                | 是否启用邻近懒渲染   | `boolean`                                                 | `false`       |
| `lazy-range`          | 邻近懒渲染范围       | `number`                                                  | `1`           |
| `virtual`             | 是否启用窗口化渲染   | `boolean`                                                 | `false`       |
| `virtual-buffer`      | 窗口化缓冲范围       | `number`                                                  | `1`           |
| `aria-label`          | 无障碍标签           | `string`                                                  | `''`          |
| `keyboard`            | 是否启用键盘切换     | `boolean`                                                 | `true`        |

### Carousel Events

| 事件     | 说明             | 参数                         |
| -------- | ---------------- | ---------------------------- |
| `update:activeIndex` | 受控模式下当前页变更 | `(value: number)` |
| `change` | 当前激活项切换时触发 | `(current: number, previous: number)` |

### Carousel Exposes

| 暴露项         | 说明                   | 类型                                 |
| -------------- | ---------------------- | ------------------------------------ |
| `activeIndex`  | 当前激活项索引         | `Ref<number>`                        |
| `setActiveItem`| 手动切换到指定项       | `(index: number \| string) => void` |
| `prev`         | 切换到上一项           | `() => void`                         |
| `next`         | 切换到下一项           | `() => void`                         |

### CarouselItem Attributes

| 属性    | 说明                     | 类型                | 默认值 |
| ------- | ------------------------ | ------------------- | ------ |
| `name`  | 项目名称，可用于 `setActiveItem` | `string`      | `''`   |
| `label` | 指示器文案               | `string \| number`  | `''`   |
| `duration` | 单项自动播放时长（毫秒），可覆盖全局 `interval` | `number` | — |
| `autoplay-disabled` | 是否跳过自动播放序列，手动切换仍可进入 | `boolean` | `false` |

### Carousel Slots

| 插槽         | 说明 |
| ------------ | ---- |
| `default`    | 轮播项列表，通常传入 `xy-carousel-item` |
| `indicator`  | 自定义指示器，接收 `{ index, active, total }` |
| `arrow-prev` | 自定义上一页箭头 |
| `arrow-next` | 自定义下一页箭头 |
| `progress`   | 自定义进度条，接收 `{ percent, activeIndex }` |
| `thumb`      | 自定义缩略图项，接收 `{ index, active, total, item }` |
