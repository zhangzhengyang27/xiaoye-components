---
title: 设计令牌
description: xiaoye-components 的完整设计系统变量参考，包含颜色、间距、字体、圆角和阴影。
outline: deep
---

# 设计令牌

设计令牌（Design Tokens）是 xiaoye-components 视觉体系的基础构建块。所有组件的样式都基于这些 CSS 变量，通过覆盖它们即可实现全局主题定制。

## 颜色系统

### 主色调

| 变量名 | 默认值 | 用途 |
|--------|--------|------|
| `--xy-color-primary` | `#3b82f6` | 主色调，用于按钮、链接、选中态等主要交互元素 |
| `--xy-color-primary-light-3` | 浅主色 | hover 状态 |
| `--xy-color-primary-light-5` | 更浅主色 | 背景填充 |
| `--xy-color-primary-dark-2` | 深主色 | active 状态 |

### 功能色

| 变量名 | 默认值 | 用途 |
|--------|--------|------|
| `--xy-color-success` | `#22c55e` | 成功状态 |
| `--xy-color-warning` | `#f59e0b` | 警告状态 |
| `--xy-color-danger` | `#ef4444` | 错误/危险状态 |
| `--xy-color-info` | `#6b7280` | 信息提示 |

### 中性色

| 变量名 | 用途 |
|--------|------|
| `--xy-text-color-*` | 文本颜色（primary/secondary/tertiary/disabled） |
| `--xy-border-color-*` | 边框颜色（strong/base/subtle/faint） |
| `--xy-bg-color-*` | 背景色（page/elevated/overlay/muted） |

### 语义色

| 变量名 | 默认值 | 用途 |
|--------|--------|------|
| `--xy-color-link` | 继承主色 | 链接文字 |
| `--xy-color-link-hover` | 主色深色 | 链接悬停 |

## 间距系统

基于 **4px** 基础网格：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--xy-spacing-xs` | `4px` | 特小间距 |
| `--xy-spacing-sm` | `8px` | 小间距 |
| `--xy-spacing-md` | `16px` | 中间距（基础单位） |
| `--xy-spacing-lg` | `24px` | 大间距 |
| `--xy-spacing-xl` | `32px` | 特大间距 |

## 字体系统

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--xy-font-family-base` | 系统默认 | 基础字体族 |
| `--xy-font-size-xs` | `12px` | 特小字号 |
| `--xy-font-size-sm` | `13px` | 小字号 |
| `--xy-font-size-md` | `14px` | 中号（默认正文） |
| `--xy-font-size-lg` | `16px` | 大号 |
| `--xy-font-size-xl` | `18px` | 特大号 |
| `--xy-line-height-relaxed` | `1.6` | 宽松行高 |
| `--xy-font-weight-medium` | `500` | 中等字重 |
| `--xy-font-weight-semibold` | `600` | 半粗字重 |

## 圆角系统

| 变量名 | 默认值 | 用途 |
|--------|--------|------|
| `--xy-radius-xs` | `2px` | 小圆角（标签、徽章） |
| `--xy-radius-sm` | `4px` | 小圆角（输入框、按钮） |
| `--xy-radius-md` | `8px` | 中圆角（卡片） |
| `--xy-radius-lg` | `12px` | 大圆角（弹窗） |
| `--xy-radius-xl` | `16px` | 特大圆角（面板） |

## 阴影系统

| 变量名 | 说明 |
|--------|------|
| `--xy-shadow-sm` | 小阴影（悬浮元素） |
| `--xy-shadow-md` | 中阴影（下拉菜单、浮层） |
| `--xy-shadow-lg` | 大阴影（弹窗、抽屉） |

## 过渡动画

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--xy-transition-duration-fast` | `150ms` | 快速过渡 |
| `--xy-transition-duration-normal` | `250ms` | 标准过渡 |
| `--xy-transition-duration-slow` | `350ms` | 慢速过渡 |
| `--xy-transition-ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | 标准缓动函数 |

## 使用示例

### 自定义品牌色

```css
:root {
  --xy-color-primary: #6366f1;
  --xy-color-primary-light-3: #818cf8;
  --xy-color-primary-light-5: #c7d2fe;
  --xy-color-primary-dark-2: #4f46e5;
}
```

### 调整间距节奏

```css
:root {
  --xy-spacing-sm: 12px;
  --xy-spacing-md: 20px;
  --xy-spacing-lg: 28px;
}
```

完整的 CSS 变量定义请查看源码：[tokens.css](https://github.com/xiaoye/xiaoye-components/blob/main/packages/xiaoye-primitives/src/theme/tokens.css)

> 更多主题定制实践请参考 [主题定制指南](./guide/theming)。
