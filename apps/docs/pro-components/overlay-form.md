---
title: OverlayForm 覆盖层表单
description: 统一抽屉与弹窗表单的覆盖层编辑模型。
outline: deep
---

# OverlayForm 覆盖层表单

`xy-overlay-form` 用来统一表达“在当前页面上下文中打开一个覆盖层表单”的能力，通过 `container="drawer" | "modal"` 收口抽屉与弹窗两种编辑容器。

## 覆盖层编辑场景

:::demo 这个场景把“列表内快速编辑”和“轻量属性修改”统一放到同一套覆盖层表单心智里。
pro/overlay-form/placements
:::

## 当前定位

- 统一表达覆盖层编辑，不再要求使用方先区分“抽屉表单”还是“弹窗表单”。
- 适合后台列表页中的创建、编辑、补充说明、轻量审批等链路。
- 在收口后的公开体系里，它应是 `CrudPage`、`ListPage` 和详情链路的上游编辑容器。

## OverlayForm API

### OverlayForm Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `open` | 是否打开 | `boolean` | `false` |
| `container` | 覆盖层容器类型 | `'drawer' \| 'modal'` | `'drawer'` |
| `mode` | 表单模式 | `'create' \| 'edit' \| 'view'` | `'create'` |
| `title` | 标题 | `string` | `''` |
| `model` | 表单数据 | `Record<string, unknown>` | — |
| `schema` | 字段 schema | `ProFieldSchema[]` | `[]` |
| `rules` | 表单规则 | `FormRules` | `{}` |
| `loading` | 初始加载态 | `boolean` | `false` |
| `submitting` | 提交中态 | `boolean` | `false` |
| `readonly` | 是否只读 | `boolean` | `false` |
| `drawer-props` | 透传给抽屉容器的属性 | `Partial<DrawerProps>` | `{}` |
| `dialog-props` | 透传给弹窗容器的属性 | `Partial<DialogProps>` | `{}` |

### OverlayForm Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:open` | 打开状态变化时派发 | `(value: boolean) => void` |
| `submit` | 提交成功时派发 | `({ mode, model }) => void` |
| `cancel` | 取消时派发 | `({ mode, model }) => void` |
| `closed` | 覆盖层完全关闭后派发 | `() => void` |

### OverlayForm Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 表单内容 |
| `actions` | 自定义底部动作区 |
