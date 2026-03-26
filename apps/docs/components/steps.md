---
title: Steps 步骤条
description: 承接审批流、引导流和分阶段任务状态的步骤条组件。
outline: deep
---

# Steps 步骤条

`xy-steps` 和 `xy-step` 用来表达“当前走到哪一步、已经完成哪些节点、接下来还有什么”的流程状态。首版 API 参考了 `element-plus` 的 `Steps / Step`，保留了最常用的 `active`、方向切换、状态映射、`simple` 紧凑模式，以及 `title / description / icon` 这几个核心能力。

## 基础用法

:::demo 最常见的接法是父层维护 `active`，子项只负责描述每个阶段。适合审批流、引导流和发布流程。
steps/basic
:::

## 状态映射与对齐方式

:::demo `finish-status` 和 `process-status` 负责映射“已完成项”和“当前项”的视觉状态；某个 `xy-step` 也可以通过自身的 `status` 显式覆盖。
steps/status
:::

## 审批打回与重提

:::demo 真实后台里更常见的不是一路线性推进，而是“命中规则 -> 打回补充 -> 再次提交”这种回退链路。这个示例顺带演示了 `space='25%'` 的百分比步距写法。
steps/rollback
:::

## 分步向导面板

:::demo 步骤条本身只负责表达流程位置，真正的表单内容、保存草稿和下一步按钮通常由父层一起维护。这个例子更接近新建租户、发布配置这类分步向导。
steps/wizard
:::

## 纵向步骤条

:::demo `direction='vertical'` 适合抽屉、详情页右侧流程栏和任务面板。`space` 可以直接控制每个节点的节距。
steps/vertical
:::

## 侧栏处理进度

:::demo 纵向步骤条不只适合展示顺序，还适合承接工单详情、审批抽屉和处理记录侧栏。这里用 `title / description` 插槽补上了处理人、时间和摘要信息。
steps/sidebar
:::

## Simple 模式

:::demo `simple` 会切到更轻的紧凑结构，适合页头流程概览、表单顶部进度和轻量引导栏。
steps/simple
:::

## 何时使用

- 需要在页面里清楚表达“当前步骤、已完成步骤、未开始步骤”。
- 需要同时承接横向流程概览和纵向明细流程。
- 需要一套轻量但可扩展的步骤组件，而不是只写静态标签。

## API

### Steps Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `space` | 每个步骤项的间距；支持数字和百分比字符串 | `number \| string` | `''` |
| `active` | 当前激活步骤，从 `0` 开始计数 | `number` | `0` |
| `direction` | 展示方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `align-center` | 是否在横向模式下居中标题和描述 | `boolean` | `false` |
| `simple` | 是否启用紧凑模式 | `boolean` | `false` |
| `finish-status` | 已完成步骤的状态映射 | `'wait' \| 'process' \| 'finish' \| 'error' \| 'success'` | `'finish'` |
| `process-status` | 当前步骤的状态映射 | `'wait' \| 'process' \| 'finish' \| 'error' \| 'success'` | `'process'` |

### Steps Events

| 事件 | 说明 | 参数 |
| --- | --- | --- |
| `change` | `active` 变化时触发 | `(newValue: number, oldValue: number)` |

### Steps Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 步骤内容，通常传入多个 `xy-step` |

### Step Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 步骤标题 | `string` | `''` |
| `description` | 步骤描述 | `string` | `''` |
| `icon` | 自定义图标名，内部由 `xy-icon` 渲染 | `string` | `''` |
| `status` | 显式指定当前步骤状态；不传时由父级自动计算 | `'' \| 'wait' \| 'process' \| 'finish' \| 'error' \| 'success'` | `''` |

### Step Slots

| 插槽 | 说明 |
| --- | --- |
| `title` | 自定义标题内容 |
| `description` | 自定义描述内容 |
| `icon` | 自定义图标区域 |

## 使用提示

- `active` 只负责流程位置，不负责业务数据本身；业务状态仍建议在父层维护。
- `Step.status` 会覆盖当前节点展示状态，但不会打乱后续节点的自动流转逻辑。
- `Steps` 不负责切换下面的表单或面板内容，分步向导通常由父层配合 `active` 一起维护。
- `align-center` 只在横向且非 `simple` 模式下生效。
- `space` 传百分比时更适合步数固定、标题较短的横向流程；步数过多或文案较长时，更推荐直接切到纵向。
- `simple` 模式更适合概览，不适合承载长描述。
- 如果你需要在运行时重排步骤，保持 `v-for` 的 `key` 稳定。
