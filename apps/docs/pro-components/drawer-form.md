---
title: DrawerForm 抽屉表单
description: 基于 OverlayForm 的抽屉表单 facade。
outline: deep
---

# DrawerForm 抽屉表单

`xy-drawer-form` 是 `xy-overlay-form` 的轻包装版本，用来表达“这里明确就是抽屉编辑”的场景。它固定使用 `container="drawer"`，但继续复用同一套覆盖层表单内核。

## 基础用法

:::demo 当列表页需要保留上下文、在右侧展开编辑抽屉时，`xy-drawer-form` 会比手写 `container="drawer"` 更贴近业务心智。
pro/drawer-form/basic
:::

## 当前定位

- 这是 `OverlayForm` 的语义化 facade，不是第二套抽屉表单内核。
- 适合列表页快速编辑、详情侧滑修改和保留页面上下文的录入场景。
- 当使用方已经确定容器必须是抽屉时，优先使用它。

## 与 OverlayForm 的关系

- `OverlayForm` 继续承担统一覆盖层编辑内核。
- `DrawerForm` 只固定容器为抽屉，并保留同一套 `open / mode / model / schema / submit` 协议。
- 如果你的页面需要在抽屉和弹窗之间切换，仍然应直接使用 `OverlayForm`。

## DrawerForm API

`DrawerFormProps` 继承自 `OverlayFormProps` 的属性（Omit 掉 `container / dialogProps`），下表列出全部可用属性。

### DrawerForm Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `open` | 是否打开抽屉，受控模式 | `boolean` | `false` |
| `mode` | 表单模式，影响默认标题和按钮文案 | `'create' / 'edit' / 'view'` | `'create'` |
| `title` | 抽屉标题，缺省时按 mode 生成 | `string` | `''` |
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
| `drawer-props` | 透传给内部 `xy-drawer` 的配置 | `Omit<Partial<DrawerProps>, 'modelValue' / 'title'>` | `{}` |

### DrawerForm Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:open` | 抽屉开合状态变化时派发 | `(value: boolean) => void` |
| `submit` | 校验通过后派发，携带模式与 model 快照 | `(payload: OverlayFormSubmitPayload) => void` |
| `cancel` | 点击取消按钮时派发并关闭抽屉 | `(payload: OverlayFormSubmitPayload) => void` |
| `closed` | 抽屉关闭动画结束后派发 | `() => void` |

### DrawerForm Slots

| 插槽 | 说明 | 接收参数 |
| --- | --- | --- |
| `default` | 自定义表单项内容，仅在 `schema` 为空时渲染 | `{ model, mode, readonly }` |
| `actions` | 自定义底部动作区按钮 | `{ model, mode, readonly, submitting, submit, cancel, close }` |

其余插槽会原样透传给内部的 `xy-pro-form`（例如 schema 字段的 `[field.slot]` 插槽）。

### DrawerForm Exposes

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `validate` | `() => Promise<boolean>` | 触发内部表单校验，返回是否通过 |
| `submit` | `() => Promise<boolean>` | 校验通过后派发 `submit` 事件，返回是否执行成功 |
| `close` | `() => void` | 关闭抽屉 |
