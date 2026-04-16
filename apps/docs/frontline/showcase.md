---
title: 前台页面样板
description: 把 5 个试点组件放进同一个 landing / pricing / account 页面里看整体节奏。
outline: deep
---

# 前台页面样板

这页不再单独看某一个组件，而是把 `FrontButton`、`FrontDialog`、`FrontTabs`、`FrontPopover`、`FrontSelect` 放回一个完整页面里。

目标只有一个：确认这条实验线是不是已经开始形成自己的页面语言。

:::demo 如果整页成立，下一步才值得继续补 `input`、`card`、`dropdown`；如果整页还不成立，就不该继续铺数量。
frontline/showcase
:::

## 这一页在验证什么

- Hero 区的 CTA 是否已经明显区别于当前后台主线
- 定价区的 tabs / popover / action 节奏是否足够自然
- 账户区的 select 和次级按钮是否还能维持同一套气质
- Dialog 放回整页后，会不会立刻暴露“只是换皮”的问题
- `Card / Dialog / Popover` 的主体区是否已经能稳定收敛到 `content` anatomy，而不是继续依赖默认 slot

## 这一页之后该怎么判断

- 如果你愿意继续在这条线投资源，优先补 `input`、`dropdown`、`card`
- 如果你觉得它还只是“前台风格的后台组件”，那说明基础层和前台表达层的边界还没立住
