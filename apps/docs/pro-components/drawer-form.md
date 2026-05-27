---
title: DrawerForm 抽屉表单
description: 基于 OverlayForm 的抽屉表单 facade。
outline: deep
---

# DrawerForm 抽屉表单

`xy-drawer-form` 是 `xy-overlay-form` 的轻包装版本，用来表达“这里明确就是抽屉编辑”的场景。它固定使用 `container="drawer"`，但继续复用同一套覆盖层表单内核。

## 基础用法

:::demo 当列表页需要保留上下文、在右侧展开编辑抽屉时，`xy-drawer-form` 会比手写 `container="drawer"` 更贴近业务心智。
pro/drawer-form/basic
:::

## 当前定位

- 这是 `OverlayForm` 的语义化 facade，不是第二套抽屉表单内核。
- 适合列表页快速编辑、详情侧滑修改和保留页面上下文的录入场景。
- 当使用方已经确定容器必须是抽屉时，优先使用它。

## 与 OverlayForm 的关系

- `OverlayForm` 继续承担统一覆盖层编辑内核。
- `DrawerForm` 只固定容器为抽屉，并保留同一套 `open / mode / model / schema / submit` 协议。
- 如果你的页面需要在抽屉和弹窗之间切换，仍然应直接使用 `OverlayForm`。
