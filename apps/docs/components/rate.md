---
title: Rate 评分
description: 支持半星、清空、文本提示和表单联动的评分组件。
outline: deep
---

# Rate 评分

`xy-rate` 适合评价、满意度回访、服务打分和后台运营面板里的人工审核场景。它延续了当前仓库“中文文案优先、示例先行”的文档结构，同时补上了半星、清空、键盘和表单校验这些常见评分链路。

## 基础用法

:::demo 最常见的用法是和 `v-model` 绑定一个数值，点击星标后立刻回写评分结果。
rate/basic
:::

## 半星与清空

:::demo `allow-half` 适合更细颗粒度的主观评价；`clearable` 适合“允许撤销打分”的后台操作流。
rate/allow-half
:::

## 文案与分数展示

:::demo `show-text` 用来承接中文评价文案，`show-score` 更适合看板、详情页和统计面板。
rate/text-score
:::

## 自定义图标、颜色与只读态

:::demo 通过 `colors`、`icons`、`void-icon` 和 `disabled-void-color`，可以把评分视觉切到更贴近业务的语义里。
rate/custom
:::

## 表单场景

:::demo 放在 `xy-form-item` 里时，`xy-rate` 会参与 `change / blur` 校验链路，并自动复用表单生成的字段 id。
rate/form
:::

## 键盘与交互约定

- 聚焦组件后，`ArrowUp / ArrowRight` 会增加评分，`ArrowDown / ArrowLeft` 会降低评分。
- 开启 `allow-half` 后，鼠标移动到图标左半区会预览半星，点击后按 `0.5` 步进提交。
- 开启 `clearable` 后，再次点击当前值会回退到 `0`。
- 组件禁用时，鼠标和键盘交互都会被短路，但仍会按当前值展示小数填充。

## API

### Rate Attributes

| 属性                  | 说明                          | 类型                                 | 默认值                                     |
| --------------------- | ----------------------------- | ------------------------------------ | ------------------------------------------ |
| `model-value`         | 当前评分                      | `number \| null`                     | `0`                                        |
| `id`                  | 根节点 id                     | `string`                             | `undefined`                                |
| `low-threshold`       | 低分阈值                      | `number`                             | `2`                                        |
| `high-threshold`      | 高分阈值                      | `number`                             | `4`                                        |
| `max`                 | 最大评分项数量                | `number`                             | `5`                                        |
| `colors`              | 激活颜色数组或阈值映射        | `string[] \| Record<number, string>` | `['#94a3b8', '#f59e0b', '#f97316']`        |
| `void-color`          | 未激活图标颜色                | `string`                             | `''`                                       |
| `disabled-void-color` | 禁用态未激活图标颜色          | `string`                             | `''`                                       |
| `icons`               | 激活图标数组或阈值映射        | `string[] \| Record<number, string>` | `['mdi:star', 'mdi:star', 'mdi:star']`     |
| `void-icon`           | 未激活图标                    | `string`                             | `'mdi:star-outline'`                       |
| `disabled-void-icon`  | 禁用态未激活图标              | `string`                             | `'mdi:star-outline'`                       |
| `disabled`            | 是否禁用                      | `boolean`                            | `false`                                    |
| `allow-half`          | 是否允许半星                  | `boolean`                            | `false`                                    |
| `show-text`           | 是否显示文本评价              | `boolean`                            | `false`                                    |
| `show-score`          | 是否显示分数                  | `boolean`                            | `false`                                    |
| `text-color`          | 评价文本颜色                  | `string`                             | `''`                                       |
| `texts`               | 评价文本数组                  | `string[]`                           | `['极差', '失望', '一般', '满意', '惊喜']` |
| `score-template`      | 分数模板，支持 `{value}` 占位 | `string`                             | `'{value}'`                                |
| `size`                | 组件尺寸                      | `'sm' \| 'md' \| 'lg'`               | 跟随全局配置                               |
| `clearable`           | 是否允许再次点击清空          | `boolean`                            | `false`                                    |
| `aria-label`          | 原生 `aria-label`             | `string`                             | `'评分'`                                   |
| `validate-event`      | 是否触发表单校验              | `boolean`                            | `true`                                     |

### Rate Events

| 事件                 | 说明               | 参数         |
| -------------------- | ------------------ | ------------ |
| `update:model-value` | 当前评分变化时触发 | `number`     |
| `change`             | 提交新评分时触发   | `number`     |
| `focus`              | 组件获得焦点时触发 | `FocusEvent` |
| `blur`               | 组件失去焦点时触发 | `FocusEvent` |

### Rate Exposes

| 暴露项              | 说明                 | 类型                                          |
| ------------------- | -------------------- | --------------------------------------------- |
| `root`              | 根节点引用           | `ShallowRef<HTMLElement \| null>`             |
| `focus`             | 聚焦评分组件         | `() => void`                                  |
| `blur`              | 让评分组件失焦       | `() => void`                                  |
| `setCurrentValue`   | 手动设置当前预览评分 | `(value: number, event?: MouseEvent) => void` |
| `resetCurrentValue` | 恢复到 `model-value` | `() => void`                                  |
