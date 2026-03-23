---
title: InputTag 标签输入框
description: 适合多标签录入、规则编辑和轻量分类维护的标签输入组件。
outline: deep
---

# InputTag 标签输入框

`xy-input-tag` 适合“多个字符串标签”的录入场景，例如关键词、邮箱抄送、规则白名单和分类标签维护。

## 基础用法

:::demo 默认通过 `Enter` 把当前输入提交成一个标签，适合最常见的关键词和标签录入。
input-tag/basic
:::

## 分隔符、清空和上限

:::demo 配合 `delimiter`、`clearable` 和 `max`，可以快速搭出后台常见的批量标签录入条。
input-tag/delimiter
:::

## 拖拽排序

:::demo 开启 `draggable` 后，可直接拖动标签调整顺序，适合关键词权重、规则优先级和展示顺序编辑。
input-tag/draggable
:::

## 表单场景

:::demo 放在 `xy-form-item` 内部时，`xy-input-tag` 会参与 `change / blur` 校验链路。
input-tag/form
:::

## 行为约定

- 默认使用 `Enter` 提交标签，也可切换为 `Space`。
- 输入为空时按 `Backspace` 会删除最后一个标签。
- 开启 `save-on-blur` 后，失焦时会把当前输入自动保存为标签。
- `delimiter` 命中时会自动按分隔符拆分多个标签。
- 开启 `draggable` 后，可直接拖动标签调整顺序。

## API

### InputTag Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前标签列表 | `string[] \| undefined` | `undefined` |
| `max` | 最大标签数量 | `number` | `undefined` |
| `trigger` | 提交标签的触发键 | `'Enter' \| 'Space'` | `'Enter'` |
| `draggable` | 是否启用拖拽排序 | `boolean` | `false` |
| `delimiter` | 自动拆分标签的分隔符 | `string \| RegExp` | `''` |
| `size` | 组件尺寸 | `ComponentSize` | 跟随全局配置 |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `readonly` | 是否只读 | `boolean` | `false` |
| `clearable` | 是否显示清空按钮 | `boolean` | `false` |
| `clear-icon` | 自定义清空图标 | `string` | `'mdi:close-circle'` |
| `validate-event` | 是否触发表单校验 | `boolean` | `true` |
| `autofocus` | 原生 autofocus | `boolean` | `false` |
| `id` | 原生 id | `string` | `undefined` |
| `tabindex` | 原生 tabindex | `string \| number` | `0` |
| `maxlength` | 原生 maxlength | `string \| number` | `undefined` |
| `minlength` | 原生 minlength | `string \| number` | `undefined` |
| `placeholder` | 占位文本 | `string` | `''` |
| `autocomplete` | 原生 autocomplete | `string` | `'off'` |
| `save-on-blur` | 失焦时是否保存当前输入 | `boolean` | `true` |
| `aria-label` | 原生 aria-label | `string` | `undefined` |
| `name` | 原生 name | `string` | `undefined` |
| `tag-status` | 标签状态色 | `ComponentStatus` | `'neutral'` |
| `tag-round` | 标签是否使用圆角样式 | `boolean` | `false` |
| `inputmode` | 原生 inputmode | `HTMLAttributes['inputmode']` | `undefined` |
| `input-style` | 原生输入框样式 | `StyleValue` | `undefined` |

### InputTag Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:model-value` | 标签列表变化时触发 | `string[] \| undefined` |
| `change` | 标签列表确认变化时触发 | `string[] \| undefined` |
| `input` | 输入框内容变化时触发 | `string` |
| `add-tag` | 新增标签时触发 | `string \| string[]` |
| `remove-tag` | 删除标签时触发 | `(value: string, index: number)` |
| `drag-tag` | 拖拽排序完成时触发 | `(oldIndex: number, newIndex: number, value: string)` |
| `focus` | 获得焦点时触发 | `FocusEvent` |
| `blur` | 失去焦点时触发 | `FocusEvent` |
| `clear` | 清空全部标签时触发 | — |

### InputTag Slots

| 插槽 | 说明 |
| --- | --- |
| `prefix` | 输入框前缀内容 |
| `suffix` | 输入框后缀内容 |
| `tag` | 自定义标签内容，接收 `{ value, index }` |

### InputTag Exposes

| 暴露项 | 说明 | 类型 |
| --- | --- | --- |
| `input` | 原生输入框引用 | `ShallowRef<HTMLInputElement \| null>` |
| `focus` | 聚焦输入框 | `() => void` |
| `blur` | 让输入框失焦 | `() => void` |
| `clear` | 清空全部标签 | `() => Promise<void>` |
