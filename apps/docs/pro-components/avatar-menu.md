---
title: AvatarMenu 头像菜单
description: 用户头像与下拉菜单组合组件。
outline: deep
---

# AvatarMenu 头像菜单

`xy-avatar-menu` 适合工作台头部、侧边壳子和个人中心入口。

## 基础用法

:::demo 适合统一承接“用户信息 + 菜单命令”这一类轻量头部入口。
pro/avatar-menu/basic
:::

## AvatarMenu API

### AvatarMenu Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `username` | 用户名，显示在头像右侧的加粗文字 | `string` | `''` |
| `description` | 用户名下方的描述文字 | `string` | `''` |
| `items` | 下拉菜单项数组，即 `DropdownItem` 的别名 `AvatarMenuItem` | `AvatarMenuItem[]` | `[]` |
| `dropdown-props` | 透传给 `xy-dropdown` 的 props，触发方式固定为 `click` | `Partial<DropdownProps>` | `{}` |
| `avatar-props` | 透传给 `xy-avatar` 的 props | `Partial<AvatarProps>` | `{}` |

### AvatarMenu Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `command` | 点击下拉菜单命令项时派发 | `(command: AvatarMenuCommand) => void`，`AvatarMenuCommand` 即 `DropdownCommand \| string \| undefined` |
| `select` | 选中下拉菜单项时派发 | `(item: DropdownSelectItem) => void` |
