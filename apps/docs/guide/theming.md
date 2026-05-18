---
title: 主题定制
description: 通过 CSS 变量定制 xiaoye-components 的视觉表现，包括颜色、间距、字体、圆角等设计令牌。
outline: deep
keywords:
  - theming
  - css variables
  - design tokens
  - customization
---

# 主题定制

xiaoye-components 使用 **CSS 变量（Custom Properties）** 实现主题系统。你可以通过覆盖 CSS 变量来定制组件的视觉表现，无需修改源码即可实现品牌色替换或全局样式调整。

## 概述

### 技术方案

- **纯 CSS 变量驱动**：所有设计令牌定义为 CSS 自定义属性
- **实时动态切换**：支持运行时修改，无需重新编译
- **层叠覆盖优先**：支持全局默认 → 项目级覆盖 → 组件级微调的三级覆盖体系
- **暗黑模式支持**：前台层（`xiaoye-ui`）内置完整暗黑模式；中后台层可通过扩展实现

### 命名规范

项目采用 `--xy-` 前缀的 BEM 风格命名：

```css
--xy-{category}-{property}[-variant]
```

**示例**：
- `--xy-color-primary` - 主色调
- `--xy-color-primary-hover` - 主色悬停态
- `--xy-radius-md` - 中等圆角
- `--xy-space-4` - 4 单位间距（16px）

---

## 设计令牌（Design Tokens）

### 🎨 颜色系统

#### 品牌色（Brand Colors）

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `--xy-color-primary` | 主色调 | `#409eff` |
| `--xy-color-primary-hover` | 主色悬停 | `#66b1ff` |
| `--xy-color-primary-active` | 主色激活 | `#337ecc` |
| `--xy-color-primary-soft` | 主色浅背景 | `#ecf5ff` |

#### 语义色（Semantic Colors）

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `--xy-color-info` | 信息色 | `#909399` |
| `--xy-color-success` | 成功色 | `#67c23a` |
| `--xy-color-warning` | 警告色 | `#e6a23c` |
| `--xy-color-danger` | 危险色 | `#f56c6c` |

> 每个语义色都包含 `-hover`、`-active`、`-soft` 变体。

#### 文本色（Text Colors）

| 变量名 | 用途 | 默认值 |
|--------|------|--------|
| `--xy-text-color` | 主文本 | `#303133` |
| `--xy-text-color-heading` | 标题文本 | `#1d2129` |
| `--xy-text-color-secondary` | 次要文本 | `#4e5969` |
| `--xy-text-color-subtle` | 辅助文本 | `#86909c` |
| `--xy-text-color-muted` | 弱化文本 | `#c9cdd4` |

#### 背景色与边框色

| 分类 | 关键变量 | 默认值 |
|------|----------|--------|
| 背景 | `--xy-bg-color` | `#ffffff` |
| 背景弱化 | `--xy-bg-color-muted` | `#f2f3f5` |
| 边框 | `--xy-border-color` | `#e5e6eb` |
| 边框强 | `--xy-border-color-strong` | `#c9cdd4` |

---

### 📐 间距系统

基于 **4px 网格系统**，提供 7 级标准间距：

| 变量名 | 值 | 使用场景 |
|--------|-----|----------|
| `--xy-space-1` | 4px | 紧凑元素内边距 |
| `--xy-space-2` | 8px | 小组件间距 |
| `--xy-space-3` | 12px | 表单字段间距 |
| `--xy-space-4` | 16px | 卡片内边距（最常用） |
| `--xy-space-5` | 24px | 区块间距 |
| `--xy-space-6` | 32px | 大区块间距 |
| `--xy-space-7` | 48px | 页面级间距 |

---

### 🔤 字体系统

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `--xy-font-size-xs` | 12px | 极小字号（辅助信息） |
| `--xy-font-size-sm` | 14px | 小字号（正文、表单） |
| `--xy-font-size-md` | 16px | 中等字号（默认） |
| `--xy-font-size-lg` | 18px | 大号字（标题） |
| `--xy-font-size-xl` | 20px | 特大号（页面标题） |
| `--xy-font-size-2xl` | 28px | 展示型大标题 |
| `--xy-line-height` | 1.5 | 全局行高 |

---

### ⭕ 圆角系统

| 变量名 | 值 | 使用场景 |
|--------|-----|----------|
| `--xy-radius-xs` | 2px | 小圆角（标签、徽标） |
| `--xy-radius-sm` | 4px | 小圆角（输入框、按钮） |
| `--xy-radius-md` | 8px | 中等圆角（卡片） |
| `--xy-radius-lg` | 12px | 大圆角（对话框） |
| `--xy-radius-xl` | 16px | 超大圆角（特殊容器） |
| `--xy-radius-pill` | 999px | 胶囊形（按钮组、标签） |

---

### 🌫️ 阴影系统

| 变量名 | 使用场景 |
|--------|----------|
| `--xy-shadow-xs` | 微阴影（悬浮状态） |
| `--xy-shadow-sm` | 小阴影（下拉菜单） |
| `--xy-shadow-md` | 中阴影（弹出层） |
| `--xy-shadow-lg` | 大阴影（模态对话框） |
| `--xy-shadow-card` | 卡片阴影 |
| `--xy-shadow-popup` | 弹出层阴影 |
| `--xy-shadow-modal` | 模态框阴影 |

---

## 快速开始

### 方法一：全局 CSS 覆盖（推荐）

在项目的全局样式中覆盖 CSS 变量：

```css
/* styles/theme-overrides.css */

:root {
  /* 修改主色调为企业品牌色 */
  --xy-color-primary: #1890ff;
  --xy-color-primary-hover: #40a9ff;
  --xy-color-primary-active: #096dd9;
  --xy-color-primary-soft: #e6f7ff;

  /* 修改圆角风格 */
  --xy-radius-sm: 2px;
  --xy-radius-md: 6px;

  /* 修改主文本颜色 */
  --xy-text-color: #262626;
}
```

在入口文件引入：

```ts
// main.ts
import 'xiaoye-components/style.css'
import './styles/theme-overrides.css'  // 在组件样式之后引入
```

### 方法二：作用域覆盖（单组件）

如果只需要在特定页面或组件中修改主题：

```vue
<template>
  <div class="custom-theme-page">
    <xy-button type="primary">自定义主题按钮</xy-button>
  </div>
</template>

<style scoped>
.custom-theme-page {
  /* 只在这个页面的根元素上覆盖 */
  --xy-color-primary: #722ed1;
  --xy-color-primary-hover: #9254de;
  --xy-color-primary-active: #531dab;
}
</style>
```

### 方法三：通过 ConfigProvider 配置

虽然 ConfigProvider 不直接管理 CSS 变量，但可以统一配置命名空间和尺寸：

```vue
<template>
  <xy-config-provider namespace="custom" size="lg">
    <App />
  </xy-config-provider>
</template>

<script setup lang="ts">
import { XyConfigProvider } from 'xiaoye-components'
</script>
```

这会将所有 CSS 类名前缀从 `xy-` 改为 `custom-`，适合多实例共存或样式隔离场景。

---

## 实战案例

### 案例 1：企业品牌色定制

将组件库适配到企业视觉识别系统：

```css
:root {
  /* 品牌主色 */
  --xy-color-primary: #0052cc;      /* IBM Blue */
  --xy-color-primary-hover: #0066ff;
  --xy-color-primary-active: #004399;
  --xy-color-primary-soft: #e6f0ff;

  /* 功能色调整 */
  --xy-color-success: #00a156;       /* 更鲜艳的绿色 */
  --xy-color-warning: #ff8800;        /* 更醒目的橙色 */
  --xy-color-danger: #dc3545;         /* 标准红色 */

  /* 圆角：更锐利的设计语言 */
  --xy-radius-xs: 0px;
  --xy-radius-sm: 2px;
  --xy-radius-md: 4px;
  --xy-radius-lg: 8px;
}
```

### 案例 2：高对比度无障碍模式

为视障用户优化可访问性：

```css
:root {
  /* 提升色彩对比度至 WCAG AA 标准 */
  --xy-text-color: #1a1a1a;
  --xy-text-color-secondary: #2d2d2d;
  --xy-border-color-strong: #666666;

  /* 增大焦点环 */
  --xy-focus-ring-color: #000000;
  --xy-focus-ring-width: 3px;
}

/* 键盘焦点增强 */
*:focus-visible {
  outline: 3px solid var(--xy-focus-ring-color);
  outline-offset: 2px;
}
```

### 案例 3：紧凑型后台系统

减少间距和字号，提升信息密度：

```css
:root {
  /* 缩小间距 */
  --xy-space-3: 8px;   /* 原 12px */
  --xy-space-4: 12px;  /* 原 16px */
  --xy-space-5: 16px;  /* 原 24px */

  /* 缩小字号 */
  --xy-font-size-sm: 13px;
  --xy-font-size-md: 14px;
  --xy-font-size-lg: 16px;

  /* 减小圆角 */
  --xy-radius-sm: 2px;
  --xy-radius-md: 4px;
}
```

---

## 暗黑模式

### 当前支持情况

::: warning 注意
- ⚠️ 当前版本暂未内置暗黑模式实现，但底层使用 CSS 变量（`--xy-` 前缀），可自行扩展
:::

### 扩展暗黑模式

如果需要为组件添加暗黑模式，可以手动定义变量覆盖：

```css
/* styles/dark-theme.css */

[data-theme='dark'],
[data-theme-mode='dark'] {
  /* 文本色反转 */
  --xy-text-color: #e5eaf3;
  --xy-text-color-secondary: #a0a5b9;
  --xy-text-color-subtle: #6b6f82;
  --xy-text-color-muted: #4a4e5c;

  /* 背景色转为深色 */
  --xy-bg-color: #1d1e22;
  --xy-bg-color-muted: #141418;
  --xy-bg-color-subtle: #0f1012;
  --xy-bg-color-elevated: #26282e;

  /* 边框色降低对比度 */
  --xy-border-color: #3a3d47;
  --xy-border-color-strong: #4a4e5c;

  /* 品牌色提高亮度 */
  --xy-color-primary: #409eff;
  --xy-color-primary-soft: #26364a;

  /* 阴影减弱或去除 */
  --xy-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --xy-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
}
```

---

## 最佳实践 💡

### 1. 分层管理主题变量

建议将主题变量分为三层：

```
styles/
├── tokens.css          # 设计令牌基础定义（来自组件库）
├── brand.css           # 企业品牌色覆盖（全局）
├── accessibility.css   # 无障碍增强（按需）
└── dark-theme.css      # 暗黑模式（按需）
```

### 2. 使用 CSS 自定义属性集（@property）

如果需要更精细的控制（如动画过渡），可以使用 `@property`：

```css
@property --xy-color-primary {
  syntax: '<color>';
  initial-value: #409eff;
  inherits: true;
}

/* 切换时会有平滑过渡 */
.theme-transition {
  transition: --xy-color-primary 0.3s ease;
}
```

### 3. 避免硬编码颜色值

❌ **错误做法**：在业务代码中写死颜色

```vue
<template>
  <!-- 不要这样做 -->
  <div style="color: #409eff">重要文本</div>
</template>
```

✅ **正确做法**：引用 CSS 变量或使用语义化类名

```vue
<template>
  <!-- 推荐方式 1：使用组件 -->
  <xy-text type="primary">重要文本</xy-text>

  <!-- 推荐方式 2：引用 CSS 变量 -->
  <div :style="{ color: 'var(--xy-color-primary)' }">重要文本</div>
</template>
```

### 4. 测试主题覆盖完整性

覆盖主题后，建议检查以下场景：
- [ ] 所有交互状态（hover/active/focus/disabled）
- [ ] 表单校验状态（success/warning/error）
- [ ] 反馈组件（message/notification/dialog）
- [ ] 数据展示组件（table/pagination/tree）
- [ ] 暗黑模式下所有组件的可读性

---

## 注意事项 ⚠️

1. **加载顺序很重要**：确保主题覆盖文件在 `xiaoye-components/style.css` **之后**引入
2. **浏览器兼容性**：CSS 变量需要 IE Edge 16+ / Chrome 49+ / Firefox 31+ / Safari 9.1+
3. **缓存问题**：修改变量后可能需要强制刷新浏览器（Cmd/Ctrl + Shift + R）
4. **性能影响**：CSS 变量的计算开销极小，但在大量元素同时过渡时需注意
5. **工具支持**：推荐使用 Chrome DevTools 的"Styles"面板调试 CSS 变量

---

## 相关资源

- [CSS Custom Properties 规范](https://www.w3.org/TR/css-variables/)
- [WCAG 2.1 对比度指南](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Design Systems Repository](https://designsystems.gallery/)
