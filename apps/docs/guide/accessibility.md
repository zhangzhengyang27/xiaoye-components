---
title: 可访问性约定
description: 当前组件库在键盘操作、焦点管理和语义角色上的统一约定。
outline: deep
---

# 可访问性约定

这页先把组件库目前的无障碍基线讲清楚。它描述的是跨组件契约，而不是某一个组件的局部实现。

<p class="xy-section-lead">
  如果你要判断一套组件能不能稳定接入后台项目，除了看 API，还要先看键盘路径、焦点管理和语义角色是不是一致。这页就是这条基线。
</p>

## 键盘约定

| 组件 | 当前约定 |
| --- | --- |
| `Tabs` | `ArrowLeft / ArrowRight / ArrowUp / ArrowDown` 切换，`Home / End` 快速跳到首尾可用项 |
| `Select` | `ArrowUp / ArrowDown` 移动高亮，`Enter / Space` 选择，`Escape` 关闭并回到触发器 |
| `Dropdown` | `ArrowUp / ArrowDown / Home / End` 遍历菜单项，`Enter / Space` 选择 |
| `Collapse` | `Enter / Space` 切换当前面板 |
| `Dialog` | 打开后焦点带入弹层，`Tab / Shift+Tab` 在内部循环，`Escape` 关闭 |
| `Drawer` | 与 `Dialog` 保持一致：焦点带入、焦点恢复、`Escape` 关闭 |
| `Tooltip` | 支持 `focus` 打开，`Escape` 关闭 |
| `Popover` | `Enter / Space` 打开，`Escape` 和外部点击关闭 |

## 焦点管理约定

- 模态类组件默认在打开后把焦点带入内部。
- 模态类组件关闭后，焦点恢复到触发元素。
- 组合框和菜单关闭后，焦点回到触发器，而不是丢到页面根部。
- 多层 overlay 并存时，只有最上层响应该轮 `Escape` 或外部点击关闭。

## 语义角色约定

| 组件模式 | 当前语义 |
| --- | --- |
| Tabs | `tablist / tab / tabpanel` |
| Select | `combobox / listbox / option` |
| Dropdown | `menu / menuitem` |
| Collapse | `button / region` |
| Tooltip | `tooltip` |
| Dialog / Drawer | `dialog` + `aria-modal="true"` |
| Popover | `dialog`，但不强制模态 |

## 文档使用方式

- 想看单组件 Props、Events、Slots：去对应组件页
- 想看多组件如何组合成页面：看场景页和示例页
- 想确认当前库的无障碍基线：先看本页

## 对应组件页

- [Select 选择器](/components/select)
- [Tabs 标签页](/components/tabs)
- [Collapse 折叠面板](/components/collapse)
- [Tooltip 文字提示](/components/tooltip)
- [Dialog 对话框](/components/dialog)
- [Dropdown 下拉菜单](/components/dropdown)
- [Popover 气泡卡片](/components/popover)
- [Drawer 抽屉](/components/drawer)

## 推荐怎么继续读

1. 如果你先关心单个组件的键盘路径，优先看 [Select 选择器](/components/select)、[Tabs 标签页](/components/tabs)、[Dropdown 下拉菜单](/components/dropdown)。
2. 如果你更关心浮层类组件的焦点管理，继续看 [Dialog 对话框](/components/dialog)、[Drawer 抽屉](/components/drawer)、[Popover 气泡卡片](/components/popover)。
3. 如果你想看这些能力如何放回真实页面，再去看 [管理后台闭环示例](/examples/admin)。
