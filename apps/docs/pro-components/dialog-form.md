---
title: DialogForm 弹窗表单
description: 基于 OverlayForm 的弹窗表单 facade。
outline: deep
---

# DialogForm 弹窗表单

`xy-dialog-form` 是 `xy-overlay-form` 的轻包装版本，用来表达“这里明确就是弹窗编辑”的场景。它固定使用 `container="modal"`，但继续复用同一套覆盖层表单内核。

## 基础用法

:::demo 当页面已经明确要用弹窗承接编辑动作时，用 `xy-dialog-form` 会比再手写 `container="modal"` 更直接。
pro/dialog-form/basic
:::

## 当前定位

- 这是 `OverlayForm` 的语义化 facade，不是第二套弹窗表单内核。
- 适合创建成员、修改属性、补充说明这类轻量弹窗编辑场景。
- 当使用方已经确定容器必须是弹窗时，优先使用它。

## 与 OverlayForm 的关系

- `OverlayForm` 继续承担统一覆盖层编辑内核。
- `DialogForm` 只固定容器为弹窗，并保留同一套 `open / mode / model / schema / submit` 协议。
- 如果你的页面需要在抽屉和弹窗之间切换，仍然应直接使用 `OverlayForm`。
