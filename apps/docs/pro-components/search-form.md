---
title: SearchForm 搜索表单
description: 统一筛选栏布局、折叠字段和查询动作的增强组件。
outline: deep
---

# SearchForm 搜索表单

`xy-search-form` 用来把中后台列表页里常见的“筛选字段 + 查询 + 重置 + 折叠更多”收成一块稳定区域。

## 基础用法

:::demo 常见的做法是用 schema 描述字段，让输入框、选择器和按钮顺手落成一条筛选栏。
pro/search-form/basic
:::

## 折叠字段与自定义插槽

:::demo 当筛选项较多时，可以把次级字段标记为 `collapsible`，并用具名插槽承接个别特殊字段。
pro/search-form/collapsible
:::

## SearchForm API

### SearchForm Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model` | 表单数据对象 | `Record<string, unknown>` | — |
| `fields` | 字段 schema 数组 | `SearchFormField[]` | `[]` |
| `rules` | 字段校验规则 | `FormRules` | `{}` |
| `columns` | 栅格列数 | `number` | `3` |
| `collapsed` | 是否折叠，受控模式 | `boolean` | `undefined` |
| `default-collapsed` | 默认是否折叠 | `boolean` | `true` |
| `submit-text` | 查询按钮文案 | `string` | `'查询'` |
| `reset-text` | 重置按钮文案 | `string` | `'重置'` |
| `submit-on-reset` | 重置后是否再次派发 `search` | `boolean` | `true` |
| `validate-on-search` | 查询前是否校验字段 | `boolean` | `false` |

### SearchForm Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `search` | 点击查询或触发主动提交时派发 | `(modelSnapshot) => void` |
| `reset` | 点击重置后派发 | `(modelSnapshot) => void` |
| `update:collapsed` | 折叠状态变化时派发 | `(value: boolean) => void` |
| `collapse-change` | 折叠状态变化时派发 | `(value: boolean) => void` |

### SearchFormField Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `prop` | 字段键名 | `string` | — |
| `label` | 字段标签 | `string` | — |
| `component` | 内置字段类型或自定义组件 | `'input' \| 'select' \| 'date-picker' \| 'time-picker' \| 'time-select' \| 'input-number' \| 'switch' \| Component` | `'input'` |
| `component-props` | 透传给字段组件的 props | `Record<string, unknown>` | `{}` |
| `options` | `select` 的选项列表 | `SearchFormFieldOption[]` | `[]` |
| `slot` | 自定义字段插槽名 | `string` | 跟随 `prop` |
| `span` | 当前字段跨列数 | `number` | `1` |
| `collapsible` | 折叠时是否收起该字段 | `boolean` | `false` |
| `hidden` | 是否隐藏字段，可传函数 | `boolean \| (model) => boolean` | `false` |
| `disabled` | 是否禁用字段，可传函数 | `boolean \| (model) => boolean` | `false` |

### SearchForm Slots

| 插槽 | 说明 |
| --- | --- |
| `meta` | 动作区左侧元信息 |
| `actions` | 自定义动作区 |
| `[field.slot / field.prop]` | 自定义字段内容 |

## 行为约定

- placeholder 优先级固定为：`field.placeholder > field.componentProps.placeholder > 自动生成文案`。
- 只有内置 `input` 且非 `textarea` 场景，按 `Enter` 会触发一次 `search`；其他字段类型不会自动提交。
- `validate-on-search` 开启后，`search` 只有在字段校验通过时才会派发。
- `submit-on-reset` 为 `true` 时，点击重置会在派发 `reset` 后再派发一次 `search`。
- `hidden` 和 `disabled` 支持函数写法，会基于当前 `model` 实时重新计算。
- `collapsed` 受控时，组件只派发 `update:collapsed` / `collapse-change`，真实展开状态由外层 `props.collapsed` 决定。
