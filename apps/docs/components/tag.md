---
title: Tag 标签
---

# Tag 标签

用于展示轻量状态、分类标记或辅助信息。

## 基础用法

<xy-space wrap>
  <xy-tag>默认</xy-tag>
  <xy-tag status="primary">进行中</xy-tag>
  <xy-tag status="success">已完成</xy-tag>
  <xy-tag status="warning">待确认</xy-tag>
  <xy-tag status="danger">已拒绝</xy-tag>
</xy-space>

## 圆角与关闭

<xy-space wrap>
  <xy-tag round>圆角标签</xy-tag>
  <xy-tag closable>可关闭</xy-tag>
</xy-space>

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `status` | 状态色 | `ComponentStatus` | `'neutral'` |
| `size` | 尺寸 | `ComponentSize` | 继承全局配置 |
| `round` | 是否为圆角样式 | `boolean` | `false` |
| `closable` | 是否显示关闭按钮 | `boolean` | `false` |

## 事件

| 事件 | 说明 |
| --- | --- |
| `close` | 点击关闭按钮时触发 |
