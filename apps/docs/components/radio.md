---
title: Radio 单选框
description: 在多个互斥选项中选择其一的基础表单组件。
outline: deep
---

# Radio 单选框

`xy-radio` 和 `xy-radio-group` 用于在一组互斥选项里确定单个值。适合通知方式、角色权限、环境切换这类一次只能选择一个结果的场景。

## 基础用法

:::demo 最常见的用法是通过 `xy-radio-group` 管理一组单选项，再配合 `v-model` 同步当前值。
radio/basic
:::

## 通过 options 快速渲染

:::demo 当选项来自配置或接口映射时，可以直接传 `options`，再通过 `direction="vertical"` 切成纵向列表。
radio/options
:::

## 自定义 option 插槽

:::demo 当 `options` 模式下需要更复杂的内容结构时，可以通过 `option` 插槽自定义每项展示，同时继续复用选中和禁用逻辑。
radio/custom-option
:::

## border 风格

:::demo 给单选项加上 `border` 后，可点击区域会更明确，适合设置面板或强调型筛选栏。
radio/bordered
:::

## RadioButton 按钮化单选

:::demo `xy-radio-button` 适合视图范围切换、时间维度切换这类更像模式切换器的场景。现在也支持直接通过 `options + type="button"` 配置化渲染，并可在 `xy-radio-group` 上通过 `fill` 和 `textColor` 定制激活态。
radio/button
:::

## 与表单联动

:::demo `xy-radio-group` 位于 `xy-form-item` 内部时，会在选中值变化后参与 `change` 校验。
radio/form
:::

## API

### Radio Attributes

| 属性          | 说明                         | 类型                             | 默认值      |
| ------------- | ---------------------------- | -------------------------------- | ----------- |
| `model-value` | 当前选中值，仅单独使用时生效 | `string \| number \| boolean`    | —           |
| `value`       | 单选项的值                   | `string \| number \| boolean`    | —           |
| `label`       | 展示文案                     | `string`                         | —           |
| `disabled`    | 是否禁用                     | `boolean`                        | `false`     |
| `size`        | 尺寸                         | `'sm' \| 'md' \| 'lg'`           | `全局尺寸`  |
| `name`        | 原生 `name` 属性             | `string`                         | —           |
| `border`      | 是否显示边框样式             | `boolean`                        | `false`     |

### Radio Events

| 事件                 | 说明               | 参数                               |
| -------------------- | ------------------ | ---------------------------------- |
| `update:model-value` | 选中值变化时触发   | `string \| number \| boolean`      |
| `change`             | 用户切换选项时触发 | `string \| number \| boolean`      |

### Radio Slots

| 插槽      | 说明           |
| --------- | -------------- |
| `default` | 自定义标签内容 |

### RadioButton Attributes

| 属性          | 说明                         | 类型                             | 默认值      |
| ------------- | ---------------------------- | -------------------------------- | ----------- |
| `model-value` | 当前选中值，仅单独使用时生效 | `string \| number \| boolean`    | —           |
| `value`       | 单选项的值                   | `string \| number \| boolean`    | —           |
| `label`       | 展示文案                     | `string`                         | —           |
| `disabled`    | 是否禁用                     | `boolean`                        | `false`     |
| `size`        | 尺寸                         | `'sm' \| 'md' \| 'lg'`           | `全局尺寸`  |
| `name`        | 原生 `name` 属性             | `string`                         | —           |

### RadioButton Slots

| 插槽      | 说明           |
| --------- | -------------- |
| `default` | 自定义按钮内容 |

### RadioGroup Attributes

| 属性             | 说明                         | 类型                               | 默认值         |
| ---------------- | ---------------------------- | ---------------------------------- | -------------- |
| `model-value`    | 当前选中值                   | `string \| number \| boolean`      | —              |
| `options`        | 选项数组                     | `RadioOption[]`                    | `[]`           |
| `type`           | 组内渲染类型                 | `'radio' \| 'button'`              | `'radio'`      |
| `disabled`       | 是否整体禁用                 | `boolean`                          | `false`        |
| `size`           | 组内单选项尺寸               | `'sm' \| 'md' \| 'lg'`             | `全局尺寸`     |
| `name`           | 原生 `name` 属性             | `string`                           | 自动生成       |
| `direction`      | 排列方向                     | `'horizontal' \| 'vertical'`       | `'horizontal'` |
| `validate-event` | 是否在值变化时触发表单校验   | `boolean`                          | `true`         |
| `aria-label`     | `radiogroup` 的辅助标签      | `string`                           | `'radio-group'`|
| `fill`           | 按钮化单选激活态背景色       | `string`                           | 主色           |
| `text-color`     | 按钮化单选激活态文字色       | `string`                           | `#ffffff`      |

### RadioOption

| 字段       | 说明       | 类型                             | 默认值  |
| ---------- | ---------- | -------------------------------- | ------- |
| `label`    | 展示文案   | `string`                         | —       |
| `value`    | 选项值     | `string \| number \| boolean`    | —       |
| `disabled` | 是否禁用   | `boolean`                        | `false` |
| `description` | 选项副文案 | `string`                       | —       |

### RadioGroup Events

| 事件                 | 说明               | 参数                               |
| -------------------- | ------------------ | ---------------------------------- |
| `update:model-value` | 选中值变化时触发   | `string \| number \| boolean`      |
| `change`             | 用户切换选项时触发 | `string \| number \| boolean`      |

### RadioGroup Slots

| 插槽      | 说明                                                                      |
| --------- | ------------------------------------------------------------------------- |
| `default` | 自定义渲染 `xy-radio` / `xy-radio-button`                                 |
| `option`  | `options` 模式下自定义每个选项内容，暴露 `option`、`checked`、`disabled`、`type` |
