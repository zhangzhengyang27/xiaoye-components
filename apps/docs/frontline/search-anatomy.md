---
title: 搜索与菜单 Anatomy
description: 约束 FrontDropdown、FrontSearchPanel、FrontCommand 的 trigger、content、results、empty 分层和兼容边界。
outline: deep
---

# 搜索与菜单 Anatomy

这页只处理前台实验线里另一类容易发散的组件：菜单、下拉、搜索和命令入口。

目标不是继续加功能，而是把三层关系收清楚：

- `FrontMenu`：结果承载层
- `FrontDropdown`：轻动作入口
- `FrontSearchPanel`：轻量搜索层
- `FrontCommand`：全局入口层

## 总原则

- 触发器优先统一叫 `trigger`
- 面板主体优先统一叫 `content`
- 搜索结果列表优先统一叫 `results`
- 空结果或无数据态优先统一叫 `empty`
- 如果上层已经暴露 `content` 作为总入口，就不要再把更细 slot 当成并列主入口

## FrontMenu

推荐 anatomy：

- `group`：结果分组标题
- `item`：结果项主内容
- `shortcut`：结果项右侧快捷键信息
- `empty`：空结果态

当前边界：

- `FrontMenu` 只承接结果和菜单项，不负责搜索状态本身
- 默认结果结构仍然是 `icon + copy + shortcut`
- `shortcut` 是 `item` 内部的细分层，不是并列主入口

当前 warning：

- `item` slot 和 `shortcut` slot 同时存在时，`shortcut` slot 会被 `item` slot 覆盖

怎么理解这一层：

- 只想改分组标题：用 `group`
- 只想改单项右侧快捷键信息：用 `shortcut`
- 要整体接管结果项：改 `item`
- 没有结果时：改 `empty`

## FrontDropdown

推荐 anatomy：

- `trigger`：下拉触发器
- `content`：自定义菜单内容

当前边界：

- 默认 slot 仍兼容作为 `trigger`
- `dropdown` slot 仍兼容作为 `content`
- 新示例统一优先写 `#trigger + #content`

当前 warning：

- `trigger` slot 和默认 slot 同时存在时，默认 slot 会被忽略
- `dropdown` slot 和 `content` slot 同时存在时，旧 slot 会被忽略

什么时候还可以继续只传 `items`：

- 只是普通资源菜单、动作列表或跳转入口
- 暂时不需要更复杂的自定义布局

## FrontSearchPanel

推荐 anatomy：

- `header`：标题和说明
- `search`：搜索输入层
- `content`：搜索结果区总入口
- `results`：结果列表
- `empty`：空结果态

当前边界：

- `content` 是 SearchPanel 的总入口
- `results` 和 `empty` 是 `content` 内部的细分层
- 默认结果实现仍然复用 `FrontMenu`

当前 warning：

- `content` slot 和 `results / empty` 同时存在时，细分 slot 会被忽略
- `results` slot 和 `empty` slot 同时存在时，`empty` slot 会被 `results` slot 覆盖

怎么理解这一层：

- 如果只想换空态文案，用 `empty`
- 如果只想改结果展示，用 `results`
- 如果要整体接管结果区，再用 `content`

## FrontCommand

推荐 anatomy：

- `header`：标题、说明、快捷键信息
- `content`：命令面板主体
- `search`：搜索输入层
- `results`：命令结果区
- `empty`：无匹配结果时的空态

当前边界：

- `FrontCommand` 仍然负责全局快捷键和开关状态
- 搜索输入、结果列表和空态默认继续下沉到 `FrontSearchPanel`
- 如果你只想改结果区或空态，不需要整块接管 `content`

当前 warning：

- `content` slot 和 `search / results / empty` 同时存在时，细分 slot 会被忽略

## 实际执行规则

1. 新增 Dropdown 示例时，优先写 `#trigger`
2. 新增 SearchPanel 示例时，默认把结果层理解成 `content > results > empty`
3. 新增 Command 示例时，优先只改 `results` 或 `empty`，除非真的要整体替换主体
4. 新增 Menu 示例时，优先先改 `group / shortcut / empty`，只有需要整体重排时才改 `item`
5. 兼容入口仍然保留，但不再作为文档主写法
