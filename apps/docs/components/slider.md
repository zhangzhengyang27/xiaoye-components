---
title: Slider 滑块
description: 支持单值、范围、输入框联动和垂直模式的滑块组件。
outline: deep
---

# Slider 滑块

`xy-slider` 适合阈值调节、价格区间、音量、权重和后台配置面板里的连续值调整场景。提供直接的 API 和样式实现。

## 基础用法

:::demo 最常见的用法是配合 `v-model` 绑定一个数值，通过点击轨道、拖拽圆点或键盘方向键来调整值。
slider/basic
:::

## 范围选择

:::demo 开启 `range` 后，会渲染两个拖拽点并输出 `[start, end]` 形式的数组。
slider/range
:::

## 输入框与断点

:::demo `show-input` 适合让用户精确回填具体数值，`show-stops` 则适合把步长节奏展示出来。
slider/input-stops
:::

## 表单场景

:::demo 放在 `xy-form-item` 里时，`xy-slider` 会参与 `change / blur` 校验链路。
slider/form
:::

## 键盘与交互约定

- `ArrowLeft / ArrowDown` 减少一个步长，`ArrowRight / ArrowUp` 增加一个步长。
- `PageUp / PageDown` 按 4 个步长跳变；`Home / End` 直接跳到最小值或最大值。
- 开启 `range` 后，点击轨道会优先移动距离点击位置更近的拖拽点。

## API

### Slider Attributes

| 属性                  | 说明                        | 类型                                     | 默认值       |
| --------------------- | --------------------------- | ---------------------------------------- | ------------ |
| `model-value`         | 当前值                      | `number \| [number, number]`             | `0`          |
| `id`                  | 根节点 id                   | `string`                                 | `undefined`  |
| `min`                 | 最小值                      | `number`                                 | `0`          |
| `max`                 | 最大值                      | `number`                                 | `100`        |
| `step`                | 步长                        | `number`                                 | `1`          |
| `show-input`          | 是否显示输入框              | `boolean`                                | `false`      |
| `show-input-controls` | 输入框是否显示控制按钮      | `boolean`                                | `true`       |
| `size`                | 滑块尺寸                    | `'sm' \| 'md' \| 'lg'`                   | 跟随全局配置 |
| `input-size`          | 输入框尺寸                  | `'sm' \| 'md' \| 'lg'`                   | 跟随 `size`  |
| `show-stops`          | 是否显示步长断点            | `boolean`                                | `false`      |
| `show-tooltip`        | 是否显示 tooltip            | `boolean`                                | `true`       |
| `format-tooltip`      | tooltip 格式化函数          | `(value: number) => number \| string`    | `undefined`  |
| `disabled`            | 是否禁用                    | `boolean`                                | `false`      |
| `range`               | 是否为范围选择              | `boolean`                                | `false`      |
| `vertical`            | 是否纵向展示                | `boolean`                                | `false`      |
| `height`              | 纵向模式下的轨道高度        | `string`                                 | `'180px'`    |
| `range-start-label`   | 范围起点的无障碍说明        | `string`                                 | `'起始值'`   |
| `range-end-label`     | 范围终点的无障碍说明        | `string`                                 | `'结束值'`   |
| `format-value-text`   | `aria-valuetext` 格式化函数 | `(value: number) => string`              | `undefined`  |
| `tooltip-class`       | tooltip 自定义类名          | `string`                                 | `''`         |
| `placement`           | tooltip 位置                | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'`      |
| `validate-event`      | 是否触发表单校验            | `boolean`                                | `true`       |
| `persistent`          | tooltip 隐藏时是否保留 DOM  | `boolean`                                | `true`       |
| `aria-label`          | 单值模式下的无障碍说明      | `string`                                 | `undefined`  |

### Slider Events

| 事件                 | 说明                 | 参数                         |
| -------------------- | -------------------- | ---------------------------- |
| `update:model-value` | 当前值变化时触发     | `number \| [number, number]` |
| `input`              | 拖拽或输入过程中触发 | `number \| [number, number]` |
| `change`             | 提交变更后触发       | `number \| [number, number]` |
| `focus`              | 拖拽点获得焦点时触发 | `FocusEvent`                 |
| `blur`               | 拖拽点失去焦点时触发 | `FocusEvent`                 |

### Slider Exposes

| 暴露项  | 说明         | 类型         |
| ------- | ------------ | ------------ |
| `focus` | 聚焦第一个点 | `() => void` |
| `blur`  | 让拖拽点失焦 | `() => void` |
