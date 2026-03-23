---
title: Select 选择器
description: 单选下拉、搜索过滤和中后台筛选栏的基础选择器。
outline: deep
---

# Select 选择器

`xy-select` 用于单值选择，当前版本优先覆盖后台筛选栏和表单枚举值录入，重点是“单选 + 搜索 + 清空 + 键盘导航”。

## 基础用法

:::demo 最基础的用法是传入 `options`，再用 `v-model` 接住当前选中值。
select/basic
:::

## 搜索、清空与描述文案

:::demo 选项支持 `description` 字段，适合在后台场景里补充状态解释或二级信息。
select/search
:::

## 表单场景

:::demo 放在 `xy-form-item` 内部时，Select 会自动关联错误消息并参与 `change / blur` 校验。
select/form
:::

## 键盘与行为约定

- `ArrowDown / ArrowUp` 在可选项之间移动。
- `Enter / Space` 选择当前高亮项。
- `Escape` 关闭下拉，并把焦点还给触发器。
- `clearable` 适合筛选栏，`searchable` 适合选项较多的枚举值选择。

## API

### Select Attributes

| 属性            | 说明                   | 类型                       | 默认值         |
| --------------- | ---------------------- | -------------------------- | -------------- |
| `model-value`   | 当前选中值             | `string \| number \| null` | `null`         |
| `options`       | 选项列表               | `SelectOption<T>[]`        | —              |
| `placeholder`   | 未选择时的占位提示     | `string`                   | `'请选择'`     |
| `disabled`      | 是否禁用               | `boolean`                  | `false`        |
| `clearable`     | 是否允许清空当前选中值 | `boolean`                  | `false`        |
| `searchable`    | 是否启用搜索输入       | `boolean`                  | `false`        |
| `size`          | 组件尺寸               | `'sm' \| 'md' \| 'lg'`     | 跟随全局配置   |
| `no-data-text`  | 无选项时的文案         | `string`                   | `'暂无选项'`   |
| `no-match-text` | 搜索无结果时的文案     | `string`                   | `'没有匹配项'` |

### Select Events

| 事件                 | 说明                 | 参数                       |
| -------------------- | -------------------- | -------------------------- |
| `update:model-value` | 选中值变化时触发     | `string \| number \| null` |
| `change`             | 选中值确认变化时触发 | `string \| number \| null` |
| `clear`              | 点击清空按钮时触发   | —                          |
| `visible-change`     | 下拉打开或关闭时触发 | `boolean`                  |
| `focus`              | 下拉打开时触发       | —                          |
| `blur`               | 下拉关闭时触发       | —                          |

### Select Option

| 字段          | 说明           | 类型               | 默认值      |
| ------------- | -------------- | ------------------ | ----------- |
| `label`       | 选项展示文案   | `string`           | —           |
| `value`       | 选项值         | `string \| number` | —           |
| `disabled`    | 是否禁用该选项 | `boolean`          | `false`     |
| `description` | 辅助描述信息   | `string`           | `undefined` |
