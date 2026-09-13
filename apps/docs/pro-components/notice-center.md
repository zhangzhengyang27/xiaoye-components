---
title: NoticeCenter 站内消息中心
description: 站内消息 tabs、消息项和底部动作区。
outline: deep
---

# NoticeCenter 站内消息中心

`xy-notice-center` 负责承接站内消息、待办和公告这类结构化列表展示，不与即时通知服务混用。

## 基础用法

:::demo 适合放在头部 Bell 触发器的浮层面板或侧边消息抽屉里。
pro/notice-center/basic
:::

## NoticeCenter API

### NoticeCenter Attributes

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `tabs` | 消息分组页签数据，每项含 `key / label / items`，`items` 为该组消息列表 | `NoticeCenterTab[]` | `[]` |
| `actions` | 底部动作按钮配置，每项含 `key / label / icon?` | `NoticeCenterAction[]` | `[]` |
| `max-height` | 消息列表区最大高度，数字按 `px` 处理 | `string \| number` | `360` |
| `empty-text` | 分组下无消息时的空态文案 | `string` | `'暂无消息'` |
| `default-tab` | 默认激活的页签 key，不传时取第一个分组 | `string` | `''` |

### NoticeCenter Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| `tabChange` | 切换消息分组时派发 | `(value: string) => void` |
| `itemClick` | 点击单条消息时派发 | `(tabKey: string, itemKey: string) => void` |
| `actionClick` | 点击底部动作按钮时派发 | `(action: NoticeCenterAction) => void` |
