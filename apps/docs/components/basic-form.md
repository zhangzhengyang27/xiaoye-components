---
title: 基础与表单组件
description: Button、Input、Select、Form、Drawer、Upload 在后台页面中的常见组合方式。
outline: deep
---

# 基础与表单组件

这页把录入链路放回真实后台页面语境里。和单组件页不同，这里更强调“它们如何一起工作”，而不是单个属性表。

:::tip 单组件页
如果你需要查完整的属性、事件和插槽表，优先进入对应的单组件页，例如 [Button 按钮](/components/button)、[Input 输入框](/components/input)、[Select 选择器](/components/select)。
:::

## 顶部操作区

:::demo 中后台页面的顶部操作区通常由搜索、筛选和主操作组成，这一块更看重节奏和语义层级，而不是单个控件本身。
basic-form/toolbar
:::

## 字段级表单控制

:::demo 真正高频的不是“整表单提交”，而是字段级校验、局部清错和单字段回滚。
basic-form/form-methods
:::

## 侧边编辑抽屉

:::demo 当录入内容更长、你又不想完全打断当前页面时，优先考虑 Drawer，而不是继续堆 Modal。
basic-form/drawer-edit
:::

## 场景建议

- `Button + Input + Select` 适合筛选栏和操作带。
- `Form + DatePicker + Select` 适合弹窗录入和局部保存。
- `Drawer + Upload` 适合详情侧滑编辑和补充材料上传。

## 推荐阅读顺序

1. 先看 [Button 按钮](/components/button)，确认主次操作的视觉语义。
2. 再看 [Input 输入框](/components/input)、[Select 选择器](/components/select)、[DatePicker 日期选择器](/components/date-picker)。
3. 最后看 [Form 表单](/components/form)、[Drawer 抽屉](/components/drawer)、[Upload 上传](/components/upload)，把页面录入链路串起来。
