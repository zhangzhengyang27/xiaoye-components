---
title: 管理后台闭环示例
description: 用一个页面片段串起 Tabs、筛选栏、列表、行操作和侧边编辑。
outline: deep
---

<script setup lang="ts">
import AdminFlowDemo from "../.vitepress/theme/components/AdminFlowDemo.vue";
</script>

# 管理后台闭环示例

这页用一个最小后台页面片段，把筛选、列表、行操作、侧边编辑和状态反馈放回同一条真实链路里。

<div class="xy-scene-strip">
  <div>
    <strong>筛选栏</strong>
    <span>Input / Select / Tooltip / Popover</span>
  </div>
  <div>
    <strong>列表主干</strong>
    <span>Table / Pagination / Dropdown</span>
  </div>
  <div>
    <strong>侧边编辑</strong>
    <span>Drawer / Form / Button</span>
  </div>
</div>

## 这个示例覆盖了什么

<div class="xy-doc-grid">
  <div>
    <h3>页面分区</h3>
    <p>使用 Tabs 让成员、项目、账单等视图共享同一套操作区和内容区域。</p>
  </div>
  <div>
    <h3>筛选 + 轻说明</h3>
    <p>Input、Select、Tooltip、Popover 放在同一条操作带里，覆盖搜索、筛选和说明层。</p>
  </div>
  <div>
    <h3>列表 + 行操作</h3>
    <p>Table、Dropdown、Pagination 组合成后台列表页主干，支持更多操作入口。</p>
  </div>
  <div>
    <h3>侧边编辑</h3>
    <p>Drawer 适合详情查看和大表单编辑，保留列表页上下文。</p>
  </div>
</div>

## 推荐怎么读

<p class="xy-section-lead">
  如果你是第一次看这个页面，建议直接先看下面的页面片段，再回过头看上面的能力拆分。
</p>

## 页面片段

<div class="xy-scene-frame">
  <AdminFlowDemo />
</div>

## 交互约定

- `Tabs` 支持 `ArrowLeft / ArrowRight / Home / End`
- `Select` 支持方向键、`Enter` 和 `Escape`
- `Dropdown` 支持 `ArrowUp / ArrowDown / Home / End`
- `Tooltip / Popover` 都支持键盘路径，但用途不同
- `Drawer` 和 `Dialog` 一样会恢复焦点到触发位置

## 从这个页面可以直接复用什么

1. 顶部操作区可以同时承载筛选、轻提示和主操作，不必把所有说明都塞进 Tooltip。
2. 表格的“更多操作”适合交给 Dropdown，而不是在一行里堆很多 text 按钮。
3. 详情编辑或大表单更适合 Drawer，能保留列表页上下文。

:::tip 推荐迁移方式
如果你准备把这段示例迁到业务项目里，建议先保留交互顺序，再按业务替换文案、字段和列配置。
:::
