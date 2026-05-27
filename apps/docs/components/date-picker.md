---
title: DatePicker 日期选择器
description: 中后台筛选栏和表单中的日期选择组件，支持日/范围/月/年/周模式。
outline: deep
---

# DatePicker 日期选择器

`xy-date-picker` 是中后台筛选栏和表单中的日期录入组件。当前版本已统一为一套选择器，通过 `type` 切换支持单值、范围、月份、年份和周选择。当你需要时分秒时用 `xy-time-picker`；需要固定步长时间点时用 `xy-time-select`。

## 基础用法

:::demo 最常见的用法是绑定一个 `YYYY-MM-DD` 字符串，并允许用户清空选择。
date-picker/basic
:::

## 可选范围限制

:::demo `min` 和 `max` 用来限制可选日期范围，适合筛选栏里只允许选择某个时间窗口的场景。
date-picker/limit
:::

## 范围选择

:::demo 把 `type` 设为 `daterange` 后，会输出 `[start, end]` 形式的字符串数组。
date-picker/range
:::

## 月份、年份与周

:::demo `type` 可以切到 `month / year / week`，用同一套触发器承载不同粒度的日期值。
date-picker/modes
:::

## 快捷项

:::demo `shortcuts` 适合筛选栏里常见的“今天”“最近一周”这类快速录入。
date-picker/shortcuts
:::

## 实例级样式收口

:::demo 当后台项目只想让日期面板更贴近当前主题时，优先通过 `popper-class` / `popper-style` 收口面板、快捷项和日期格视觉，不要 deep 到内部类名。
date-picker/popper-class
:::

## 表单场景

:::demo DatePicker 放在 `xy-form-item` 内部时，会参与 `change / blur` 校验。
date-picker/form
:::

## 组件边界与场景选择

- **DatePicker**：日期粒度选择（日/月/年/周/范围），值是日期字符串或日期范围数组。适合订单日期、统计周期、报告月份等场景。
- **TimePicker**：时分秒自由输入选择，值是时间字符串或时间范围数组。适合提醒时间、排班起始点等需要精确到秒/分钟的场景。
- **TimeSelect**：固定步长时间点选择，值是离散时间字符串。适合预约时段、营业窗口这类"整点或半点"场景。
- 如果你需要日期+时间的完整录入，用 DatePicker + TimePicker 组合；如果只需要固定时间点列表，优先用 TimeSelect。

## type 场景映射

| `type` 值 | 适用场景 | 输出值形态 |
| --- | --- | --- |
| `'date'` | 订单日期、筛选日期 | `string`（如 `'2025-05-23'`） |
| `'daterange'` | 统计周期、报告时间窗口 | `[string, string]` |
| `'month'` | 月度统计、月度报告 | `string`（如 `'2025-05'`） |
| `'year'` | 年度统计 | `string`（如 `'2025'`） |
| `'week'` | 周度统计 | `string`（格式取决于 `value-format`） |

## 值形态

### model-value 类型

- `DatePickerValue` = `string | [string, string] | null`
- 单值模式（`date / month / year / week`）：值为单个日期字符串
- 范围模式（`daterange`）：值为 `[start, end]` 二元数组
- 清空后值为 `null`

### format 与 value-format 的区别

- **`format`**：控制触发器中日期的**展示格式**，如 `YYYY年MM月DD日`。只影响显示，不影响输出值。
- **`value-format`**：控制 `model-value` 的**输出格式**，如 `YYYY-MM-DD`。决定对外 emit 的值字符串格式。
- 如果不传 `value-format`，默认跟随 `type` 对应的标准格式（`date` → `YYYY-MM-DD`，`month` → `YYYY-MM`，`year` → `YYYY`）。
- 典型用法：`format="YYYY/MM/DD"` + `value-format="YYYY-MM-DD"` → 触发器显示 `2025/05/23`，但 model-value 仍然是 `2025-05-23`。

### min / max 与 disabled-date 的区别

- **`min` / `max`**：字符串形式的全局可选日期范围边界，适合"只允许选近 30 天"这类固定窗口。
- **`disabled-date`**：函数形式 `(date: Date) => boolean`，适合更复杂的禁用逻辑（如禁用周末、禁用特定节假日）。
- 两者可以同时使用，取并集：被 `min/max` 排除的日期会被禁用，被 `disabled-date` 返回 `true` 的日期也会被禁用。

## 键盘与行为约定

- 触发器支持 `Enter / Space / ArrowDown` 打开面板。
- 面板中支持方向键移动日期，`Enter / Space` 选中，`Escape` 关闭。
- `type="daterange"` 时，值会按 `[start, end]` 输出。
- `shortcuts` 只负责快速写值，不改变当前 `type`。

## 命名映射

Vue 模板中 props 和 events 使用 kebab-case，源码 / TS 类型层使用 camelCase，两者由 Vue 自动转换，等价：

### Props 映射

| 模板写法（kebab-case）   | 源码 / TS 写法（camelCase） |
| ------------------------ | --------------------------- |
| `model-value`            | `modelValue`                |
| `value-format`           | `valueFormat`               |
| `disabled-date`          | `disabledDate`              |
| `prefix-icon`            | `prefixIcon`                |
| `suffix-icon`            | `suffixIcon`                |
| `clear-icon`             | `clearIcon`                 |
| `popper-class`           | `popperClass`               |
| `popper-style`           | `popperStyle`               |
| `append-to`              | `appendTo`                  |

其余属性（`type`、`placeholder`、`disabled`、`clearable`、`size`、`min`、`max`、`format`、`shortcuts`、`separator`、`editable`、`teleported`、`placement`）为单词形式，模板与源码写法一致。

### Events 映射

| 模板写法（kebab-case） | 源码 emit 写法（camelCase） |
| ---------------------- | --------------------------- |
| `update:model-value`   | `update:modelValue`         |
| `visible-change`       | `visibleChange`             |

其余事件（`change`、`clear`、`focus`、`blur`）为单单词，模板与源码写法一致。

下方 API 表格统一按模板层推荐写法列出。

## API

### DatePicker Attributes

| 属性          | 说明                         | 类型                | 默认值         |
| ------------- | ---------------------------- | ------------------- | -------------- |
| `model-value` | 当前值                         | `string \| [string, string] \| null` | `null` |
| `type`        | 选择类型                       | `'date' \| 'daterange' \| 'month' \| 'year' \| 'week'` | `'date'` |
| `placeholder` | 占位文本                     | `string \| string[]` | `'请选择日期'` |
| `disabled`    | 是否禁用                     | `boolean`           | `false`        |
| `clearable`   | 是否支持清空                 | `boolean`           | `false`        |
| `size`        | 组件尺寸                     | `ComponentSize` | 跟随全局配置 |
| `min`         | 最小可选日期                 | `string`            | `undefined`    |
| `max`         | 最大可选日期                 | `string`            | `undefined`    |
| `format`      | 展示格式                     | `string`            | 跟随 `type` 默认格式 |
| `value-format`| 输出值格式                   | `string`            | 跟随 `type` 默认格式 |
| `shortcuts`   | 快捷项                       | `DatePickerShortcut[]` | `[]`        |
| `disabled-date` | 自定义禁用日期             | `(date: Date) => boolean` | `undefined` |
| `separator`   | 范围模式分隔符（当前版本未生效，面板固定使用"至"） | `string` | `undefined` |
| `editable`    | 是否允许手动输入（当前版本未生效） | `boolean`           | `undefined` |
| `prefix-icon` | 触发器前置图标（当前版本未生效） | `string`            | `undefined` |
| `suffix-icon` | 触发器后置图标（当前版本未生效，面板固定使用日历图标） | `string` | `undefined` |
| `clear-icon`  | 清空图标（当前版本未生效，固定使用 `mdi:close-circle`） | `string` | `undefined` |
| `teleported`  | 是否把面板传送到 `body`      | `boolean`           | `true`        |
| `append-to`   | 面板挂载目标                 | `string \| HTMLElement` | `'body'`   |
| `placement`   | 面板弹出位置                 | `Placement`         | `'bottom-start'` |
| `popper-class` | 面板自定义类名              | `string`            | `''`          |
| `popper-style` | 面板自定义样式              | `StyleValue`        | `undefined`   |

### DatePicker Events

| 事件                 | 说明               | 参数                   |
| -------------------- | ------------------ | ---------------------- |
| `update:model-value` | 更新日期值         | `DatePickerValueChangeHandler` |
| `change`             | 选中值变化         | `DatePickerValueChangeHandler` |
| `clear`              | 清空日期           | —                      |
| `visible-change`     | 面板开关状态       | `DatePickerVisibleChangeHandler`              |
| `focus`              | 打开面板时触发     | —                      |
| `blur`               | 关闭面板时触发     | —                      |
