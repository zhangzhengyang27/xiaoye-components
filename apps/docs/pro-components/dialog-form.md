---
title: DialogForm 弹窗表单
description: 基于 OverlayForm 的弹窗表单 facade。
outline: deep
---

# DialogForm 弹窗表单

`xy-dialog-form` 是 `xy-overlay-form` 的轻包装版本，用来表达“这里明确就是弹窗编辑”的场景。它固定使用 `container="modal"`，但继续复用同一套覆盖层表单内核。

## 基础用法

:::demo 当页面已经明确要用弹窗承接编辑动作时，用 `xy-dialog-form` 会比再手写 `container="modal"` 更直接。
pro/dialog-form/basic
:::

## 当前定位

- 这是 `OverlayForm` 的语义化 facade，不是第二套弹窗表单内核。
- 适合创建成员、修改属性、补充说明这类轻量弹窗编辑场景。
- 当使用方已经确定容器必须是弹窗时，优先使用它。

## 与 OverlayForm 的关系

- `OverlayForm` 继续承担统一覆盖层编辑内核。
- `DialogForm` 只固定容器为弹窗，并保留同一套 `open / mode / model / schema / submit` 协议。
- 如果你的页面需要在抽屉和弹窗之间切换，仍然应直接使用 `OverlayForm`。

## DialogForm API

`DialogFormProps` 继承自 `OverlayFormProps` 的属性（Omit 掉 `container / drawerProps`），下表列出全部可用属性。

### DialogForm Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `open` | 是否打开弹窗，受控模式 | `boolean` | `false` |
| `mode` | 表单模式，影响默认标题和按钮文案 | `'create' / 'edit' / 'view'` | `'create'` |
| `title` | 弹窗标题，缺省时按 mode 生成 | `string` | `''` |
| `model` | 表单数据对象 | `Record<string, unknown>` | `-` |
| `schema` | schema 驱动的字段配置数组 | `ProFieldSchema[]` | `[]` |
| `rules` | 表单校验规则 | `FormRules` | `{}` |
| `label-width` | 表单项 label 宽度 | `string / number` | `'112px'` |
| `label-position` | label 位置 | `'left' / 'top'` | `'top'` |
| `size` | 表单尺寸 | `ComponentSize` | `'md'` |
| `loading` | 是否处于加载中 | `boolean` | `false` |
| `submitting` | 是否提交中 | `boolean` | `false` |
| `readonly` | 是否只读，`mode` 为 `view` 时强制只读 | `boolean` | `false` |
| `submit-text` | 提交按钮文案，缺省时按 mode 生成 | `string` | `''` |
| `cancel-text` | 取消按钮文案，缺省时按 mode 生成 | `string` | `''` |
| `reset-on-close` | 关闭时是否重置表单状态 | `boolean` | `false` |
| `destroy-on-close` | 关闭后是否销毁表单内容 | `boolean` | `false` |
| `dialog-props` | 透传给内部 `xy-dialog` 的配置 | `Omit<Partial<DialogProps>, 'modelValue' / 'title'>` | `{}` |

### DialogForm Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:open` | 弹窗开合状态变化时派发 | `(value: boolean) => void` |
| `submit` | 校验通过后派发，携带模式与 model 快照 | `(payload: OverlayFormSubmitPayload) => void` |
| `cancel` | 点击取消按钮时派发并关闭弹窗 | `(payload: OverlayFormSubmitPayload) => void` |
| `closed` | 弹窗关闭动画结束后派发 | `() => void` |

### DialogForm Slots

| 插槽 | 说明 | 接收参数 |
| --- | --- | --- |
| `default` | 自定义表单项内容，仅在 `schema` 为空时渲染 | `{ model, mode, readonly }` |
| `actions` | 自定义底部动作区按钮 | `{ model, mode, readonly, submitting, submit, cancel, close }` |

其余插槽会原样透传给内部的 `xy-pro-form`（例如 schema 字段的 `[field.slot]` 插槽）。

### DialogForm Exposes

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `validate` | `() => Promise<boolean>` | 触发内部表单校验，返回是否通过 |
| `submit` | `() => Promise<boolean>` | 校验通过后派发 `submit` 事件，返回是否执行成功 |
| `close` | `() => void` | 关闭弹窗 |
