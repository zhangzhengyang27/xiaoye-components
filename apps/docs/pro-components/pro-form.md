---
title: ProForm 增强表单
description: 统一标题、表单网格与动作区的增强表单容器。
outline: deep
---

# ProForm 增强表单

`xy-pro-form` 适合承接后台场景里“分组字段 + 提交重置 + 表单头部说明”这一类稳定表单骨架。

## 基础用法

:::demo 用默认插槽承接表单项时，可以先把布局、标题、动作区统一起来，再按页面需要补充字段。
pro/pro-form/basic
:::

## 当前定位

- 面向中后台页面的表单编排层，负责头部、网格和动作区的一致性。
- 可以直接写插槽表单项，也可以逐步过渡到 `schema` 驱动字段。

## 当前边界

- 当前不负责请求编排、抽屉/弹窗容器控制和步骤流转。
- 复杂联动、权限裁剪和远程字段协议仍然建议由页面层处理。
- 当 `schema + readonly` 同时成立时，字段区会自动切成只读详情展示，而不是继续渲染禁用输入组件。

## ProForm API

### ProForm Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 表单标题 | `string` | `''` |
| `description` | 表单说明文案 | `string` | `''` |
| `model` | 表单数据对象 | `Record<string, unknown>` | `-` |
| `schema` | schema 驱动的字段配置数组 | `ProFieldSchema[]` | `[]` |
| `rules` | 表单校验规则 | `FormRules` | `{}` |
| `label-width` | 表单项 label 宽度 | `string / number` | `'112px'` |
| `label-position` | label 位置 | `'left' / 'top'` | `'top'` |
| `size` | 表单尺寸 | `ComponentSize` | `'md'` |
| `columns` | 字段网格列数 | `number` | `2` |
| `loading` | 是否处于加载中，加载中不渲染表单体 | `boolean` | `false` |
| `readonly` | 是否只读，`schema` 非空时切换为只读详情展示 | `boolean` | `false` |
| `readonly-descriptions-props` | 只读详情描述列表配置 | `Omit<DescriptionsProps, 'items' / 'title' / 'extra'>` | `{}` |
| `submitting` | 是否提交中，提交中禁用表单并让提交按钮进入 loading | `boolean` | `false` |
| `submit-text` | 提交按钮文案 | `string` | `'保存'` |
| `reset-text` | 重置按钮文案 | `string` | `'重置'` |
| `show-submit` | 是否显示提交按钮 | `boolean` | `true` |
| `show-reset` | 是否显示重置按钮 | `boolean` | `true` |

### ProForm Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `submit` | 校验通过后派发，携带 model 深拷贝快照 | `(payload: Record<string, unknown>) => void` |
| `reset` | 重置表单后派发，携带 model 深拷贝快照 | `(payload: Record<string, unknown>) => void` |

### ProForm Slots

| 插槽 | 说明 | 接收参数 |
| --- | --- | --- |
| `default` | 自定义表单项内容，仅在 `schema` 为空时渲染 | `{ model, readonly }` |
| `header` | 自定义头部区域，替换默认的标题和说明 | - |
| `meta` | 头部右侧补充信息区 | - |
| `[field.slot]` | schema 字段的插槽名对应的自定义字段内容 | `{ field, model }` |
| `actions` | 自定义底部动作区按钮 | `{ model, submit, reset, submitting }` |

只读详情模式下，除 `header / meta / actions` 外的插槽会原样转发给内部的 `xy-descriptions`。

### ProForm Exposes

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| `validate` | `() => Promise<boolean>` | 触发内部表单校验，返回是否通过 |
| `submit` | `() => Promise<boolean>` | 校验通过后派发 `submit` 事件，返回是否执行成功 |
| `reset` | `(prop?: FormProp / FormProp[]) => void` | 重置指定字段（缺省为全部）并派发 `reset` 事件 |
| `clearValidate` | `(prop?: FormProp / FormProp[]) => void` | 清除指定字段的校验状态（缺省为全部） |
