---
title: 产品线准入清单
description: 对 frontline 当前 11 个组件做第一轮沉淀判断，区分哪些 API 已经够稳，哪些仍然只是实验态。
outline: deep
---

# 产品线准入清单

这页不再继续扩实验能力，而是回答一个更现实的问题：

`frontline` 里哪些 API 已经足够稳定，可以考虑进入正式产品线候选；哪些还只是实验态，不适合现在就对外做长期承诺。

## 这页怎么用

- `A 档：可进入候选`：API 已经基本收敛，可以开始讨论是否进入正式产品线白名单
- `B 档：有条件准入`：方向基本成立，但还差一到两层边界收口，不建议立刻升格
- `C 档：继续实验`：仍然带明显实验信号，先继续在 docs 和样板里验证

## 第一轮判断维度

一个组件要进入正式产品线候选，至少应同时满足这些条件：

1. 主命名已经收敛。核心 props、事件和 slot 不再摇摆，兼容入口只是降级保留，而不是继续扩散。
2. anatomy 已经显式。像 `trigger / content / results / empty` 这类结构层级已经写清楚，不再依赖默认 slot 猜语义。
3. 冲突输入有边界。旧别名、重复 slot 或互斥入口，已经能通过 `@deprecated` 或开发态 warning 提示。
4. 文档和示例一致。规约、边界页、demo、showcase 至少指向同一套主写法。
5. 页面样板能成立。组件放回 landing / pricing / account 这类真实页面时，不会立刻暴露“只是换皮”。
6. 升格成本可控。进入正式产品线后，不需要立刻推翻当前 API 设计。

如果一个组件还出现这些信号，默认仍归为实验态：

- 仍然强依赖默认 slot 兼容，而不是以显式 anatomy 为主
- 同一能力还在 `prop` 和 `slot` 两套入口之间摇摆
- 主要能力只在单组件 demo 成立，放回整页后判断还不够充分
- 当前 warning 只是补救措施，主语义本身还没完全稳定

## 第一轮判级

| 组件 | 当前等级 | 判断 | 主要依据 | 下一步要求 |
| --- | --- | --- | --- | --- |
| `FrontButton` | `A 档：可进入候选` | 主命名和状态语义已经收敛 | `variant / tone / leading / trailing` 已稳定，旧 slot 有 warning，页面样板已验证 | 后续只继续清旧别名，不再加新按钮语义层 |
| `FrontTabs` | `A 档：可进入候选` | API 面较小且边界清晰 | `variant + modelValue` 简洁，当前没有明显兼容包袱 | 如果要升格，优先补更多页面级使用验证 |
| `FrontInput` | `A 档：可进入候选` | 主 props、图标命名和状态暴露已基本稳定 | `leadingIcon / trailingIcon` 已是主命名，旧 props/slot 有降级策略 | 保持输入类仍以值变化语义为主，不要再向命令类事件漂移 |
| `FrontSelect` | `A 档：可进入候选` | 事件和 anatomy 已基本收敛 | `openChange / searchChange / change` 边界清晰，旧图标命名已控住 | 继续观察复杂搜索场景，不要再扩新兼容入口 |
| `FrontCard` | `A 档：可进入候选` | 容器 anatomy 已明确，正文区已切到 `content` | `header / content / footer / actions` 已成主写法，冲突输入已补 warning | 默认 slot 继续兼容，但不要回到文档主写法 |
| `FrontDialog` | `A 档：可进入候选` | 开关语义和正文 anatomy 已稳定 | `modelValue + openChange + content/footer` 清晰，示例和样板已统一 | 如果升格，补一轮表单/确认类场景验证即可 |
| `FrontMenu` | `A 档：可进入候选` | 结果层 anatomy 已真正拆清 | `group / item / shortcut / empty` 已落到代码和文档 | 后续不要再让 SearchPanel / Command 重复拼结果模板 |
| `FrontSearchPanel` | `A 档：可进入候选` | 轻量搜索层已经形成独立分层 | `header / search / content / results / empty` 明确，和 Menu 已闭环 | 如果升格，保持它只做轻搜索层，不承担全局入口 |
| `FrontDropdown` | `B 档：有条件准入` | 主方向成立，但动作菜单语义还需要再观察 | `trigger / content` 已收敛，旧 `dropdown` slot 仍在兼容，`select / command` 双语义需要持续约束 | 再做一轮资源菜单 vs 动作菜单的场景验证，确认事件语义不会反复 |
| `FrontCommand` | `B 档：有条件准入` | 分层已清楚，但还承担全局快捷键和入口策略判断 | `content / search / results / empty` 已成型，但它仍依赖 SearchPanel，且“命令入口是否进入正式产品线”还带明显产品判断 | 先继续验证全局快捷键、结果行为和关闭策略，再决定是否升格 |
| `FrontPopover` | `C 档：继续实验` | 语义还没完全稳定 | `content` prop 和结构化 `content` slot 仍然并存，默认 slot 也还在兼容，当前更像谨慎收口中的实验态 | 先决定纯文本提示和结构化内容是否要彻底分路，再谈升格 |

## 当前结论

第一轮更适合进入正式产品线候选的，不是全部 11 个组件，而是这 8 个：

- `FrontButton`
- `FrontTabs`
- `FrontInput`
- `FrontSelect`
- `FrontCard`
- `FrontDialog`
- `FrontMenu`
- `FrontSearchPanel`

暂时不建议立刻升格的，是这 3 个：

- `FrontDropdown`
  原因：动作菜单和结果选择的语义虽然已经分开，但还需要更多场景验证。
- `FrontCommand`
  原因：它已经像“入口层”而不是单组件，升格意味着要对快捷键、关闭策略和搜索路径做长期承诺。
- `FrontPopover`
  原因：当前最明显的实验信号还在它身上，尤其是 `content` prop 和 slot 的双轨并存。

## 升格前的最低动作

如果要把 `frontline` 的一部分推进到正式产品线，建议先做这 4 件事：

1. 先只挑 `A 档` 组件进入候选名单，不要一口气把 11 个组件全部升格。
2. 给 `A 档` 组件补一轮“正式出口草案”，确认未来根入口到底要不要公开，以及公开到什么粒度。
3. 对 `B / C 档` 保持实验标签，不要因为当前 demo 看起来成立就提前做稳定承诺。
4. 下一轮判断时，重点看 `Dropdown / Command / Popover` 是否还能继续收掉语义歧义，而不是再扩组件数量。

如果你要继续看这一步，直接看 [正式出口草案](/frontline/formal-export-plan)。
