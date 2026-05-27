---
title: SplitLayoutPage 分栏布局页
description: 统一主从布局与侧栏布局的页面级分栏模型。
outline: deep
---

# SplitLayoutPage 分栏布局页

`xy-split-layout-page` 用来统一表达后台常见的双栏工作区，通过 `layout="master-detail" | "aside-main"` 收口主从布局和侧栏布局。

## 分栏工作区场景

:::demo 这个场景分别展示“左列表右详情”和“左筛选右主内容”两种常见工作区，本质上它们都属于同一类分栏页面。
pro/split-layout-page/workspace
:::

## 当前定位

- 统一表达后台双栏页面，不再把主从页和分栏页拆成两套主公开入口。
- 适合成员台账、规则中心、审批工作台、配置中心等需要长期保留上下文的场景。
- 在收口后的公开体系里，它承担页面骨架，而具体内容继续通过 `ListPage`、`DetailPage`、`FilterPanel` 等能力嵌入。

## 当前边界

- 路由同步、拖拽持久化和复杂工作台状态仍建议由业务页自行编排。

## SplitLayoutPage API

### SplitLayoutPage Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 页面标题 | `string` | `''` |
| `description` | 页面说明 | `string` | `''` |
| `layout` | 分栏布局模式 | `'master-detail' \| 'aside-main'` | `'aside-main'` |
| `primary-size` | 主栏宽度 | `string` | `master-detail` 为 `'38%'`，`aside-main` 为 `'28%'` |

### SplitLayoutPage Slots

| 插槽 | 说明 |
| --- | --- |
| `master` | 主从模式左侧区 |
| `detail` | 主从模式右侧区 |
| `aside` | 侧栏模式左侧区 |
| `main` | 侧栏模式右侧区 |
