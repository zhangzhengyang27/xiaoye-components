---
title: Progress 进度条
description: 支持线形、环形和仪表盘三种形态的进度条组件。
outline: deep
---

# Progress 进度条

`xy-progress` 用于展示任务完成度、上传状态、部署阶段或配额消耗。样式、文档组织和示例场景都按中后台使用方式做了收敛。

## 发布流水线

:::demo 真实页面里更常见的是把进度条放进发布流水线、任务卡片或审批面板里，用来快速判断哪个环节已完成、哪个环节还在推进。
progress/basic
:::

## 批处理任务队列

:::demo `status` 适合表达已完成、待确认和失败阻塞；`text-inside` 更适合导出、补录和回收任务这类紧凑型队列。
progress/status
:::

## 上传与排队场景

:::demo 当任务还在推进、但暂时拿不到精确百分比时，可以用 `indeterminate`；分片传输、批量导入这类场景则适合叠加条纹流动效果。
progress/animated
:::

## 指标卡与健康度概览

:::demo `circle` 适合放进指标卡、团队目标、概览面板；`dashboard` 则更适合承接健康度、达成率这类更偏“仪表盘感”的读数。
progress/circle
:::

## API

### Progress Attributes

| 属性             | 说明                                   | 类型                                                                                                 | 默认值                               |
| ---------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `type`           | 进度条类型                             | `'line' \| 'circle' \| 'dashboard'`                                                                  | `'line'`                             |
| `percentage`     | 当前百分比，会自动收敛到 `0 - 100`     | `number`                                                                                             | `0`                                  |
| `status`         | 当前状态                               | `'' \| 'success' \| 'exception' \| 'warning'`                                                        | `''`                                 |
| `indeterminate`  | 是否展示不确定进度动画                 | `boolean`                                                                                            | `false`                              |
| `duration`       | 不确定进度或条纹流动的动画时长         | `number`                                                                                             | `3`                                  |
| `stroke-width`   | 线形轨道高度或圆环描边宽度             | `number`                                                                                             | `6`                                  |
| `stroke-linecap` | 圆环描边端点样式                       | `'butt' \| 'round' \| 'square'`                                                                      | `'round'`                            |
| `text-inside`    | 是否把文本放进线形进度条内部           | `boolean`                                                                                            | `false`                              |
| `width`          | `circle / dashboard` 的画布宽高        | `number`                                                                                             | `126`                                |
| `show-text`      | 是否显示进度文案                       | `boolean`                                                                                            | `true`                               |
| `color`          | 自定义颜色，支持字符串、分段数组或函数 | `string \| Array<string \| { color: string; percentage: number }> \| (percentage: number) => string` | `''`                                 |
| `striped`        | 是否开启条纹纹理                       | `boolean`                                                                                            | `false`                              |
| `striped-flow`   | 是否开启条纹流动动画                   | `boolean`                                                                                            | `false`                              |
| `format`         | 自定义文案格式化函数                   | `(percentage: number) => string`                                                                     | `(percentage) => \`${percentage}%\`` |

### Progress Slots

| 插槽      | 说明                                                         | 参数                              |
| --------- | ------------------------------------------------------------ | --------------------------------- |
| `default` | 自定义进度文案，线形外侧、线形内侧和圆形中心文案都走这个插槽 | `{ percentage, content, status }` |
