---
title: RequestForm 请求表单
description: 统一首屏加载、提交请求与表单容器的增强组件。
outline: deep
---

# RequestForm 请求表单

`xy-request-form` 适合需要“先拉详情再编辑”或者“表单提交由页面请求承接”的后台录入场景。

## 基础用法

:::demo 第一版可以先把它当作带请求边界的 ProForm 来用，逐步接入真正的加载和提交逻辑。
pro/request-form/basic
:::

## 当前定位

- 负责初始加载、提交请求和表单骨架的统一收口。
- 适合详情编辑、配置保存这类“读一次、改一次”的场景。

## 当前边界

- 当前不内建错误映射、字段级回滚和复杂请求缓存策略。
- 更复杂的数据依赖和多段提交仍建议由页面层编排。
- 当只承担“请求后查看”职责时，可以直接开启 `readonly`，内部会复用 `ProForm` 的查看态展示协议。

## RequestForm API

### RequestForm Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 表单标题 | `string` | `''` |
| `description` | 表单说明文案 | `string` | `''` |
| `model` | 表单数据对象，初始请求结果会合并回该对象 | `Record<string, unknown>` | `-` |
| `schema` | schema 驱动的字段配置数组 | `ProFieldSchema[]` | `[]` |
| `rules` | 表单校验规则 | `FormRules` | `{}` |
| `label-width` | 表单项 label 宽度 | `string / number` | `'112px'` |
| `label-position` | label 位置 | `'left' / 'top'` | `'top'` |
| `size` | 表单尺寸 | `ComponentSize` | `'md'` |
| `readonly` | 是否只读 | `boolean` | `false` |
| `immediate` | 挂载后是否立即执行 `initial-request` | `boolean` | `true` |
| `initial-request` | 初始加载请求，未提供时直接使用 model 当前值作为初始快照 | `(ctx: ProRequestContext) => Promise<Record<string, unknown>>` | `undefined` |
| `submit-request` | 提交请求，未提供时校验通过即视为提交成功 | `(ctx: RequestFormSubmitContext) => Promise<unknown>` | `undefined` |

### RequestForm Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `request-success` | 初始加载成功时派发，携带请求结果 | `(payload: Record<string, unknown>) => void` |
| `request-error` | 初始加载失败时派发 | `(error: unknown) => void` |
| `submit-success` | 提交请求成功时派发，携带请求结果 | `(payload: unknown) => void` |
| `submit-error` | 提交请求失败时派发 | `(error: unknown) => void` |

### RequestForm Slots

| 插槽 | 说明 | 接收参数 |
| --- | --- | --- |
| `default` | 自定义表单项内容，透传给内部 `xy-pro-form` | `{ model }` |

### RequestForm Exposes

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `reload` | `() => Promise<void>` | 重新执行初始加载请求 |
| `refresh` | `() => Promise<void>` | 刷新初始数据 |
| `reset` | `() => Promise<void>` | 将 model 回填为初始快照并重新加载 |
| `submit` | `() => Promise<boolean>` | 校验通过后执行提交请求，返回是否成功 |
