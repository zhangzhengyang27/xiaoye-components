---
title: Timeline 时间线
description: 适合审计流、里程碑和侧栏动态记录的时间线基础组件，支持分组、流程态和紧凑密度。
outline: deep
---

# Timeline 时间线

`xy-timeline`、`xy-timeline-group` 和 `xy-timeline-item` 用来承接“按时间顺序查看事件”的场景。当前版本不走 `items` 数据驱动，而是继续保持插槽优先的布局原语，同时补上了分组、流程态、结构化内容区和紧凑密度，让它更适合活动流、里程碑和侧栏详情页。默认 `mode='start'` 是贴左侧的常规时间线，不是中轴居中布局；只有 `alternate` / `alternate-reverse` 才会走中轴双侧分布。

## 默认 start 用法

:::demo 最基础的接法是 `title + meta + default` 这三块。默认 `mode='start'` 会把时间线贴左侧展开；比起继续在 `default` 里自己写整块卡片，这种写法更稳定，也更方便后续切到紧凑模式。
timeline/basic
:::

## 分组、布局模式与 reverse

:::demo `xy-timeline-group` 负责分段标题和补充信息。阅读顺序建议先理解默认的 `mode='start'` 左侧单线布局，再看 `mode='end'` 的右侧镜像，最后再用 `alternate` 系列处理双侧中轴场景。`reverse` 会按组整体反转，但不会打乱组内顺序。
timeline/grouped
:::

## 流程态与语义色

:::demo `state` 负责流程语义，`type` 负责视觉语义。下一阶段的活动流和里程碑，都会优先建立在这套组合上。
timeline/state
:::

## 结构化头信息与 dot

:::demo `title / meta / actions / extra` 可以把节点内容拆成稳定区域；`dot` 只替换节点区，不影响内容结构。
timeline/slots
:::

## 紧凑模式

:::demo `density='compact'` 适合抽屉、侧栏和详情区。它缩小的是信息密度，不会改掉 DOM 语义和内容区顺序。
timeline/compact
:::

## 何时使用

- 需要连续表达“发生了什么、谁处理了、什么时候发生”的后台页面。
- 需要在同一套基础能力上同时承接活动流、里程碑和侧栏详情记录。
- 需要分组标题、流程态和结构化区域，但还不想引入专用业务组件。

## API

### Timeline Attributes

| 属性      | 说明                                                                                                                                     | 类型                                                     | 默认值      |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------- |
| `mode`    | 布局模式；推荐按 `start -> end -> alternate -> alternate-reverse` 的顺序理解：`start` 为左侧单线，`end` 为右侧镜像，后两者为中轴双侧布局 | `'start' \| 'alternate' \| 'alternate-reverse' \| 'end'` | `'start'`   |
| `reverse` | 是否反转默认插槽内容顺序                                                                                                                 | `boolean`                                                | `false`     |
| `density` | 信息密度；`compact` 适合抽屉、侧栏和详情区                                                                                               | `'default' \| 'compact'`                                 | `'default'` |

### Timeline Slots

| 插槽      | 说明                                                                             |
| --------- | -------------------------------------------------------------------------------- |
| `default` | 时间线内容，通常传入 `xy-timeline-group`、`xy-timeline-item`，也允许混入普通节点 |

### TimelineGroup Attributes

| 属性          | 说明                   | 类型      | 默认值 |
| ------------- | ---------------------- | --------- | ------ |
| `title`       | 分组标题               | `string`  | `''`   |
| `description` | 分组描述               | `string`  | `''`   |
| `divider`     | 是否显示组头下方分隔线 | `boolean` | `true` |

### TimelineGroup Slots

| 插槽      | 说明                         |
| --------- | ---------------------------- |
| `title`   | 覆盖默认标题区               |
| `extra`   | 组头右侧补充内容             |
| `default` | 组内时间线节点或普通辅助节点 |

### TimelineItem Attributes

| 属性             | 说明                                                                           | 类型                                                                 | 默认值      |
| ---------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------- | ----------- |
| `timestamp`      | 时间戳文案                                                                     | `string`                                                             | `''`        |
| `hide-timestamp` | 是否隐藏时间戳                                                                 | `boolean`                                                            | `false`     |
| `center`         | 是否把时间戳切到对侧并做垂直居中展示；主要用于 `alternate / alternate-reverse` | `boolean`                                                            | `false`     |
| `placement`      | 时间戳在内容区域的位置                                                         | `'top' \| 'bottom'`                                                  | `'bottom'`  |
| `type`           | 节点语义色                                                                     | `'' \| 'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger'` | `''`        |
| `state`          | 流程态；负责 done / current / pending / blocked 这类流程表达                   | `'default' \| 'done' \| 'current' \| 'pending' \| 'blocked'`         | `'default'` |
| `color`          | 自定义节点颜色                                                                 | `string`                                                             | `''`        |
| `size`           | 节点尺寸                                                                       | `'normal' \| 'large'`                                                | `'normal'`  |
| `icon`           | 字符串图标名，内部由 `xy-icon` 渲染                                            | `string`                                                             | `''`        |
| `hollow`         | 是否显示为空心节点；`state='pending'` 时默认会走空心节点                       | `boolean`                                                            | `false`     |

### TimelineItem Slots

| 插槽      | 说明                                     |
| --------- | ---------------------------------------- |
| `title`   | 主标题区                                 |
| `meta`    | 辅助信息区，例如操作者、来源系统、版本号 |
| `actions` | 右侧轻操作区                             |
| `default` | 正文区                                   |
| `extra`   | 正文下方扩展区，例如 diff 摘要、补充说明 |
| `dot`     | 自定义节点；存在时不再渲染默认节点       |

## 使用提示

- `type` 决定视觉语义，`state` 决定流程语义，两者可以并存，不建议互相替代。
- 建议先把 `mode='start'` 当成默认常规时间线理解，再把 `mode='end'` 看作右侧镜像；只有 `alternate` 系列会把节点分布到中轴两侧。
- `TimelineItem` 没有显式 `title` 时，正文区会自动走更稳妥的默认排版，但更推荐优先使用结构化头信息。
- `TimelineGroup` 默认带分隔线；如果是抽屉、侧栏或更轻的分段头，可以把 `divider` 关掉。
- `center` 主要面向 `alternate / alternate-reverse` 这类双侧布局；在 `start / end` 这种单侧布局里会自动回退为普通时间戳显示。
- `reverse` 遇到 `xy-timeline-group` 时会按组整体反转，但组内顺序保持声明顺序。
- `density` 会透传到 `Group` 和 `Item`，所以推荐在根层统一切换，而不是在 demo 或业务页里继续手写紧凑样式。
- `dot` 只替换节点区，不会替换 `title / meta / actions / extra` 这些结构化区域。

## 模式选择建议

- `start`：默认后台时间线，左侧单线布局，适合活动流、审计流和常规详情记录。
- `end`：右侧镜像单线布局，适合需要贴右侧信息区或和左侧主内容配合的页面。
- `alternate`：中轴双侧布局，适合里程碑、阶段流和需要左右对照的说明。
- `alternate-reverse`：和 `alternate` 相同，但首项从右侧起步，适合需要和页面现有节奏反向对齐的版式。
