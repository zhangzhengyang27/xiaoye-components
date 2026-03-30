---
title: AudioPlayer 音频播放器
description: 基于 Howler 的音频播放封装。
outline: deep
---

# AudioPlayer 音频播放器

`xy-audio-player` 用来承接语音播报、录音回放和轻量音频内容展示。

## 基础用法

:::demo 适合在详情页、工单面板和消息回放区内直接展示音频内容。
audio-player/basic
:::

## 带元信息的音频卡片

:::demo `track` 可以统一承接封面、标题、作者和音源，适合消息回放和媒体详情卡片。
audio-player/track
:::

## 外部控制与切换音源

:::demo 通过 expose 和响应式 `track`，可以把播放器接进播放列表、录音切换和外部音量控制场景。
audio-player/controlled
:::

## 质检回放台

:::demo 这个场景更接近后台语音质检、客服录音回放和回访记录核对的真实布局。
audio-player/review-workbench
:::

## 与增强层组合

:::demo 在详情链路里，更常见的接法是把 AudioPlayer 放进 `DetailPage` 的某个业务 section 中承接回放。
audio-player/detail-page-media
:::

## 与 DetailPage 组合

:::demo 当录音回放进入正式详情页时，通常由 `DetailPage` 承接摘要、附件和日志，`AudioPlayer` 负责播放区。
audio-player/detail-page-review
:::

## 使用约定

- `src` 适合单个音源；需要同时带标题、作者、封面时优先使用 `track`。
- 当前组件不内置播放列表，只承接单条音轨播放；列表切换由外部更换 `track` 或 `src`。
- `volume` 使用 `0 ~ 1` 的浮点值；`playbackRates` 用来定义右上角倍速切换序列。
- 需要与外部页面状态联动时，优先监听 `play / pause / end / time-update / update:volume`。

## API

### AudioPlayerTrack

| 字段 | 说明 | 类型 |
| --- | --- | --- |
| `src` | 音频源地址，支持单个或多个候选源 | `string \| string[]` |
| `title` | 音频标题 | `string` |
| `artist` | 作者或播报来源 | `string` |
| `cover` | 封面图地址 | `string` |

### AudioPlayer Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `src` | 音频源地址 | `string \| string[]` | — |
| `track` | 带元信息的音轨对象，优先级高于 `src / title / artist` | `AudioPlayerTrack` | — |
| `title` | 音频标题 | `string` | `''` |
| `artist` | 作者或来源说明 | `string` | `''` |
| `autoplay` | 是否自动播放 | `boolean` | `false` |
| `loop` | 是否循环播放 | `boolean` | `false` |
| `muted` | 是否静音 | `boolean` | `false` |
| `volume` | 当前音量，范围 `0 ~ 1` | `number` | `1` |
| `playback-rates` | 倍速切换序列 | `number[]` | `[0.75, 1, 1.25, 1.5, 2]` |

### AudioPlayer Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `init` | 音频实例初始化后触发 | `(howl) => void` |
| `ready` | 音频加载完成后触发 | `(howl) => void` |
| `play` | 开始播放时触发 | `() => void` |
| `pause` | 暂停播放时触发 | `() => void` |
| `end` | 播放结束时触发 | `() => void` |
| `update:volume` | 内部音量变化时触发 | `(value: number) => void` |
| `time-update` | 播放进度更新时触发 | `(currentTime: number, duration: number) => void` |

### AudioPlayer Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `howl` | 当前 Howler 实例引用 | `Howl \| null` |
| `play` | 开始播放 | `() => void` |
| `pause` | 暂停播放 | `() => void` |
| `stop` | 停止播放并回到起点 | `() => void` |
| `seek` | 跳转到指定秒数 | `(seconds: number) => void` |
| `setVolume` | 设置音量 | `(value: number) => void` |
