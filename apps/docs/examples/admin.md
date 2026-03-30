---
title: 管理后台闭环示例
description: 用一个页面片段串起 SearchForm、ProTable、OverlayForm、DetailPanel 和 AuditTimeline。
outline: deep
---

<script setup lang="ts">
import AdminFlowDemo from "../.vitepress/theme/components/AdminFlowDemo.vue";
</script>

# 管理后台闭环示例

这页用一个单页后台片段，把筛选、列表、覆盖层编辑、详情查看和历史记录放回同一条真实链路里。

<div class="xy-scene-strip">
  <div>
    <strong>筛选栏</strong>
    <span>SearchForm</span>
  </div>
  <div>
    <strong>列表主干</strong>
    <span>ProTable</span>
  </div>
  <div>
    <strong>详情与编辑</strong>
    <span>DetailPanel / OverlayForm</span>
  </div>
  <div>
    <strong>历史与说明</strong>
    <span>AuditTimeline</span>
  </div>
</div>

## 这个示例覆盖了什么

<div class="xy-doc-grid">
  <div>
    <h3>页面分区</h3>
    <p>使用 Tabs 让成员台账、账单链路和风控排查共享同一套增强层页面骨架。</p>
  </div>
  <div>
    <h3>筛选 + 列表</h3>
    <p>SearchForm 和 ProTable 先把后台页的查询、列表、分页和工具栏收进稳定骨架。</p>
  </div>
  <div>
    <h3>详情 + 编辑</h3>
    <p>收口后的理解方式是 OverlayForm 负责覆盖层编辑，DetailPanel 负责覆盖层详情查看，而不是继续分别记忆多套容器名。</p>
  </div>
  <div>
    <h3>历史 + 说明</h3>
    <p>AuditTimeline 负责把关键操作、审批节点和补充说明沉淀成稳定历史区。</p>
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
- `SearchForm` 里的输入框支持 `Enter` 触发查询
- `AutoComplete` 和 `Select` 都支持方向键、`Enter` 和 `Escape`
- 当前实现里，覆盖层编辑和覆盖层详情都已经统一收进 `OverlayForm / DetailPanel` 这两条公开链路
- 页面中的关键动作和说明信息会同步沉淀到 `AuditTimeline`

## 从这个页面可以直接复用什么

1. 后台页骨架可以先用 `SearchForm + ProTable` 稳住，再按需要接 `OverlayForm`、`DetailPanel` 和 `AuditTimeline`。
2. 编辑和查看最好先按“覆盖层编辑 / 覆盖层详情”两类能力理解，再根据页面上下文选择抽屉或弹窗实现。
3. 批量条、头部条、状态条这类局部块更适合作为页面内部片段，而不是优先暴露给使用方的公开选型入口。

## 继续往增强层迁移

- 如果你只需要最小后台骨架，先保留 [SearchForm 搜索表单](/pro-components/search-form) 和 [ProTable 增强表格](/pro-components/pro-table)。
- 页面有编辑链路时，优先按 [OverlayForm 覆盖层表单](/pro-components/overlay-form) 的心智接入。
- 页面有详情查看和历史说明时，优先按 [DetailPanel 详情面板](/pro-components/detail-panel) 与 [AuditTimeline 审计时间线](/pro-components/audit-timeline) 的组合来理解。
- 页面进入完整后台闭环后，再回看 [CrudPage 增删改查页面](/pro-components/crud-page) 和 [DetailPage 详情页面容器](/pro-components/detail-page)。

:::tip 推荐迁移方式
如果你准备把这段示例迁到业务项目里，建议先保留增强层的职责边界，再按业务替换字段、列配置和动作实现。
:::
