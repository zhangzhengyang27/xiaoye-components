---
title: StepsForm 分步表单
description: 用统一步骤条和表单动作承接分阶段录入流程。
outline: deep
---

# StepsForm 分步表单

`xy-steps-form` 用来把“基础信息 -> 补充配置 -> 提交确认”这类分阶段表单流拉成稳定骨架。

## 基础用法

:::demo 先在页面内跑通步骤流，再逐步往每一步里补更完整的字段与校验。
pro/steps-form/basic
:::

## 抽屉内运行同一套步骤流

:::demo 当需要保留当前列表上下文时，可以把同一套步骤流放进抽屉容器中运行，而不是继续拆出独立的抽屉分步表单心智。
pro/steps-form/drawer-release
:::

## 当前定位

- 负责步骤切换、上一步下一步和最终提交的编排。
- 适合需要拆阶段认知负担的后台录入流程。

## 当前边界

- 当前支持 `placement="page" | "drawer"` 两种承载方式，但不包含分支步骤、跨步回填策略和请求层保存草稿。
- 更复杂的向导式流程仍然建议放到页面级容器中处理。
- 当步骤流进入复核/查看阶段时，可以直接开启 `readonly`，每一步会复用统一只读显示协议，而不是继续渲染禁用输入控件。

## StepsForm API

### StepsForm Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model` | 表单数据对象，所有步骤共享 | `Record<string, unknown>` | `-` |
| `steps` | 步骤配置数组 | `StepsFormStep[]` | `[]` |
| `placement` | 承载容器 | `'page' / 'drawer'` | `'page'` |
| `open` | 抽屉模式下是否打开，受控模式 | `boolean` | `false` |
| `title` | 标题，缺省时为「分步表单」 | `string` | `''` |
| `active` | 当前步骤索引，受控模式 | `number` | `undefined` |
| `default-active` | 默认步骤索引，非受控模式使用 | `number` | `0` |
| `loading` | 是否处于加载中 | `boolean` | `false` |
| `readonly` | 是否只读，只读时复用只读详情展示协议 | `boolean` | `false` |
| `readonly-descriptions-props` | 只读详情描述列表配置 | `Omit<DescriptionsProps, 'items' / 'title' / 'extra'>` | `{}` |
| `submitting` | 是否提交中 | `boolean` | `false` |
| `next-text` | 下一步按钮文案 | `string` | `'下一步'` |
| `prev-text` | 上一步按钮文案 | `string` | `'上一步'` |
| `submit-text` | 提交按钮文案 | `string` | `'提交'` |
| `drawer-props` | 透传给内部 `xy-drawer` 的配置 | `Omit<Partial<DrawerProps>, 'modelValue' / 'title'>` | `{}` |

### StepsFormStep Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `key` | 步骤唯一标识 | `string` | `-` |
| `title` | 步骤标题 | `string` | `-` |
| `description` | 步骤描述 | `string` | `-` |
| `schema` | 该步骤的字段配置数组 | `ProFieldSchema[]` | `undefined` |

### StepsForm Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `update:active` | 步骤索引变化时派发 | `(value: number) => void` |
| `update:open` | 抽屉开合状态变化时派发 | `(value: boolean) => void` |
| `step-change` | 步骤切换后派发 | `(value: number) => void` |
| `next` | 进入下一步成功后派发，携带新索引 | `(value: number) => void` |
| `prev` | 返回上一步成功后派发，携带新索引 | `(value: number) => void` |
| `submit` | 最后一步校验通过后派发，携带 model 深拷贝快照 | `(payload: Record<string, unknown>) => void` |
| `cancel` | 点击抽屉底部关闭按钮时派发并关闭抽屉 | `() => void` |
| `closed` | 抽屉关闭动画结束后派发 | `() => void` |

### StepsForm Slots

| 插槽 | 说明 | 接收参数 |
| --- | --- | --- |
| `default` | 自定义当前步骤表单内容 | `{ step, active }` |
| `footer` | 自定义抽屉底部动作区，仅 `placement="drawer"` 时可用 | - |

### StepsForm Exposes

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `next` | `() => Promise<void>` | 校验当前步骤后进入下一步，最后一步无效 |
| `prev` | `() => Promise<void>` | 返回上一步，第一步无效 |
| `submit` | `() => Promise<void>` | 校验后派发 `submit` 事件 |
| `close` | `() => void` | 关闭抽屉，触发 `update:open` 为 `false` |
