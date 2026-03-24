---
title: Checkbox 复选框
description: 用于多选场景、标记状态和批量配置选择的基础组件。
outline: deep
---

# Checkbox 复选框

`xy-checkbox`、`xy-checkbox-group` 和 `xy-checkbox-button` 用于多选状态录入。它适合权限勾选、能力开关集合、批量过滤条件和列表配置选择这类场景。

## 基础用法

:::demo 单个 `xy-checkbox` 适合布尔或枚举值切换，支持 `true-value / false-value`。
checkbox/basic
:::

## CheckboxGroup 与 options

:::demo 多选数组优先使用 `xy-checkbox-group`，当选项来自配置或接口时可直接传 `options`。
checkbox/group
:::

## 中间态与全选

:::demo `indeterminate` 常用于“部分选中”的汇总状态，它只负责视觉呈现，具体逻辑由业务层控制。
checkbox/indeterminate
:::

## 最少/最多限制

:::demo `min / max` 适合权限范围、能力包和筛选维度这类需要约束选择数量的场景。
checkbox/limit
:::

## CheckboxButton 按钮化多选

:::demo `xy-checkbox-button` 更适合维度筛选、标签式多选和更紧凑的筛选区。
checkbox/button
:::

## 禁用与边框样式

:::demo `disabled` 和 `border` 更适合设置面板、强调型选项和不可编辑回显场景。
checkbox/states
:::

## 无文案与可访问性

:::demo 当复选框没有可见文字时，建议补 `aria-label`；如果它和一个受控区域有关联，也可以加上 `aria-controls`。
checkbox/accessibility
:::

## 表单场景

:::demo 放在 `xy-form-item` 内部时，`xy-checkbox-group` 会在值变化后参与 `change` 校验。
checkbox/form
:::

## 行为约定

- 单个 `xy-checkbox` 默认走布尔值切换，也可以通过 `true-value / false-value` 映射到后端枚举值。
- 在 group 场景里，组件会自动基于 `modelValue` 数组增删当前值。
- `min / max` 只在 group 场景中生效，用于限制最少/最多可选项数。

## API

### Checkbox Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前值 | `string \| number \| boolean` | `undefined` |
| `value` | 当前项值 | `string \| number \| boolean` | `undefined` |
| `label` | 展示文案 | `string \| number \| boolean` | `undefined` |
| `indeterminate` | 是否为中间态，仅控制样式 | `boolean` | `false` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `checked` | 非受控场景下是否默认选中 | `boolean` | `false` |
| `name` | 原生 `name` | `string` | `undefined` |
| `true-value` | 选中时的值 | `string \| number` | `true` |
| `false-value` | 未选中时的值 | `string \| number` | `false` |
| `id` | 原生 id | `string` | `undefined` |
| `border` | 是否显示边框样式 | `boolean` | `false` |
| `size` | 组件尺寸 | `ComponentSize` | 跟随全局配置 |
| `tabindex` | 原生 tabindex | `string \| number` | `undefined` |
| `validate-event` | 是否触发表单校验 | `boolean` | `true` |
| `aria-label` | 原生 aria-label | `string` | `undefined` |
| `aria-controls` | 原生 aria-controls | `string` | `undefined` |

### Checkbox Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:model-value` | 选中值变化时触发 | `string \| number \| boolean` |
| `change` | 用户切换时触发 | `string \| number \| boolean` |

### Checkbox Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 自定义标签内容 |

### CheckboxGroup Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model-value` | 当前选中值数组 | `CheckboxValue[]` | `[]` |
| `options` | 选项数组 | `CheckboxOption[]` | `[]` |
| `type` | 组内渲染类型 | `'checkbox' \| 'button'` | `'checkbox'` |
| `disabled` | 是否整体禁用 | `boolean` | `false` |
| `size` | 组内尺寸 | `ComponentSize` | 跟随全局配置 |
| `name` | 原生 `name` | `string` | 自动生成 |
| `direction` | 排列方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `validate-event` | 是否触发表单校验 | `boolean` | `true` |
| `aria-label` | `group` 的辅助标签 | `string` | `'checkbox-group'` |
| `fill` | 按钮化激活态背景色 | `string` | `undefined` |
| `text-color` | 按钮化激活态文字色 | `string` | `undefined` |
| `min` | 最少可选项数 | `number` | `undefined` |
| `max` | 最多可选项数 | `number` | `undefined` |

### CheckboxGroup Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `update:model-value` | 选中值数组变化时触发 | `CheckboxValue[]` |
| `change` | 用户切换时触发 | `CheckboxValue[]` |

### CheckboxOption

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `label` | 展示文案 | `string` | — |
| `value` | 选项值 | `string \| number \| boolean` | — |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `description` | 选项副文案 | `string` | `undefined` |
