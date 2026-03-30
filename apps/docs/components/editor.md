---
title: Editor 编辑器
description: 基于 Vditor 的 Markdown 编辑器封装。
outline: deep
---

# Editor 编辑器

`xy-editor` 统一承接 Markdown 编辑、只读切换和内容同步，适合后台知识库、公告、说明文档等输入场景。

## 基础用法

:::demo 通过 `v-model` 直接同步 Markdown 内容。
editor/basic
:::

## 禁用态与配置下发

:::demo `disabled` 可以把编辑器切到只读交互，`options` 则继续承接底层 Vditor 的常用能力配置。
editor/disabled
:::

## 实例方法控制

:::demo 通过 expose 的 `focus / setValue / getValue`，可以把编辑器接进模板填充、草稿恢复和快捷录入流程。
editor/methods
:::

## 公告编辑页

:::demo 这个示例把编辑器放进真实的后台编辑场景里，而不是只展示一个独立输入框。
editor/announcement-workbench
:::

## 与增强层组合

:::demo 在实际后台里，编辑器经常出现在 `OverlayForm` 这类覆盖层编辑链路里，而不是单独占一整页。
editor/overlay-workflow
:::

## 与 OverlayForm 组合

:::demo 富文本或 Markdown 编辑并不总在独立页面中出现，也常作为覆盖层编辑的一部分嵌入 `OverlayForm`。
editor/overlay-form-publisher
:::

## 使用约定

- `xy-editor` 对外统一暴露 Markdown 字符串，不扩展额外数据协议。
- `options` 会透传给 `Vditor`；当 `options`、高度、最小高度或占位文案变化时，组件会重建实例。
- `disabled` 是当前公开的只读入口，适合审批查看、模板回看和系统生成内容复核。
- 外部要主动写入内容时，优先用 `v-model`；需要显式触发焦点或覆盖内容时再使用 expose。

## API

### Editor Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前 Markdown 内容 | `string` | `''` |
| `options` | 透传给 Vditor 的配置项 | `Record<string, unknown>` | `{}` |
| `placeholder` | 占位文案 | `string` | `''` |
| `height` | 编辑器高度 | `string \| number` | `'auto'` |
| `min-height` | 编辑器最小高度 | `string \| number` | `360` |
| `disabled` | 是否禁用编辑 | `boolean` | `false` |

### Editor Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:modelValue` | 内容输入变化时触发 | `(value: string) => void` |
| `init` | 编辑器实例初始化后触发 | `(editor) => void` |
| `ready` | 编辑器实例可用后触发 | `(editor) => void` |
| `focus` | 获取焦点时触发 | `() => void` |
| `blur` | 失焦时触发 | `(value: string) => void` |

### Editor Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `editor` | 当前 Vditor 实例引用 | `Vditor \| null` |
| `getValue` | 获取当前 Markdown 内容 | `() => string` |
| `setValue` | 主动写入 Markdown 内容 | `(value: string, clearStack?: boolean) => void` |
| `focus` | 让编辑器获取焦点 | `() => void` |
