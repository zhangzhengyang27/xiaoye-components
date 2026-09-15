---
title: 主题定制
description: 通过 CSS 变量定制 xiaoye-components 的视觉表现：三层令牌架构、亮暗双主题、品牌色替换与暗黑模式接入。
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

- **纯 CSS 变量驱动**：所有设计令牌定义为 CSS 自定义属性，以 Stripe 设计语言为蓝本
- **实时动态切换**：支持运行时修改，无需重新编译
- **层叠覆盖优先**：支持全局默认 → 项目级覆盖 → 组件级微调的三级覆盖体系
- **亮暗双主题**：内置完整暗黑模式，在根元素设置 `data-theme="dark"` 即可切换

### 命名规范

令牌采用三层架构，命名规则唯一：

```
基元层  --xy-{色板}-{阶}      如 --xy-purple-600、--xy-gray-500
语义层  --xy-{角色}[-{状态}]  如 --xy-brand-hover、--xy-text-muted、--xy-shadow-3
刻度层  --xy-{刻度}-{档}      如 --xy-radius-md、--xy-space-4、--xy-font-size-lg
```

组件只消费语义层；基元层是调色原料；刻度层与主题无关。完整变量清单见 [设计令牌](/design-tokens)。

---

## 快速开始

### 方法一：全局 CSS 覆盖（推荐）

在项目的全局样式中覆盖 CSS 变量：

```css
/* styles/theme-overrides.css */

:root {
  /* 修改主色调为企业品牌色 */
  --xy-brand: #1890ff;
  --xy-brand-hover: #40a9ff;
  --xy-brand-active: #096dd9;
  --xy-brand-soft: rgba(24, 144, 255, 0.08);
  --xy-brand-border: #91caff;

  /* 修改圆角风格 */
  --xy-radius-sm: 2px;
  --xy-radius-md: 4px;

  /* 修改主文本颜色 */
  --xy-text-primary: #262626;
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
  --xy-brand: #722ed1;
  --xy-brand-hover: #9254de;
  --xy-brand-active: #531dab;
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

如果你是在做后台项目的样式收口，建议先看 [后台迁移指南](/guide/backend-migration)，再决定是继续全局覆盖还是直接改组件实例 token。

## 后台收口入口

如果你的目标是把业务页面里的浮层、通知和表格覆盖收回到组件库层，优先从这里开始：

- [后台迁移指南](/guide/backend-migration)
- [Table 表格](/components/table)
- [Popover 气泡卡片](/components/popover)
- [Dropdown 下拉菜单](/components/dropdown)

当前更推荐的后台主题策略是：

- 全局层只保留品牌色、通用背景色和边框强度这类全局 token。
- 页面层优先使用 wrapper 级变量，让 `table / select / date-picker / cascader / tree-select` 这类组件在当前页面主题里自然接轨。
- 不要再把组件内部类名当成公开定制入口；纯视觉问题优先回到组件实例 token 和组件库默认基线。

### 案例 1：企业品牌色定制

将组件库适配到企业视觉识别系统：

```css
:root {
  /* 品牌主色 */
  --xy-brand: #0052cc;      /* IBM Blue */
  --xy-brand-hover: #0066ff;
  --xy-brand-active: #004399;
  --xy-brand-soft: rgba(0, 82, 204, 0.08);
  --xy-brand-border: #8eb8f0;

  /* 功能色调整（记得同步 -hover / -active / -text 变体） */
  --xy-success: #00a156;
  --xy-warning: #ff8800;
  --xy-danger: #dc3545;

  /* 圆角：更锐利的设计语言 */
  --xy-radius-xs: 0px;
  --xy-radius-sm: 2px;
  --xy-radius-md: 4px;
  --xy-radius-lg: 6px;
}
```

### 案例 2：高对比度无障碍模式

为视障用户优化可访问性：

```css
:root {
  /* 提升色彩对比度至 WCAG AA 标准 */
  --xy-text-primary: #1a1a1a;
  --xy-text-secondary: #2d2d2d;
  --xy-text-muted: #4d5768;
  --xy-border-strong: #666666;

  /* 增大焦点环 */
  --xy-focus-ring-color: rgba(0, 0, 0, 0.35);
  --xy-focus-border: #000000;
}

/* 键盘焦点增强 */
*:focus-visible {
  outline: 3px solid var(--xy-focus-border);
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
  --xy-space-5: 16px;  /* 原 20px */

  /* 缩小字号 */
  --xy-font-size-sm: 12px;
  --xy-font-size-md: 13px;
  --xy-font-size-lg: 15px;

  /* 减小圆角 */
  --xy-radius-sm: 2px;
  --xy-radius-md: 4px;
}
```

---

## 暗黑模式

### 当前支持情况

::: tip 内置支持
组件库内置完整的暗黑主题。所有颜色类语义令牌都在 `[data-theme="dark"]` 下有官方暗色值（取自 Stripe 暗色目录：靛黑页面底 `#0e0f2e`、提亮品牌色、白色透明度边框、黑色主导阴影）。
:::

### 接入方式

在根元素上切换 `data-theme` 属性即可，无需额外样式：

```ts
// Vue 3 示例
const isDark = useDark() // 任一暗色方案源
watchEffect(() => {
  document.documentElement.dataset.theme = isDark.value ? 'dark' : 'light'
})
```

### 局部暗色区域

`data-theme` 可以放在任意容器上，实现页面局部暗色区块：

```html
<div data-theme="dark">
  <!-- 这里的组件使用暗色令牌 -->
</div>
```

### 自定义暗色值

在 `[data-theme="dark"]` 下覆盖语义令牌即可，建议只覆写语义层，不要动基元层：

```css
[data-theme='dark'] {
  --xy-bg-page: #0d1117;
  --xy-bg-container: #161b22;
  --xy-border: rgba(240, 246, 252, 0.1);
  --xy-brand: #58a6ff;
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
└── dark-theme.css      # 暗黑模式微调（按需）
```

### 2. 覆盖语义层，而不是基元层

❌ 把 `--xy-gray-500` 改掉：所有依赖该阶的语义令牌都会被波及，效果不可控。
✅ 覆盖 `--xy-text-muted`、`--xy-bg-sunken` 这类语义令牌：意图明确，影响面清晰。

### 3. 避免硬编码颜色值

❌ **错误做法**：在业务代码中写死颜色

```vue
<template>
  <!-- 不要这样做 -->
  <div style="color: #533afd">重要文本</div>
</template>
```

✅ **正确做法**：引用 CSS 变量或使用语义化类名

```vue
<template>
  <!-- 推荐方式 1：使用组件 -->
  <xy-text type="primary">重要文本</xy-text>

  <!-- 推荐方式 2：引用 CSS 变量 -->
  <div :style="{ color: 'var(--xy-brand)' }">重要文本</div>
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
2. **旧命名兼容**：v1 旧变量名（`--xy-color-primary` 等）通过兼容层继续生效，但计划在下个 major 移除，请尽早迁移
3. **缓存问题**：修改变量后可能需要强制刷新浏览器（Cmd/Ctrl + Shift + R）
4. **性能影响**：CSS 变量的计算开销极小，但在大量元素同时过渡时需注意
5. **工具支持**：推荐使用 Chrome DevTools 的"Styles"面板调试 CSS 变量

---

## 相关资源

- [设计令牌完整参考](/design-tokens)
- [CSS Custom Properties 规范](https://www.w3.org/TR/css-variables/)
- [WCAG 2.1 对比度指南](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
