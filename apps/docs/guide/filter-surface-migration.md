---
title: 筛选面板收口指南
description: 面向后台项目的筛选条与输入浮层收口入口索引，优先减少页面级 deep 覆盖。
outline: deep
---

# 筛选面板收口指南

这页只解决一类问题：后台项目里最常见的筛选条、搜索条和输入浮层，应该优先怎么收口，避免继续在页面层 deep 到内部类名。

如果你还没看过总迁移策略，先读 [后台迁移指南](/guide/backend-migration)。如果你已经知道自己主要在处理筛选条，这页可以直接当操作索引用。

## 先判断这是不是组件库层问题

下面这些现象，默认都先判断为“组件库公开入口没被正确使用”或“历史页面覆盖还没回收”，而不是先去业务页继续补样式：

- 下拉面板、日期面板、时间面板、树筛选面板看起来不像一套主题。
- 业务页里还在大量写 `:deep(.xy-*-dropdown)`、`__option`、`__cell`、`__search`、`__trigger` 这类类名。
- 主题切换后，筛选区只有个别组件还保留旧亮底、旧阴影、旧边框。
- 页面只是想让筛选条更克制一点，却在每个组件上单独调 trigger、option、shortcut、search item。

一句话判断：

- 如果你改的是“背景、边框、阴影、圆角、hover、selected、快捷项、搜索区、列区层次”，先回到组件库实例级入口。
- 如果你改的是“页面布局、业务字段排列、动作区位置、表单协议”，那才更可能属于业务页。

## 推荐收口顺序

1. 先删页面层对面板本体的覆盖：
   - `dropdown / panel / popper / search / option / cell / shortcut / column`
2. 再看组件库默认基线是否已满足页面。
3. 仍需微调时，只在实例级入口或页面 wrapper 上接 token。
4. 最后才考虑是否真的需要业务局部样式。

不建议的顺序是：

1. 保留旧 deep 覆盖
2. 再叠一层 `popper-class`
3. 最后分不清到底哪一层在生效

## 统一收口入口

筛选链路里最常用的组件，当前推荐入口如下：

| 组件 | 优先入口 | 不建议继续 deep 的位置 |
| --- | --- | --- |
| `select` | `popper-class`、`popper-style`、`dropdown-min-width / dropdown-max-width` | `__dropdown / __option / __group` |
| `auto-complete` | `popper-class`、`popper-style`、`dropdown-min-width / dropdown-max-width` | `__option / __loading / __empty` |
| `date-picker` | 面板实例级变量、wrapper token | `__panel / __shortcut / __cell / __header` |
| `time-picker` | 面板实例级变量、wrapper token | `__panel / __column / __action` |
| `time-select` | 组件实例级入口、wrapper token | `__dropdown / __option / __trigger` |
| `tree-select` | `popper-class`、`popper-style` | `__dropdown / __tree / __search` |
| `cascader` | `popper-class`、`popper-style` | `__dropdown / __columns / __option / __search-results` |

## 推荐阅读顺序

如果你是从业务项目回过来收口后台筛选区，建议按下面顺序读：

1. [后台迁移指南](/guide/backend-migration)
2. [Select 选择器](/components/select)
3. [DatePicker 日期选择器](/components/date-picker)
4. [TimePicker 时间选择器](/components/time-picker)
5. [TimeSelect 时间选择](/components/time-select)
6. [AutoComplete 自动完成](/components/auto-complete)
7. [TreeSelect 树选择](/components/tree-select)
8. [Cascader 级联选择](/components/cascader)

如果你主要是在收轻交互浮层，而不是值选择，也一并看：

- [Tooltip 文字提示](/components/tooltip)
- [Popover 气泡卡片](/components/popover)
- [Dropdown 下拉菜单](/components/dropdown)

## 可直接抄的示例入口

这批组件已经有“实例级样式收口”示例，可以直接对照改：

| 场景 | 示例 |
| --- | --- |
| 通用提示浮层 | [tooltip/popper-class](/components/tooltip#实例级样式收口) |
| 单选下拉 | [select/popper-class](/components/select#实例级样式收口) |
| 日期面板 | [date-picker/popper-class](/components/date-picker#实例级样式收口) |
| 联想输入 | [auto-complete/popper-class](/components/auto-complete#实例级样式收口) |
| 树筛选 | [tree-select/popper-class](/components/tree-select#实例级样式收口) |
| 级联选择 | [cascader/popper-class](/components/cascader#实例级样式收口) |
| 轻交互卡片 | [popover/popper-class](/components/popover#实例级样式收口) |
| 操作菜单 | [dropdown/popper-class](/components/dropdown#实例级样式收口) |

## 页面 wrapper 的使用边界

如果页面只是做主题接轨，优先在筛选条外层 wrapper 上接少量全局 token，而不是继续 deep 单个组件内部类名。

示例：

```vue
<template>
  <div class="filter-shell">
    <xy-select />
    <xy-date-picker />
    <xy-time-select />
    <xy-tree-select />
  </div>
</template>

<style scoped>
.filter-shell {
  --xy-bg-color-elevated: var(--bg-elevated);
  --xy-border-color-strong: var(--border-strong);
}
</style>
```

这个 wrapper 适合做：

- 页面主题接轨
- 少量全局亮暗色过渡
- 多个筛选组件共享的边框强度和背景层次

这个 wrapper 不适合做：

- 继续 deep 到 `__dropdown / __option / __cell / __search`
- 为单个组件写一整套结构样式
- 把本该由组件实例级变量解决的问题重新拉回页面层

## 常见误用

### 用 `dropdown` 代替值选择器

如果你处理的是“状态筛选、枚举值选择、层级选择”，优先回到：

- `select`
- `tree-select`
- `cascader`

不要因为 `dropdown` 容易写，就在页面层拿它代替值选择器，再额外补大量样式。

### 把时间和日期面板拆成很多局部补丁

如果问题只是“时间/日期面板比其他下拉更重、更亮、不像一套”，优先统一面板变量和 wrapper token，不要分别修：

- 日期格
- 快捷项
- 时间列
- 操作区

### 先写 `popper-class`，但旧 deep 覆盖没删

这是最常见的伪收口。正确顺序是：

1. 先删旧 deep 覆盖
2. 再观察组件库默认态
3. 最后补实例级入口

## 联调时怎么判断算收口成功

满足下面几点，通常就说明这批筛选区已经基本回到组件库层：

- 主题切换后，输入浮层看起来属于同一套背景、边框和阴影体系。
- 业务页不再依赖大量 `:deep(.xy-*)` 去修 option、cell、search、shortcut。
- 页面仍保留少量 wrapper token，但不再反向绑定内部 DOM 结构。
- 需要微调时，优先能在组件实例或示例里找到对应入口，而不是重新开一层页面补丁。

## 这次后台联调里已经验证的模式

这次对后台项目做只读审计后，筛选链路里已经能确认两类模式：

### 可以保留

- 页面 wrapper 上的 token 接轨
- 组件实例上的 `popper-class`
- 业务自定义 `body-class` 或自定义 class，再配合 scoped 样式命中这个业务类名

### 下一批仍应继续收口

- 全局 `.xy-dialog` 根类覆盖带出来的统一弹窗尺寸和圆角规则
- 全局 `.xy-table` 根类覆盖带出来的移动端滚动/布局规则
- 任何继续命中 `__dropdown / __option / __search / __cell / __column` 的旧式页面级覆盖

所以这轮之后的迁移重点已经很明确：

- 不要再把 wrapper token 当成“旧补丁”
- 真正该继续收的是“全局根类直改组件表现”和“内部结构类名覆盖”
