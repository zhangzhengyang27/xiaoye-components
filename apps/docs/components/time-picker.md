---
title: TimePicker 时间选择器
description: 支持单值、范围和格式化显示的时间选择器。
outline: deep
---

# TimePicker 时间选择器

`xy-time-picker` 是时分秒自由输入选择器，适合提醒时间、营业时段、排班时间和后台配置里的时分秒选择。当你需要日期时用 `xy-date-picker`；需要固定步长时间点（如 09:00、09:30、10:00）时用 `xy-time-select`。

## 实例级样式收口

- 后台项目如果只是想收口时间面板的背景、边框、阴影和列区层次，优先使用 `popper-class`、`popper-style`，不要在页面层 deep 到 trigger、panel 和每一列滚动区的内部类名。
- TimePicker 和 DatePicker / TimeSelect / Select 一样，都是筛选条与表单里的输入浮层；如果它们看起来不像一套，优先回到组件库层统一视觉合同。

## 基础用法

:::demo 绑定一个时间字符串，默认格式为 `HH:mm:ss`。
time-picker/basic
:::

## HH:mm 精简时间

:::demo 只保留小时和分钟时，适合提醒时间、预约时间和排班起始点这类不关心秒位的场景。
time-picker/hhmm
:::

## 禁用时分秒

:::demo 通过 `disabled-hours / disabled-minutes / disabled-seconds` 分别控制不可选的时段、分钟和秒位。
time-picker/disabled-sections
:::

## 范围选择

:::demo 开启 `is-range` 后，会输出 `[start, end]` 形式的时间数组，适合营业窗口和值班时段。
time-picker/range
:::

## 表单场景

:::demo TimePicker 放在 `xy-form-item` 内时，会参与 `change / blur` 校验链路。
time-picker/form
:::

## 组件边界与场景选择

- **TimePicker**：时分秒自由输入选择，值是时间字符串或时间范围数组。适合需要精确到秒或分钟的时间选择，如提醒时间、排班起始时间。
- **TimeSelect**：固定步长时间点选择，值是离散时间字符串。适合预约时段、营业窗口这类"整点或半点"场景，不需要自由输入。
- **DatePicker**：日期粒度选择，值是日期字符串。如果需要选择"哪一天"而非"几点"，用 DatePicker。
- 如果需要日期+时间，用 DatePicker + TimePicker 组合；如果只需要固定时间点列表，优先用 TimeSelect。

## 值形态

### model-value 类型

- `TimePickerValue` = `string | [string, string] | null`
- 单值模式（默认）：值为单个时间字符串，如 `'12:30:00'`
- 范围模式（`is-range`）：值为 `[start, end]` 二元数组，如 `['09:00:00', '18:00:00']`
- 清空后值为 `null`

### is-range 范围模式

- 开启 `is-range` 后，触发器变为双输入框，值变为 `[string, string]`。
- `start-placeholder` / `end-placeholder` 分别设置两端占位文本。
- 确认时如果开始时间晚于结束时间，会自动按从早到晚排序。

### 禁用函数签名

- `disabled-hours`：`() => number[]` — 返回需要禁用的小时编号列表
- `disabled-minutes`：`(hour: number) => number[]` — 返回需要禁用的分钟编号列表，参数为当前选中小时
- `disabled-seconds`：`(hour: number, minute: number) => number[]` — 返回需要禁用的秒编号列表，参数为当前选中小时和分钟
- 范围模式下，两组列共享同一套 `disabled-hours / disabled-minutes / disabled-seconds` 函数

## 行为约定与优先级

- 触发器支持 `Enter / Space / ArrowDown` 打开面板。
- 面板内支持 `Enter` 确认当前草稿时间，`Escape` 关闭面板。
- `format="HH:mm"` 时不渲染秒列，输出值也会同步去掉秒位。
- `is-range` 模式下若开始时间晚于结束时间，确认时会自动按从早到晚排序。
- `clearable` 会清空值（回到 `null`），在范围模式下会同时清空两端。
- TimePicker 通过 `disabled-hours / disabled-minutes / disabled-seconds` 禁用时段，不支持 `min / max` 范围约束（如需时间范围边界，改用 TimeSelect 的 `min-time / max-time`）。
- `validate-event` 控制是否在 `change / blur` 时触发表单校验，默认 `true`。

## 命名映射

Vue 模板中 props 和 events 使用 kebab-case，源码 / TS 类型层使用 camelCase，两者由 Vue 自动转换，等价：

### Props 映射

| 模板写法（kebab-case）   | 源码 / TS 写法（camelCase） |
| ------------------------ | --------------------------- |
| `model-value`            | `modelValue`                |
| `start-placeholder`      | `startPlaceholder`          |
| `end-placeholder`        | `endPlaceholder`            |
| `is-range`               | `isRange`                   |
| `validate-event`         | `validateEvent`             |
| `disabled-hours`         | `disabledHours`             |
| `disabled-minutes`       | `disabledMinutes`           |
| `disabled-seconds`       | `disabledSeconds`           |
| `append-to`              | `appendTo`                  |
| `popper-class`           | `popperClass`               |
| `popper-style`           | `popperStyle`               |

其余属性（`placeholder`、`disabled`、`clearable`、`size`、`format`、`teleported`、`placement`）为单词形式，模板与源码写法一致。

### Events 映射

| 模板写法（kebab-case） | 源码 emit 写法（camelCase） |
| ---------------------- | --------------------------- |
| `update:model-value`   | `update:modelValue`         |
| `visible-change`       | `visibleChange`             |

其余事件（`change`、`clear`、`focus`、`blur`）为单单词，模板与源码写法一致。

下方 API 表格统一按模板层推荐写法列出。

## API

### TimePicker Attributes

| 属性                | 说明             | 类型                                         | 默认值         |
| ------------------- | ---------------- | -------------------------------------------- | -------------- |
| `model-value`       | 当前值           | `string \| [string, string] \| null`         | `null`         |
| `placeholder`       | 单值占位文本     | `string`                                     | `'请选择时间'` |
| `start-placeholder` | 范围开始占位文本 | `string`                                     | `'开始时间'`   |
| `end-placeholder`   | 范围结束占位文本 | `string`                                     | `'结束时间'`   |
| `disabled`          | 是否禁用         | `boolean`                                    | `false`        |
| `clearable`         | 是否支持清空     | `boolean`                                    | `false`        |
| `size`              | 组件尺寸         | `ComponentSize`                              | 跟随全局配置   |
| `format`            | 显示与输出格式   | `string`                                     | `'HH:mm:ss'`   |
| `is-range`          | 是否开启范围选择 | `boolean`                                    | `false`        |
| `validate-event`    | 是否触发表单校验 | `boolean`                                    | `true`         |
| `disabled-hours`    | 禁用小时         | `() => number[]`                             | `undefined`    |
| `disabled-minutes`  | 禁用分钟         | `(hour: number) => number[]`                 | `undefined`    |
| `disabled-seconds`  | 禁用秒           | `(hour: number, minute: number) => number[]` | `undefined`    |
| `teleported`        | 是否把面板传送到 `body` | `boolean`                             | `true`         |
| `append-to`         | 面板挂载目标     | `string \| HTMLElement`                      | `'body'`       |
| `placement`         | 面板弹出位置     | `Placement`                                  | `'bottom-start'` |
| `popper-class`      | 面板自定义类名   | `string`                                     | `''`           |
| `popper-style`      | 面板自定义样式   | `StyleValue`                                 | `undefined`    |

### TimePicker Events

| 事件                 | 说明         | 参数                                 |
| -------------------- | ------------ | ------------------------------------ |
| `update:model-value` | 更新时间值   | `TimePickerModelValueChangeHandler` |
| `change`             | 确认值变化   | `TimePickerChangeHandler` |
| `clear`              | 点击清空按钮时触发 | —                                |
| `visible-change`     | 面板开关状态 | `TimePickerVisibleChangeHandler`                            |
| `focus`              | 打开面板触发 | —                                    |
| `blur`               | 关闭面板触发 | —                                    |
