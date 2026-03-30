---
title: VideoPlayer 视频播放器
description: 基于 video.js 的视频播放封装。
outline: deep
---

# VideoPlayer 视频播放器

`xy-video-player` 统一承接视频预览、回放和培训内容播放。

## 基础用法

:::demo 适合后台审核、录播回放和媒体详情页。
video-player/basic
:::

## 封面、尺寸与播放器配置

:::demo `poster`、尺寸和 `options` 适合审核页、详情页和带品牌皮肤的媒体展示。
video-player/poster
:::

## 外部切换片源

:::demo 通过响应式 `sources` 和 expose 的 `load`，可以把播放器接进回放列表或多清晰度切换场景。
video-player/sources
:::

## 审核工作台

:::demo 这个示例更接近后台审核台或录播回放页的真实布局：主播放器在左，审核信息和切片导航在右。
video-player/audit-workbench
:::

## 与增强层组合

:::demo 在详情页中，VideoPlayer 往往不是单独存在，而是作为 `DetailPage` 某个 section 的媒体预览区出现。
video-player/detail-page-media
:::

## 与 DetailPage 组合

:::demo 当视频预览进入正式详情页时，通常由 `DetailPage` 负责头部、变更记录和日志，`VideoPlayer` 负责媒体预览本身。
video-player/detail-page-audit
:::

## 使用约定

- 组件统一基于 `video.js`，对外只保留一个播放器入口。
- `sources` 是当前唯一公开的片源协议；切换清晰度或视频时由外部更新 `sources`。
- `options` 透传给 `video.js` 初始化参数，适合开启特定控制条或自定义行为。
- 如果只想更新片源而不改其他参数，可以优先通过 expose 的 `load` 主动加载。

## API

### VideoPlayerSource

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `src` | 视频地址 | `string` |
| `type` | 视频 MIME 类型 | `string` |

### VideoPlayer Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `sources` | 视频源列表 | `VideoPlayerSource[]` | `[]` |
| `poster` | 封面图地址 | `string` | `''` |
| `autoplay` | 是否自动播放 | `boolean` | `false` |
| `controls` | 是否显示控制条 | `boolean` | `true` |
| `loop` | 是否循环播放 | `boolean` | `false` |
| `muted` | 是否静音 | `boolean` | `false` |
| `preload` | 预加载策略 | `'auto' \| 'metadata' \| 'none'` | `'metadata'` |
| `width` | 容器宽度 | `string \| number` | `'100%'` |
| `height` | 容器高度 | `string \| number` | `360` |
| `options` | 透传给 `video.js` 的配置项 | `Record<string, unknown>` | `{}` |

### VideoPlayer Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `init` | 播放器实例初始化后触发 | `(player) => void` |
| `ready` | 播放器实例可用后触发 | `(player) => void` |
| `play` | 开始播放时触发 | `() => void` |
| `pause` | 暂停播放时触发 | `() => void` |
| `ended` | 播放结束时触发 | `() => void` |

### VideoPlayer Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `player` | 当前 `video.js` 实例引用 | `unknown` |
| `play` | 开始播放 | `() => Promise<void> \| void` |
| `pause` | 暂停播放 | `() => void` |
| `load` | 加载指定片源列表 | `(sources?: VideoPlayerSource[]) => void` |
