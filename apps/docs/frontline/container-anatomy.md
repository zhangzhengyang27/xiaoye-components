---
title: 容器 Anatomy
description: 约束 FrontCard、FrontDialog、FrontPopover 这类容器与浮层组件的主体结构、slot 语义和兼容边界。
outline: deep
---

# 容器 Anatomy

这页只处理一类问题：`FrontCard`、`FrontDialog`、`FrontPopover` 这类组件，到底应该怎么表达自己的主体结构。

目标不是把它们做成更复杂的 primitive，而是先把前台页面里最常见的 anatomy 收清楚。

## 总原则

- 容器和浮层组件优先把主体内容显式收敛到 `content`
- 默认 slot 目前仍然保留，但只作为兼容入口，不再作为文档主写法
- `header / footer / actions / trigger` 这类结构名，优先表达“区域语义”，而不是视觉样式
- 如果一个容器组件主要承接正文、说明、表单或组合模块，新示例优先使用具名 `content`

## FrontCard

推荐 anatomy：

- `header`：完全接管标题区时使用
- `actions`：标题区右侧或顶部轻操作
- `content`：正文、列表、表单片段、组合模块
- `footer`：收尾动作、补充说明、次级信息

当前边界：

- `title / description / eyebrow` 仍然是 Card 的轻量头部入口
- 默认 slot 继续作为 `content` 的兼容兜底
- 新示例统一优先写 `#content`

什么时候不要只写默认 slot：

- 正文里已经有输入、按钮、列表、说明块等多个片段
- 你希望一眼看出“这是正文区，不是标题区扩展”
- 你准备以后继续往 `media / stats / actions` 这种 anatomy 深化

## FrontDialog

推荐 anatomy：

- `header`：覆盖默认标题区
- `content`：主说明、表单、确认区正文
- `footer`：确认、取消、次级操作

当前边界：

- `openChange` 只负责开关状态，不承接“确认”语义
- `content` 是 Dialog 正文的主入口
- 默认 slot 继续作为兼容兜底，但文档不再推荐

什么时候应该用 `#content`：

- 你需要传 `close` 能力给正文区
- 正文不是一段孤立文本，而是成组内容
- 你希望以后补 loading、step、summary 这种更明确的正文 anatomy

## FrontPopover

推荐 anatomy：

- `trigger`：触发器
- `header`：标题区或轻量补充头部
- `content`：结构化说明、列表、按钮或多段内容

当前边界：

- `content` prop 仍然保留，适合单段纯文本提示
- `content` slot 是结构化内容的主入口
- 默认 slot 继续作为兼容兜底，但新文档不再推荐

如何选 `content` prop 还是 `#content`：

- 只有一句纯文本提示：可以继续用 `content` prop
- 有多段文案、强调信息、列表或动作：改用 `#content`

## 当前决策

- `FrontCard / FrontDialog / FrontPopover` 不会因为单独使用默认 slot 就直接 warning
- 但如果默认 slot 和 `content` slot 同时存在，当前会在开发态给出冲突提醒
- `FrontPopover` 如果同时传 `content` prop 和 slot，也会在开发态提示 `content` prop 会被忽略
- 当前更重要的是先把文档、demo、showcase 全部切到 `content`，而不是过早把兼容写法全部打成噪音

## 实际执行规则

1. 新增容器类示例时，正文优先写 `#content`
2. 默认 slot 只用于兼容旧示例，不再作为新示例模板
3. 如果一个组件同时暴露 `content` prop 和 `content` slot，文档里要明确两者的场景边界
4. 只有当页面样板已经稳定后，才评估是否进一步收紧默认 slot 兼容
