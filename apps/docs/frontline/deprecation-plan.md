---
title: 废弃计划
description: 记录 frontline 实验线第一轮兼容命名的降级与迁移计划。
outline: deep
---

# 废弃计划

这页不是立即删除能力，而是给 `frontline` 兼容命名一个明确的退出路径。

## 第一轮候选

### 图标命名

- 候选废弃：`prefixIcon`、`suffixIcon`
- 推荐主命名：`leadingIcon`、`trailingIcon`
- 当前状态：源码层继续兼容，文档层不再推荐；`FrontInput`、`FrontSelect` 已补 `@deprecated`
- 下一步：继续保留 `@deprecated`，并让所有示例只使用新命名，等至少一轮文档稳定后再考虑真正移除兼容 props

### 图标 slot

- 候选废弃：`prefix`、`suffix`
- 推荐主命名：`leading`、`trailing`
- 当前状态：源码层继续兼容，规约页已经降级为兼容别名；`FrontButton`、`FrontInput`、`FrontSelect` 已补开发态 warning
- 下一步：先保持可用，但示例和新文档不再使用；如果后续试点稳定，再考虑把 warning 扩大到更多依赖旧 slot 的组件

### 面板主体 slot

- 候选废弃：部分组件直接依赖默认 slot 作为主体内容
- 推荐主命名：`content`
- 当前状态：`FrontCard`、`FrontDialog`、`FrontPopover` 已开始支持 `content`
- 下一步：继续让容器/浮层类逐步显式化主体内容语义，但当前先不补 warning，避免默认 slot 的历史写法在试点期噪音过大

### Dropdown 主体 slot

- 候选废弃：`dropdown`
- 推荐主命名：`content`
- 当前状态：`FrontDropdown` 同时支持 `content` 和 `dropdown`，并已补开发态 warning
- 下一步：等文档和示例稳定后，先在规约页和示例里把 `dropdown` 明确视作旧别名，后续再评估是否移除

## 不准备废弃的项

- `change`
原因：值型输入控件仍需要它表达值变化语义

- `command`
原因：动作菜单里仍然需要它表达动作值，不适合全部压到 `select`

- 默认 slot 作为文本内容入口
原因：像 `FrontButton` 这类组件仍然天然应该以默认 slot 承载主内容

## 执行策略

1. 先在规约和边界清单里明确主命名
2. 再把示例和页面样板全部切到主命名
3. 再给旧命名补 `@deprecated` 和文档降级说明
4. 最后才考虑真正移除

## 当前迁移账本

| 项目 | 旧命名 | 新命名 | 类型 `@deprecated` | 开发态 warning | 文档状态 | 当前建议 |
| --- | --- | --- | --- | --- | --- | --- |
| `FrontInput` props | `prefixIcon` `suffixIcon` | `leadingIcon` `trailingIcon` | 已补 | 已补 | 已降级为兼容写法 | 新代码不要再写旧 props |
| `FrontSelect` props | `prefixIcon` `suffixIcon` | `leadingIcon` `trailingIcon` | 已补 | 已补 | 已降级为兼容写法 | 新代码不要再写旧 props |
| `FrontButton` slots | `prefix` `suffix` | `leading` `trailing` | 不适用 | 已补 | 已降级为兼容写法 | 新代码统一只写新 slot |
| `FrontInput` slots | `prefix` `suffix` | `leading` `trailing` | 不适用 | 已补 | 已降级为兼容写法 | 新代码统一只写新 slot |
| `FrontSelect` slots | `prefix` `suffix` | `leading` `trailing` | 不适用 | 已补 | 已降级为兼容写法 | 新代码统一只写新 slot |
| `FrontDropdown` slot | `dropdown` | `content` | 不适用 | 已补 | 已降级为兼容写法 | 新代码统一只写 `content` |
| `FrontDropdown` trigger | 默认 slot | `trigger` | 不适用 | 冲突输入已补 | 新示例已优先改用 `trigger` | 新代码统一只写 `trigger` |
| `FrontMenu` 结果项细分 | 在结果模板外重复拼布局 | `group` `item` `shortcut` `empty` | 不适用 | 冲突输入已补 | 已切到 anatomy 写法 | 先按细分 slot 扩展，不要回到整块模板复制 |
| `FrontCard` / `FrontDialog` / `FrontPopover` 默认主体 | 默认 slot | `content` | 不适用 | 冲突输入已补 | 已标记为兼容入口，示例优先改用 `content` | 先观察，不急于扩大 warning |

## 下一轮迁移顺序

1. 先冻结兼容面：不再给 `frontline` 新组件增加新的旧命名别名。
2. 再清示例入口：所有 demo、showcase、落地页样板统一只使用主命名。
3. 再收源码提示：对已经进入迁移期的兼容入口，优先补 `@deprecated` 或开发态 warning。
4. 最后才做删除：至少等一轮完整页面验证和文档稳定后，再评估删除兼容入口。

## 当前建议

- 这条实验线在进入正式产品线前，不要继续引入新的兼容别名
- 如果必须兼容旧写法，优先只在源码层兼容，不再在文档里推广
