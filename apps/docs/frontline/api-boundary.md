---
title: API 边界清单
description: 逐个列出 frontline 实验线组件的主命名、兼容命名和当前边界，避免后续继续发散。
outline: deep
---

# API 边界清单

这页只做一件事：把 `frontline` 当前 11 个组件的 API 边界写清楚。

## 读这页时怎么理解

- 主命名：后续继续扩展时优先使用的命名
- 兼容命名：当前仍然支持，但不建议继续推广的命名
- 计划废弃：下一阶段可以开始进入 `@deprecated` 或文档降级的项目
- 类型降级：是否已经在 props 类型里明确补了 `@deprecated`
- 运行时提醒：是否已经在开发态对旧写法给出 warning

## 控件类

| 组件 | 主命名 | 兼容命名 | 类型降级 | 运行时提醒 | 当前边界 | 计划废弃 |
| --- | --- | --- | --- | --- | --- | --- |
| `FrontButton` | `variant` `tone` `leadingIcon` `trailingIcon` `leading` `trailing` | `prefix` `suffix` slot | 不适用 | 已补 | 主体内容仍然走默认 slot，按钮不引入 `content` | `prefix` `suffix` slot |
| `FrontInput` | `variant` `size` `leadingIcon` `trailingIcon` `leading` `trailing` | `prefixIcon` `suffixIcon` `prefix` `suffix` | 已补 | 已补 | 输入值事件仍保留 `input / change`，不往 `select` 靠 | `prefixIcon` `suffixIcon` `prefix` `suffix` |
| `FrontSelect` | `variant` `size` `leadingIcon` `trailingIcon` `openChange` `searchChange` | `prefixIcon` `suffixIcon` `prefix` `suffix` | 已补 | 已补 | `change` 仍保留给值变化；开关态统一走 `openChange` | `prefixIcon` `suffixIcon` `prefix` `suffix` |
| `FrontTabs` | `variant` `modelValue` `update:modelValue` | 无 | 不适用 | 无 | 面板内容当前用具名 slot 承接，不再加 `content` 别名 | 暂无 |

## 容器与浮层类

| 组件 | 主命名 | 兼容命名 | 类型降级 | 运行时提醒 | 当前边界 | 计划废弃 |
| --- | --- | --- | --- | --- | --- | --- |
| `FrontCard` | `surface` `header` `content` `footer` `actions` | 默认 slot 作为 `content` 兼容 | 不适用 | 冲突输入已补 | 容器类只暴露结构，不承担业务行为事件 | 默认 slot 直接承载主体内容 |
| `FrontDialog` | `surface` `modelValue` `update:modelValue` `openChange` `header` `content` `footer` | 默认 slot 作为 `content` 兼容 | 不适用 | 冲突输入已补 | `openChange` 只表达开关态，不承担业务确认事件 | 默认 slot 直接承载主体内容 |
| `FrontPopover` | `surface` `modelValue` `update:modelValue` `openChange` `trigger` `header` `content` | 默认 slot 作为 `content` 兼容 | 不适用 | 冲突输入已补 | Popover 仍允许 `content` prop，但结构化内容优先走 slot | 纯文本 `content` prop 在复杂场景里的推广 |
| `FrontDropdown` | `surface` `modelValue` `update:modelValue` `openChange` `select` `command` `trigger` `content` | 默认 slot 作为 `trigger` 兼容，`dropdown` slot 作为 `content` 兼容 | 不适用 | 冲突输入已补 | `select` 表达选中项，`command` 表达动作值，两者不混用 | 默认 trigger、`dropdown` slot |

## 搜索与命令类

| 组件 | 主命名 | 兼容命名 | 类型降级 | 运行时提醒 | 当前边界 | 计划废弃 |
| --- | --- | --- | --- | --- | --- | --- |
| `FrontMenu` | `select` `activeKey` `group` `item` `shortcut` `empty` | 无 | 不适用 | 冲突输入已补 | Menu 只承接结果和菜单项，不负责搜索逻辑 | 暂无 |
| `FrontSearchPanel` | `query` `update:query` `searchChange` `select` `header` `search` `content` `results` `empty` | 无 | 不适用 | 冲突输入已补 | SearchPanel 是轻量搜索层，不承担全局快捷键 | 暂无 |
| `FrontCommand` | `modelValue` `update:modelValue` `openChange` `searchChange` `select` `shortcut` `header` `content` `search` `results` `empty` | 无 | 不适用 | 冲突输入已补 | Command 是全局入口层，搜索结果继续下沉到 SearchPanel | 暂无 |

## 当前结论

- 图标和两侧内容命名已经基本收敛到 `leading / trailing`
- 开关类事件已经基本收敛到 `modelValue + update:modelValue + openChange`
- 搜索和结果链路已经基本收敛到 `searchChange + select`
- 当前最值得继续清理的是默认 slot 和旧别名的继续暴露范围
