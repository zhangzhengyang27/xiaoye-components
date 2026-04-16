---
title: 正式出口草案
description: 基于第一轮准入判断，明确 frontline 哪些组件适合进入未来正式发布包，哪些仍应停留在 frontline 子线。
outline: deep
---

# 正式出口草案

这页不是重新判断谁稳不稳，而是在 [产品线准入清单](/frontline/admission-checklist) 的基础上再往前推一步：

如果未来真的要把 `frontline` 的一部分变成正式发布能力，第一批到底应该放什么进公开白名单，什么又应该继续留在 `frontline` 子线里。

这里先不改任何真实发布入口，只给出第一版出口策略草案。

## 先说结论

### 第一批更适合进入正式发布包的组件

- `FrontButton`
- `FrontInput`
- `FrontTabs`
- `FrontCard`
- `FrontDialog`
- `FrontSelect`

### 更适合继续停留在 frontline 子线的组件

- `FrontMenu`
- `FrontSearchPanel`

### 仍然不进入正式出口讨论的组件

- `FrontDropdown`
- `FrontCommand`
- `FrontPopover`

## 判断标准

一个组件就算已经在准入清单里进了 `A 档`，也不代表它一定适合进入正式发布包。

这里额外再看 4 个维度：

1. 通用性够不够强。
说明：脱离当前 landing / pricing / account 样板后，它还能不能在更多前台页面里自然成立。

2. 品牌耦合度高不高。
说明：如果它的价值高度依赖当前这套前台内容节奏、品牌语气或页面组织方式，更适合继续留在 `frontline` 子线。

3. 是否适合作为公开承诺。
说明：一旦进入正式发布包，就默认意味着未来会长期维护，不适合频繁换模型。

4. 是否是独立组件，而不是组合层。
说明：组合层、入口层、场景层就算当前可用，也不一定适合直接对外成为正式公开能力。

## 第一批正式发布包白名单建议

### FrontButton

建议：进入正式发布包。

原因：

- API 面小，语义清楚，通用性强。
- `variant / tone / leading / trailing` 已经足够稳定。
- 即使脱离当前页面样板，它也仍然是典型的前台通用能力。

### FrontInput

建议：进入正式发布包。

原因：

- 它已经不是单纯视觉换皮，而是前台表单入口的稳定表达。
- `leadingIcon / trailingIcon`、`data-state / data-value-state`、交互边界都已基本稳定。
- 可复用范围明显超过当前 showcase。

### FrontTabs

建议：进入正式发布包。

原因：

- `variant + modelValue` 这套 API 很克制，维护成本低。
- 当前没有明显兼容债，也没有太强的场景耦合。
- 很适合作为前台产品页、内容页、定价页的稳定基础件。

### FrontCard

建议：进入正式发布包。

原因：

- `header / content / footer / actions` 的容器 anatomy 已经足够清楚。
- 虽然还保留默认 slot 兼容，但主写法已经稳定。
- 它更像前台表达层的基础容器，而不是某个特定场景组件。

### FrontDialog

建议：进入正式发布包。

原因：

- `modelValue + openChange + content/footer` 的边界已经稳定。
- 它虽然带前台语气，但仍然是通用交互容器，不是某个特定流程入口。
- 只要再补一轮确认/表单类页面验证，就足够进入白名单。

### FrontSelect

建议：进入正式发布包。

原因：

- 它已经形成了和中后台 `Select` 不同的前台表达，但仍然保留通用性。
- `openChange / searchChange / change` 这组事件边界已经足够清楚。
- 它属于“前台通用输入件”，而不是“场景组件”。

## 继续停留在 frontline 子线的 A 档组件

### FrontMenu

建议：继续留在 `frontline` 子线，暂不进正式发布包。

原因：

- 它现在的价值更像“结果承载层”和“支撑层”，而不是独立对外售卖的前台通用件。
- `group / item / shortcut / empty` 的 anatomy 刚稳定下来，但真实业务复用还不够多。
- 更合理的路径是先作为 `SearchPanel / Command` 的稳定底层，而不是先进入正式白名单。

出口建议：

- 可以继续从 `@xiaoye/frontline/menu` 这类子入口保留。
- 先不要急着把它抬成未来正式发布包的核心卖点组件。

### FrontSearchPanel

建议：继续留在 `frontline` 子线，暂不进正式发布包。

原因：

- 它虽然已经是 `A 档`，但本质上仍然是“轻量搜索场景层”。
- 它的价值高度依赖当前前台信息架构和内容查找模型，品牌耦合仍然偏高。
- 一旦进入正式发布包，就意味着要长期承诺一套“前台搜索面板”的结构，这个判断现在还太早。

出口建议：

- 继续作为 `frontline` 的特色能力保留。
- 等真实 docs / landing / account 场景再跑一轮，确认它不是只适合当前实验样板。

## 当前不进入正式出口讨论的组件

### FrontDropdown

原因：

- `select / command` 双语义虽然已经分开，但还需要更多真实场景验证。
- 现在更像“有希望进入下一轮”的候选，而不是当前就能公开承诺的正式件。

### FrontCommand

原因：

- 它已经明显是入口层，而不是普通单组件。
- 一旦进入正式发布包，就意味着要长期承诺快捷键、关闭策略、搜索路径和命令模型。
- 当前还太早。

### FrontPopover

原因：

- `content prop` 和 `content slot` 的双轨问题还没完全结束。
- 它仍然是这条实验线里最明显的“继续收语义”的组件。

## 建议的正式出口分层

如果真的要往正式发布包推进，建议不要只有“进”或“不进”两种状态，而是分三层：

### 第一层：正式发布包白名单

- `FrontButton`
- `FrontInput`
- `FrontTabs`
- `FrontCard`
- `FrontDialog`
- `FrontSelect`

特点：

- 通用性更强
- 品牌耦合可控
- API 足够稳定

### 第二层：frontline 官方子线能力

- `FrontMenu`
- `FrontSearchPanel`

特点：

- 已经够稳，但更适合继续放在 `frontline` 品牌子线里维护
- 可以公开，但不一定要进入未来正式发布包主白名单

### 第三层：继续实验区

- `FrontDropdown`
- `FrontCommand`
- `FrontPopover`

特点：

- 仍然明显带实验债
- 继续以 docs 和页面样板验证为主

## 这一轮之后不要做的事

- 不要把 `packages/frontline` 当前 11 个组件整体直接当成未来正式发布包。
- 不要因为 `A 档` 数量已经够多，就默认它们都值得进入公开白名单。
- 不要在正式出口策略没定清前，就开始改真正的聚合包导出。

## 下一步建议

如果你要继续推进，我建议下一轮直接做一页“正式发布包白名单草案”，把这 6 个组件再往前细化成：

- 哪些未来值得进入主入口
- 哪些只适合子入口
- 每个组件升格前还差哪一个具体动作
