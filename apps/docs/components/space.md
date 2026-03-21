---
title: Space 间距
---

# Space 间距

用于给一组行内或纵向元素建立统一间距，适合按钮组、筛选栏和表单操作区。

## 基础用法

<xy-space>
  <xy-button>保存</xy-button>
  <xy-button variant="outline">取消</xy-button>
</xy-space>

## 方向与换行

<xy-space direction="vertical" align="start">
  <xy-tag status="primary">纵向排列</xy-tag>
  <xy-tag status="success">适合信息堆叠</xy-tag>
</xy-space>

<xy-space wrap>
  <xy-tag>筛选项 A</xy-tag>
  <xy-tag>筛选项 B</xy-tag>
  <xy-tag>筛选项 C</xy-tag>
  <xy-tag>筛选项 D</xy-tag>
</xy-space>

## 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `size` | 间距大小 | `number \| 'sm' \| 'md' \| 'lg'` | `'md'` |
| `direction` | 排列方向 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `wrap` | 是否允许换行 | `boolean` | `false` |
| `align` | 交叉轴对齐方式 | `'start' \| 'center' \| 'end' \| 'stretch'` | `'center'` |
