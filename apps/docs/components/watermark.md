---
title: Watermark 水印
description: 用于为容器叠加重复文字或图片水印。
outline: deep
---

# Watermark 水印

`xy-watermark` 用来给任意容器叠加重复的文字或图片水印。它适合试用环境标记、内部资料防扩散、运营后台品牌露出和导出预览面板。

## 推荐阅读路径

如果你是第一次接入 `xy-watermark`，建议按下面这条顺序往下看：

1. 先看基础用法，确认水印如何包裹现有业务容器。
2. 再看多行文本，判断是否需要把环境、团队或业务标识拆成两行表达。
3. 接着看图片水印，确认品牌图形或 Logo 是否更适合当前场景。
4. 然后看控制参数，决定是否需要运行时开关、透明度和自动恢复。
5. 再看渲染事件，确认是否要把水印生成状态接进导出、截图或调试流程。
6. 最后看全屏与目标容器模式，把水印挂到外部宿主或整个页面。

## 基础用法

:::demo 最常见的接法是把一块现有内容区域包在 `xy-watermark` 里，不需要额外改动里面的布局结构。
watermark/basic
:::

## 多行文本

:::demo 当你需要同时表达“系统名 + 环境名”或“团队名 + 保密标记”时，可以把 `content` 传成字符串数组。
watermark/multi-line
:::

## 图片水印

:::demo `image` 的优先级高于文本，适合品牌图形、徽标或固定视觉标识。为了避免拉伸，建议显式传入 `width` 和 `height`，并使用 2x 或 3x 资源。
watermark/image
:::

## 自定义参数

:::demo 通过 `font / gap / offset / rotate / z-index` 可以快速预览不同水印密度和视觉强度，适合灰度环境、试用环境和内部资料页。
watermark/custom
:::

## 控制参数

:::demo `disabled / opacity / repeat / auto-observe` 适合在调试、导出预览或灰度环境里动态调整水印策略。
watermark/control
:::

## 渲染事件与 Expose

:::demo `rendered`、`image-error` 和实例方法适合接入截图、导出、联调面板或运行时诊断。
watermark/events
:::

## 全屏与目标容器

:::demo `target` 可以把水印挂到外部容器，`fullscreen` 则会直接覆盖 `document.body`。两者同时存在时优先使用 `fullscreen`。
watermark/fullscreen-target
:::

## API

### Watermark Attributes

> 未显式传入 `width / height` 时，文本模式会按内容自动测量，图片模式会回落到 `120 / 64`。

| 属性 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| `width` | 水印宽度 | `number` | 文本模式按内容测量，图片模式为 `120` |
| `height` | 水印高度 | `number` | 文本模式按内容测量，图片模式为 `64` |
| `rotate` | 绘制时的旋转角度，单位为 `°` | `number` | `-22` |
| `z-index` | 水印层层级 | `number` | `9` |
| `image` | 图片水印地址，优先级高于 `content` | `string` | — |
| `content` | 文字水印内容，支持单行或多行 | `string \| string[]` | `'Xiaoye Components'` |
| `font` | 文字样式配置 | [`WatermarkFont`](#watermarkfont) | 见下表 |
| `gap` | 水印之间的水平和垂直间距 | `[number, number]` | `[100, 100]` |
| `offset` | 水印距离容器左上角的偏移量，默认取 `gap / 2` | `[number, number]` | `[gap[0] / 2, gap[1] / 2]` |
| `disabled` | 是否禁用水印渲染 | `boolean` | `false` |
| `opacity` | 水印层透明度，内部会限制在 `0 ~ 1` | `number` | `1` |
| `repeat` | 背景重复策略 | `'repeat' \| 'repeat-x' \| 'repeat-y' \| 'no-repeat'` | `'repeat'` |
| `auto-observe` | 是否启用 DOM 观察器做自恢复 | `boolean` | `true` |
| `fullscreen` | 是否把水印直接挂到 `document.body` 上 | `boolean` | `false` |
| `target` | 指定外部宿主容器，支持选择器或 `HTMLElement` | `string \| HTMLElement` | `undefined` |

### WatermarkFont

> `fontSize` 建议优先使用数字或 `px` 字符串；内部数值计算会按 `parseFloat` 处理。

| 属性 | 说明 | 类型 | 默认值 |
| ---- | ---- | ---- | ------ |
| `color` | 字体颜色 | `string` | `'rgba(0,0,0,.15)'` |
| `fontSize` | 字号 | `number \| string` | `16` |
| `fontWeight` | 字重 | `'normal' \| 'bold' \| 'lighter' \| 'bolder' \| number` | `'normal'` |
| `fontFamily` | 字体族 | `string` | `'sans-serif'` |
| `fontGap` | 多行文字的行间距 | `number` | `3` |
| `fontStyle` | 字体样式 | `'none' \| 'normal' \| 'italic' \| 'oblique'` | `'normal'` |
| `textAlign` | 文本对齐方式 | `'left' \| 'right' \| 'center' \| 'start' \| 'end'` | `'center'` |
| `textBaseline` | 文本基线 | `'top' \| 'hanging' \| 'middle' \| 'alphabetic' \| 'ideographic' \| 'bottom'` | `'hanging'` |

### Watermark Slots

| 插槽 | 说明 |
| ---- | ---- |
| `default` | 需要叠加水印的内容容器 |

## 事件

| 事件 | 说明 | 参数 |
| ---- | ---- | ---- |
| `rendered` | 每次成功生成并挂载水印后触发 | `WatermarkRenderPayload` |
| `image-error` | 图片水印加载失败时触发 | `Event` |

## Exposes

| 暴露项 | 说明 | 类型 |
| ---- | ---- | ---- |
| `rerender` | 手动重新生成当前水印 | `() => void` |
| `getDataUrl` | 获取最近一次成功生成的 base64 数据 | `() => string \| null` |
| `getTarget` | 获取当前实际水印宿主元素 | `() => HTMLElement \| null` |
| `removeWatermark` | 手动移除当前水印层，适合验证 `auto-observe` 的恢复行为 | `() => void` |

## 行为约定

- `target` 模式下，`slot` 只是普通内容容器；真正挂载水印的宿主由 `target` 指定。
- `fullscreen` 和 `target` 同时存在时，优先使用 `fullscreen`，水印会直接挂到 `document.body`。
- `auto-observe=false` 时，组件不会在水印层被手动删除或篡改后自动恢复。
- 图片模式加载失败时会先触发 `image-error`，再根据 `content` 是否存在决定回退文本还是清空水印。
