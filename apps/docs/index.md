---
layout: home
title: xiaoye-components
titleTemplate: false
hero:
  name: xiaoye-components
  text: 中后台优先的 Vue 3 组件库
  tagline: 把后台页面里最常见的按钮、表单、弹层和表格，整理成一套中文优先、示例先行、可直接落地的组件文档。
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: 组件总览
      link: /components/overview
    - theme: alt
      text: Scheduler 场景
      link: /examples/scheduler
    - theme: alt
      text: 页面示例
      link: /examples/admin
features:
  - title: 先覆盖高频页面
    details: 从按钮、输入、选择器、表单、弹层、表格和分页出发，优先解决后台系统里最常出现的交互路径。
  - title: 文档先服务落地
    details: 页面先给可运行示例，再解释适用场景和常用属性。
  - title: 中文语境统一
    details: 术语、提示、示例和页面语境都收敛在中文文档里。
---

## 从哪里开始读

<div class="xy-home-grid xy-home-grid--routes">
  <section class="xy-home-panel">
    <span class="xy-home-kicker">01</span>
    <h3>快速开始</h3>
    <p>先用最短路径完成安装、注册和第一个页面。</p>
    <a href="/guide/quick-start">进入快速开始</a>
  </section>

  <section class="xy-home-panel">
    <span class="xy-home-kicker">02</span>
    <h3>组件总览</h3>
    <p>先按“基础 / 录入 / 反馈 / 展示”建立能力地图。</p>
    <a href="/components/overview">查看组件总览</a>
  </section>

  <section class="xy-home-panel">
    <span class="xy-home-kicker">03</span>
    <h3>页面示例</h3>
    <p>如果你更关心真实组合方式，直接看后台闭环示例。</p>
    <a href="/examples/admin">查看页面示例</a>
  </section>
</div>

## 当前推荐入口

<div class="xy-doc-grid">
  <div>
    <h3>Scheduler 排期日历</h3>
    <p>如果你要查 `xy-scheduler` 的 props、events、slots、payload 类型和接入顺序，先从组件页进入。</p>
    <a href="/components/scheduler">查看 Scheduler API</a>
  </div>
  <div>
    <h3>Scheduler 场景示例</h3>
    <p>如果你想直接看整块日历、月 / 周 / 日切换、框选创建、拖拽改期和外部拖入，先从场景页进入。</p>
    <a href="/examples/scheduler">查看 Scheduler 场景示例</a>
  </div>
  <div>
    <h3>Scheduler 业务接入模板</h3>
    <p>如果你已经准备接接口、抽屉和回写逻辑，直接看业务接入模板会更快。</p>
    <a href="/examples/scheduler-template">查看业务接入模板</a>
  </div>
</div>

## 当前阶段能直接解决什么

<p class="xy-section-lead">
  首页按后台页面最常出现的任务链路来组织。先看能力边界，再决定进入哪一页查 API。
</p>

<div class="xy-doc-grid">
  <div>
    <h3>基础操作</h3>
    <p>Button、Link、Tag、Tabs、Tooltip、Space、Empty 负责主操作、弱跳转、状态呈现和轻提示。</p>
    <a href="/components/button">先看 Button</a>
  </div>
  <div>
    <h3>表单录入</h3>
    <p>Input、Select、Form、Modal 已经可以串成完整的筛选栏和录入流程。</p>
    <a href="/components/form">看 Form</a>
  </div>
  <div>
    <h3>数据视图</h3>
    <p>Table、Pagination 和 Scheduler 已覆盖列表页、排期面板里最常见的展示、翻页和时间编排需求。</p>
    <a href="/components/table">看 Table</a>
  </div>
</div>

## 推荐阅读顺序

1. 从 [快速开始](/guide/quick-start) 了解安装、注册和模板命名约定。
2. 在 [组件总览](/components/overview) 里先建立组件能力地图。
3. 如果你在做排期面板，先看 [Scheduler 排期日历](/components/scheduler) 和 [Scheduler 场景示例](/examples/scheduler)。
4. 再进入 [Form 表单](/components/form) 或 [Table 表格](/components/table)，按当前任务查具体用法。
5. 最后看 [管理后台闭环示例](/examples/admin)，确认这些组件在真实页面里的组合方式。

## 两分钟感受组件组合方式

<div class="xy-home-demo">
  <div class="xy-home-demo__intro">
    <xy-tag status="primary">页面片段</xy-tag>
    <h3>把筛选、操作和反馈放在同一套语义里</h3>
    <p>
      这不是单个组件的视觉陈列，而是更接近真实后台页面的最小片段。先感受操作条、筛选控件和按钮层级，再进入具体组件页看 API。
    </p>
  </div>

  <div class="xy-home-demo__surface">
    <xy-space wrap>
      <xy-input placeholder="搜索成员 / 项目" clearable />
      <xy-select
        :options="[
          { label: '全部角色', value: 'all' },
          { label: '管理员', value: 'admin' },
          { label: '成员', value: 'member' }
        ]"
        placeholder="角色筛选"
        clearable
      />
      <xy-button type="primary">新建成员</xy-button>
      <xy-button plain>导出数据</xy-button>
    </xy-space>

    <div class="xy-home-metrics">
      <div>
        <strong>18+</strong>
        <span>单组件文档</span>
      </div>
      <div>
        <strong>1</strong>
        <span>后台闭环示例</span>
      </div>
    </div>
  </div>
</div>

## 这份文档怎么写

:::tip 阅读方式
文档会优先采用“示例在前，解释在后，API 摘要放最后”的结构。你可以先判断组件能不能解决当前问题，再决定要不要细看属性表。
:::

:::tip 命名约定
模板中的组件标签统一写成 `xy-button`、`xy-form-item` 这类 kebab-case；在 TypeScript 中导入组件时，仍然使用 `XyButton`、`XyFormItem` 这类 PascalCase 标识符。
:::
