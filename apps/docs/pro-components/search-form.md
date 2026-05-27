---
title: SearchForm 搜索表单
description: 统一筛选栏布局、折叠字段和查询动作的增强组件。
outline: deep
---

# SearchForm 搜索表单

`xy-search-form` 用来把中后台列表页里常见的"筛选字段 + 查询 + 重置 + 折叠更多"收成一块稳定区域。

## 何时使用

- 需要快速搭建列表页筛选栏，不想手拼表单布局和按钮。
- 筛选字段较多，需要折叠/展开能力。
- 需要和 ProTable 的 request 联动，自动触发查询。

## 何时不使用

- 只需要简单表单（非筛选场景）时，优先使用 `xy-form` 或 `xy-pro-form`。
- 筛选字段少于 3 个且无折叠需求时，直接用 `xy-form inline` 更轻量。
- 需要复杂的分步表单时，优先使用 `xy-steps-form`。

## 与基础组件的关系

```
SearchForm
├── Form（表单容器）        ← 基于 xy-form，自动 inline 布局
├── FormItem（字段项）      ← 基于 xy-form-item，自动生成 label
├── Input / Select / ...   ← 根据 field.component 自动映射
└── Button（查询/重置）     ← 内置，可自定义文案
```

**核心区别**：`xy-form` 是通用表单组件，`xy-search-form` 专门为筛选栏场景优化了布局、折叠和查询动作。

## 最佳实践

### 字段联动

使用 `hidden` 和 `disabled` 的函数写法实现字段联动：

```ts
const fields = [
  { prop: 'type', label: '类型', component: 'select', options: typeOptions },
  {
    prop: 'subType',
    label: '子类型',
    component: 'select',
    options: subTypeOptions,
    hidden: (model) => !model.type,
    disabled: (model) => !model.type
  }
]
```

### 与 ProTable 联动

推荐将 SearchForm 放在 ProTable 的 `search` 插槽中，实现自动联动：

```vue
<xy-pro-table :columns="columns" :request="fetchData">
  <template #search="{ model }">
    <xy-search-form
      :model="model"
      :fields="searchFields"
      @search="handleSearch"
    />
  </template>
</xy-pro-table>
```

### 折叠策略

当筛选字段超过一行时，建议将次要字段标记为 `collapsible`：

```ts
const fields = [
  { prop: 'keyword', label: '关键词' },
  { prop: 'status', label: '状态', component: 'select', options: statusOptions },
  { prop: 'dateRange', label: '日期范围', component: 'date-picker', collapsible: true },
  { prop: 'department', label: '部门', component: 'select', collapsible: true, options: deptOptions },
]
```

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
