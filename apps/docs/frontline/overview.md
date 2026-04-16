---
title: 前台实验线总览
description: 用一组偏 Reka UI + shadcn-vue 风格的前台试点组件，验证基础层之外的品牌化表达。
outline: deep
---

# 前台实验线总览

这条实验线暂时不进入 `xiaoye-components` / `xiaoye-pro-components` 的正式公开出口，只在文档站里验证三件事：

1. 基础层之上，是否需要一条独立的前台视觉表达层
2. `button`、`dialog`、`tabs`、`popover`、`select` 这类高频组件，是否值得先试更强的语义化 API
3. 前台风格试点是否能和现有中后台主线共存，而不是互相污染

## 这条线当前怎么理解

- 行为层：继续复用现有基础组件的稳定交互能力
- 风格层：单独用 `@xiaoye/frontline` 包一层更偏品牌站、内容站、SaaS 前台的视觉和轻 API
- 目标：先看方向，不急着做正式产品承诺

## 当前规约

- 控件类优先使用 `variant`，例如 `FrontButton`、`FrontInput`、`FrontSelect`、`FrontTabs`
- 容器或浮层类优先使用 `surface`，例如 `FrontCard`、`FrontDialog`、`FrontPopover`、`FrontDropdown`
- 可交互状态统一尽量暴露为 `data-state`
- 值状态统一尽量暴露为 `data-value-state`
- 图标命名优先使用 `leadingIcon / trailingIcon`，不再继续扩散 `prefix / suffix` 风格命名
- 受控开关类组件统一优先支持 `modelValue + update:modelValue`，并补 `openChange` 这类语义事件作为辅助

如果要看完整规则，继续看 [实验线规约](/frontline/conventions)。
如果要看第一轮沉淀判断，继续看 [产品线准入清单](/frontline/admission-checklist)。
如果要看未来正式发布方向，继续看 [正式出口草案](/frontline/formal-export-plan)。
如果要看容器和浮层的主体结构，继续看 [容器 Anatomy](/frontline/container-anatomy)。
如果要看下拉、搜索和命令层的分层，继续看 [搜索与菜单 Anatomy](/frontline/search-anatomy)。
如果要看逐组件边界，继续看 [API 边界清单](/frontline/api-boundary)。
如果要看兼容命名的退出路径，继续看 [废弃计划](/frontline/deprecation-plan)。

## 试点组件

### FrontButton

:::demo 这一版先验证 `variant + tone` 语义是否比当前基础层更适合前台主按钮、次按钮和轻动作的表达。
frontline/button
:::

### FrontDialog

:::demo Dialog 不先追求 primitive 化，而是先验证“前台弹层”是否需要更强的标题区、描述区和浮层质感。
frontline/dialog
:::

### FrontTabs

:::demo Tabs 先试三种更偏前台产品页的表达：`underline`、`pill`、`segmented`。
frontline/tabs
:::

### FrontPopover

:::demo Popover 先看轻内容解释、定价说明、局部提示这类前台常见场景，而不是后台说明块。
frontline/popover
:::

### FrontSelect

:::demo Select 先试更轻、更圆润、更适合前台页面的输入外观，同时保留现有基础层交互。
frontline/select
:::

### FrontInput

:::demo Input 是这条实验线从“控件换皮”走向“页面骨架”的关键一步，因为 hero 表单、订阅条和账户设置区都离不开它。
frontline/input
:::

### FrontCard

:::demo Card 用来验证前台内容块的层次、呼吸感和标题节奏，而不只是把后台卡片改成更圆的外观。
frontline/card
:::

### FrontDropdown

:::demo Dropdown 先承接前台站点里的资源入口、方案菜单和次级动作，不急着在这一轮把它升级成 command palette。
frontline/dropdown
:::

### FrontMenu

:::demo Menu 现在优先承担 `group / item / shortcut / empty` 这层结果 anatomy，让 SearchPanel 和 Command 不再把结果细节重新写一遍。
frontline/menu
:::

### FrontCommand

:::demo Command 先验证“搜索入口 + 命令结果 + 键盘路径”能不能作为这条实验线的下一步 primitives。
frontline/command
:::

### FrontSearchPanel

:::demo Search Panel 适合放在 landing、docs 或 account 页面里，先承接轻量搜索，再决定是否升级成更强的 command 体系。
frontline/search-panel
:::

## 当前判断标准

- 如果这 11 个组件在文档里看起来只是“换皮”，那说明这条产品线还不成立
- 如果它们能稳定承接前台首页、内容详情、定价页、用户中心这类页面，才值得继续往前推进
- 这一轮已经继续补了 `menu / command / search panel`，下一步更值得收的是规约而不是数量
- 这一轮已经继续补了 `input`、`card`、`dropdown`，并开始试 `command / menu / search panel` 方向

## 下一步入口

- 如果你想继续看单组件试点，先留在这页
- 如果你想直接判断这条实验线有没有页面语言，继续看 [前台页面样板](/frontline/showcase)
