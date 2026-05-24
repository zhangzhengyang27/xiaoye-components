# 示例页面设计规范

## 设计原则

1. **企业级沉稳**：克制装饰，注重信息层级和可读性
2. **响应式优先**：移动端、平板、桌面端均需良好体验
3. **一致性**：所有示例遵循统一的布局和间距规范

---

## 布局规范

### 页面结构

```vue
<!-- 标准示例页面结构 -->
<template>
  <div class="xy-doc-stack">
    <!-- 1. 页面头部（可选） -->
    <div class="demo-page-header">
      <div class="demo-page-header__intro">
        <div class="demo-page-header__eyebrow">分类标签</div>
        <h2 class="demo-page-header__title">页面标题</h2>
        <p class="demo-page-header__description">描述文本，说明这个示例的目的。</p>
      </div>
      <div class="demo-page-header__meta">
        <!-- 状态标签、控制按钮等 -->
      </div>
    </div>

    <!-- 2. 主内容区 -->
    <div class="demo-page-content">
      <!-- 根据内容选择合适的布局 -->
    </div>
  </div>
</template>
```

### 布局模式

| 模式 | 使用场景 | Grid 写法 |
|------|---------|----------|
| 单列 | 简单示例、单一组件 | `grid-template-columns: 1fr` |
| 双列 | 对比、表单+预览 | `repeat(2, 1fr)` |
| 三列 | 卡片列表、统计数据 | `repeat(3, minmax(0, 1fr))` |
| 主从 | 列表+详情 | `minmax(0, 1.6fr) minmax(280px, 1fr)` |

### 响应式断点

```css
/* 桌面端优先设计 */
/* 平板：768px - 1024px */
@media (max-width: 1024px) { }

/* 移动端：< 768px */
@media (max-width: 768px) { }

/* 小屏移动端：< 480px */
@media (max-width: 480px) { }
```

---

## 间距规范

### 间距层级

| 名称 | 大小 | 使用场景 |
|------|------|---------|
| xs | 4px | 紧凑元素内部 |
| sm | 8px | 标签、徽章之间 |
| md | 12px | 相关元素分组 |
| lg | 16px | 主要元素间距 |
| xl | 20px | 分组之间 |
| 2xl | 24px | 区块之间 |
| 3xl | 32px | 大区块之间 |

### 容器内边距

```css
/* 卡片/面板内边距 */
padding: 16px 18px;      /* 标准 */
padding: 20px 24px;      /* 宽松 */

/* 区块间距 */
gap: 16px;               /* 紧凑 */
gap: 20px;               /* 标准 */
gap: 24px;               /* 宽松 */
```

---

## 圆角规范

| 场景 | 圆角值 | 备注 |
|------|--------|------|
| 标签、徽章 | 999px (pill) | 完全圆角 |
| 按钮、输入框 | 6px | 轻微圆角 |
| 卡片、面板 | 10px - 16px | 中等圆角 |
| 大容器 | 20px - 24px | 大圆角 |

---

## 色彩使用

### 背景层级

```css
/* 使用 color-mix 实现层次感 */
background: var(--xy-bg-color);                          /* 最底层 */
background: var(--xy-surface-raised);                     /* 卡片/面板 */
background: color-mix(in srgb, var(--xy-bg-color-subtle) 80%, white);  /* 高亮区域 */
background: var(--xy-color-primary-soft);                 /* 主色调强调 */
```

### 边框使用

```css
/* 边框样式 */
border: 1px solid var(--xy-border-color-subtle);          /* 默认边框 */
border: 1px solid color-mix(in srgb, var(--xy-border-color) 70%, white); /* 浅色边框 */
```

---

## 阴影使用

```css
/* 阴影层级 */
--shadow-xs: 0 1px 2px rgba(28, 28, 30, 0.04);     /* 轻微抬升 */
--shadow-sm: 0 6px 18px rgba(28, 28, 30, 0.08);    /* 卡片悬停 */
--shadow-md: 0 12px 30px rgba(28, 28, 30, 0.10);    /* 弹窗 */
--shadow-lg: 0 20px 48px rgba(28, 28, 30, 0.14);    /* 模态框 */

/* 使用建议 */
box-shadow: var(--shadow-xs);    /* 默认状态 */
box-shadow: var(--shadow-sm);    /* 悬停状态 */
box-shadow: var(--shadow-md);    /* 浮层状态 */
```

---

## 排版规范

### 字号层级

```css
--font-size-xs: 12px;    /* 辅助说明 */
--font-size-sm: 12px;    /* 次要信息 */
--font-size-md: 14px;    /* 正文 */
--font-size-lg: 16px;    /* 小标题 */
--font-size-xl: 20px;    /* 页面标题 */
--font-size-2xl: 28px;   /* 大标题 */
```

### 行高建议

| 场景 | 行高 |
|------|------|
| 标题 | 1.2 - 1.3 |
| 正文 | 1.6 - 1.75 |
| 紧凑文本 | 1.4 - 1.5 |

---

## 响应式策略

### 移动端适配原则

1. **布局降级**：多列 → 单列
2. **间距缩减**：gap/padding 适当减小
3. **字体缩放**：大标题适当缩小
4. **操作简化**：按钮可适当放大便于点击

### 典型响应式写法

```css
@media (max-width: 1024px) {
  .grid-3col {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .grid-3col {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 12px;
  }

  .page-title {
    font-size: 24px;
  }
}
```

---

## 代码风格

### CSS 类命名

```vue
<!-- 使用 BEM 变体，层级用 __ 分隔 -->
<div class="demo-component">
  <div class="demo-component__section">
    <div class="demo-component__item"></div>
    <div class="demo-component__item--active"></div>
  </div>
</div>
```

### 示例结构

```vue
<script setup lang="ts">
// 数据定义
// 业务逻辑
// 函数方法
</script>

<template>
  <!-- 模板结构 -->
</template>

<style scoped>
/* 按以下顺序组织 */
/* 1. 布局相关 */
/* 2. 尺寸相关 */
/* 3. 背景边框 */
/* 4. 排版 */
/* 5. 交互状态 */
/* 6. 响应式 */
</style>
```

---

## 常见模式

### 页面头部模式

```vue
<div class="demo-page-header">
  <div class="demo-page-header__intro">
    <div class="demo-page-header__eyebrow">SCENE</div>
    <h2 class="demo-page-header__title">标题</h2>
    <p class="demo-page-header__description">描述文本...</p>
  </div>
  <div class="demo-page-header__actions">
    <!-- 操作按钮 -->
  </div>
</div>
```

### 卡片网格模式

```vue
<div class="demo-card-grid">
  <div v-for="item in items" :key="item.id" class="demo-card">
    <!-- 卡片内容 -->
  </div>
</div>

<style scoped>
.demo-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
</style>
```

### 工具栏模式

```vue
<div class="demo-toolbar">
  <div class="demo-toolbar__filters">
    <!-- 筛选控件 -->
  </div>
  <div class="demo-toolbar__actions">
    <!-- 操作按钮 -->
  </div>
</div>
```
