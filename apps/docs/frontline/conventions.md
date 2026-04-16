---
title: 实验线规约
description: 约束 frontline 实验线的命名、状态暴露、事件和 slot 语义，避免继续发散。
outline: deep
---

# 实验线规约

这页只讲 `frontline` 的结构规则，不讲视觉效果。

## 命名约定

- 控件类优先使用 `variant`
- 容器和浮层类优先使用 `surface`
- 图标命名优先使用 `leadingIcon / trailingIcon`
- `prefixIcon / suffixIcon` 只作为兼容入口保留，不再继续扩散

## 状态暴露

- 交互状态优先暴露为 `data-state`
- 值状态优先暴露为 `data-value-state`
- 视觉形态优先暴露为 `data-variant` 或 `data-surface`
- 尺寸优先暴露为 `data-size`

## 事件约定

- 开关类优先支持 `modelValue + update:modelValue`
- 开关辅助事件统一优先用 `openChange`
- 搜索输入链路统一优先用 `searchChange`
- 列表、菜单、命令结果统一优先用 `select`
- 如果组件还保留 `change`、`command` 这类事件，优先把它们理解为特定业务补充，而不是新的主规约

当前边界：

- `openChange`：只表达面板、弹层、下拉这类“开关状态”
- `searchChange`：只表达搜索关键字变化
- `select`：只表达从候选项、菜单项、搜索结果里选中某一项
- `change`：保留给值型输入控件，例如 `FrontSelect`
- `command`：保留给动作菜单，不拿来替代 `select`

## Slot 约定

- 前后图标优先使用 `leading / trailing`
- `prefix / suffix` 只作为兼容别名保留
- 浮层触发器优先使用 `trigger`
- 面板主体优先使用 `content`
- 结果分组优先使用 `group`
- 结果项主内容优先使用 `item`
- 结果项辅助快捷信息优先使用 `shortcut`
- 列表或命令结果区优先使用 `results`
- 空结果或空态优先使用 `empty`
- 容器类继续使用 `header / footer / actions`

当前别名策略：

- `content` 可以作为 `dropdown`、默认插槽内容的语义别名
- `leading / trailing` 可以作为 `prefix / suffix` 的语义别名
- 继续保留旧别名时，应在源码里向新命名收敛，不再继续往外扩散

## 兼容治理

- 旧 props 如果还能通过类型系统表达，优先补 `@deprecated`
- 旧 slot 或运行时写法如果无法通过类型系统表达，优先在开发态补 warning
- 文档、示例和页面样板统一只使用主命名，不再示范兼容写法
- 默认 slot 这种历史包袱较重的入口，先在边界页明确为兼容入口，再决定是否补 warning
- 新增实验组件时，如果一开始就需要多个兼容别名，通常说明组件分层还没想清楚，应先停下来收敛 anatomy

## 当前建议

- 新增实验组件前，先对照这页决定命名和事件
- 如果一个新组件需要引入完全不同的命名方式，优先先停下来确认是否真的是新层级能力
- 后续回扫时，优先清理不再需要的兼容别名
