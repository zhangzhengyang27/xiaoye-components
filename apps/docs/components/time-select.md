---
title: TimeSelect 时间选择
description: 固定时间点下拉选择，适合预约、营业时间和开始/结束时间联动。
outline: deep
---

# TimeSelect 时间选择

`xy-time-select` 用于固定步长时间点选择，如预约时段、营业窗口、配送时间等"整点或半点"场景。当你需要自由输入时分秒时用 `xy-time-picker`；需要日期时用 `xy-date-picker`。

## 实例级样式收口

- 后台项目如果只是想收口时间下拉面板的背景、边框、阴影和密度，优先使用 `popper-class`、`popper-style`，不要在页面层 deep 到 trigger、dropdown 和 option 的内部类名。
- TimeSelect 本质上也是筛选条/表单里的输入浮层，建议与 Select、DatePicker 保持同一套收口方式。

## 基础用法

:::demo 默认以 `09:00 - 18:00`、`30 分钟`步长生成选项，回写格式默认为 `HH:mm`。
time-select/basic
:::

## 开始 / 结束时间联动

:::demo 通过 `min-time` 和 `max-time` 可以快速搭出开始时间与结束时间的相互约束。
time-select/range
:::

## 时间格式与包含结束时间

:::demo `format` 可以把展示值切到 12 小时制，`include-end-time` 适合保留最后一个截止时间点。
time-select/format
:::

## 表单场景

:::demo 放在 `xy-form-item` 内部时，TimeSelect 会接入 `change / blur` 校验链路。
time-select/form
:::

## 受控回填与快捷打开

:::demo 通过 expose 的 `open / close` 和外部回填值，可以接进筛选栏快捷操作、默认时间回填和批量预约流程。
time-select/controlled
:::

## 组件边界与场景选择

- **TimeSelect**：固定步长时间点选择，值是离散时间字符串。适合预约时段、营业窗口、配送时间这类只需要从预设列表选一个时间点的场景。
- **TimePicker**：时分秒自由输入选择，值是时间字符串或时间范围数组。适合需要精确到秒、分钟，或有复杂禁用规则的场景。
- **DatePicker**：日期粒度选择，值是日期字符串。需要"哪一天"而非"几点"时用 DatePicker。
- 如果你需要"预约 10:00 / 10:30 / 11:00"这类固定时间点，用 TimeSelect；如果需要自由输入任意时间或禁用特定时分秒，用 TimePicker。

## 值形态

### model-value 类型

- `TimeSelectValue` = `string | null`
- 值始终是单个时间字符串（如 `'09:30'`），不支持范围模式和多选
- `format` 同时控制展示格式和输出值格式，默认 `'HH:mm'`
- 清空后值为 `null`

### start / end / step 的行为

- `start`：列表起始时间，默认 `'09:00'`
- `end`：列表截止时间，默认 `'18:00'`
- `step`：步长间隔，默认 `'00:30'`（30 分钟）
- `include-end-time`：默认 `false`，如果设为 `true`，会额外把 `end` 时间点也纳入选项列表
- 这三个属性只影响选项列表的生成，不会自动清空已有的 `model-value`

### min-time / max-time 的行为

- `min-time` / `max-time`：控制选项的禁用态，不在可选范围内的选项会被标记为 `disabled`
- 它们不会自动清空已有值——如果当前 `model-value` 被新约束排除，它仍然是选中状态但会在 UI 上体现为禁用
- 典型用法：开始时间选择后，将 `max-time` 绑定为开始时间，实现"结束时间不能早于开始时间"

## 行为约定与优先级

- `ArrowDown / ArrowUp / Home / End` 在菜单项之间移动。
- `Enter / Space` 在打开状态下选择当前高亮项。
- `Escape` 关闭面板并把焦点还给触发器。
- `min-time / max-time` 只控制禁用态，不会自动清空当前已有值。
- `clearable` 会清空值（回到 `null`）。
- `validate-event` 控制是否在 `change / blur` 时触发表单校验，默认 `true`。

## 命名映射

Vue 模板中 props 和 events 使用 kebab-case，源码 / TS 类型层使用 camelCase，两者由 Vue 自动转换，等价：

### Props 映射

| 模板写法（kebab-case）   | 源码 / TS 写法（camelCase） |
| ------------------------ | --------------------------- |
| `model-value`            | `modelValue`                |
| `min-time`               | `minTime`                   |
| `max-time`               | `maxTime`                   |
| `include-end-time`       | `includeEndTime`            |
| `validate-event`         | `validateEvent`             |
| `append-to`              | `appendTo`                  |
| `popper-class`           | `popperClass`               |
| `popper-style`           | `popperStyle`               |

其余属性（`placeholder`、`disabled`、`clearable`、`size`、`start`、`end`、`step`、`format`、`teleported`、`placement`）为单词形式，模板与源码写法一致。

### Events 映射

| 模板写法（kebab-case） | 源码 emit 写法（camelCase） |
| ---------------------- | --------------------------- |
| `update:model-value`   | `update:modelValue`         |
| `visible-change`       | `visibleChange`             |

其余事件（`change`、`clear`、`focus`、`blur`）为单单词，模板与源码写法一致。

下方 API 表格统一按模板层推荐写法列出。

## API

### TimeSelect Attributes

| 属性               | 说明                   | 类型             | 默认值         |
| ------------------ | ---------------------- | ---------------- | -------------- |
| `model-value`      | 当前选中值             | `string \| null` | `null`         |
| `placeholder`      | 占位提示               | `string`         | `'请选择时间'` |
| `disabled`         | 是否禁用               | `boolean`        | `false`        |
| `clearable`        | 是否允许清空           | `boolean`        | `false`        |
| `size`             | 组件尺寸               | `ComponentSize`  | 跟随全局配置   |
| `start`            | 开始时间               | `string`         | `'09:00'`      |
| `end`              | 结束时间               | `string`         | `'18:00'`      |
| `step`             | 步长                   | `string`         | `'00:30'`      |
| `min-time`         | 最小可选时间           | `string`         | —              |
| `max-time`         | 最大可选时间           | `string`         | —              |
| `include-end-time` | 是否把结束时间纳入选项 | `boolean`        | `false`        |
| `format`           | 展示与回传格式         | `string`         | `'HH:mm'`      |
| `validate-event`   | 是否触发表单校验       | `boolean`        | `true`         |
| `teleported`       | 是否把面板传送到 `body` | `boolean`       | `true`         |
| `append-to`        | 面板挂载目标           | `string \| HTMLElement` | `'body'` |
| `placement`        | 面板弹出位置           | `Placement`     | `'bottom-start'` |
| `popper-class`     | 面板自定义类名         | `string`        | `''`           |
| `popper-style`     | 面板自定义样式         | `StyleValue`    | `undefined`    |

### TimeSelect Events

| 事件                 | 说明               | 参数             |
| -------------------- | ------------------ | ---------------- |
| `update:model-value` | 选中值变化时触发   | `TimeSelectValueChangeHandler` |
| `change`             | 选中时间项或点击清空后触发 | `TimeSelectValueChangeHandler` |
| `clear`              | 点击清空按钮时触发 | —                |
| `visible-change`     | 面板显隐变化时触发 | `TimeSelectVisibleChangeHandler`        |
| `focus`              | 打开面板时触发     | —                |
| `blur`               | 面板关闭时触发     | —                |

### TimeSelect Exposes

| 暴露项  | 说明               | 类型                  |
| ------- | ------------------ | --------------------- |
| `focus` | 聚焦触发器         | `TimeSelectInstance["focus"]` |
| `blur`  | 关闭并让触发器失焦 | `TimeSelectInstance["blur"]` |
| `open`  | 打开下拉面板       | `TimeSelectInstance["open"]` |
| `close` | 关闭下拉面板       | `TimeSelectInstance["close"]` |
