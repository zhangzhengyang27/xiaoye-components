---
layout: home
title: xiaoye-components
titleTemplate: false
hero:
  name: xiaoye-components
  text: 通用基础组件库 + 中后台业务增强组件库
  tagline: 用基础层承接通用组件，用增强层承接中后台高频闭环，把页面级编排、请求链路和业务容器整理成可直接落地的中文文档。
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: 基础组件总览
      link: /components/overview
    - theme: alt
      text: 增强组件总览
      link: /pro-components/overview
    - theme: alt
      text: 页面示例
      link: /examples/admin
features:
  - title: 基础层保持中性
    details: 用 `xiaoye-components` 承接原子组件、通用容器、基础输入、基础展示和浮层。
  - title: 增强层面向中后台
    details: 用 `xiaoye-pro-components` 承接筛选栏、请求表单、详情编排、页面容器、批量与流程增强件。
  - title: 文档先服务落地
    details: 页面先给可运行示例，再解释适用场景和常用属性，并持续覆盖完整后台闭环。
---

## 从哪里开始读

<div class="xy-home-grid xy-home-grid--routes">
  <section class="xy-home-panel">
    <span class="xy-home-kicker">01</span>
    <h3>快速开始</h3>
    <p>先用最短路径完成基础层或增强层的安装、注册和第一个页面。</p>
    <a href="/guide/quick-start">进入快速开始</a>
  </section>

  <section class="xy-home-panel">
    <span class="xy-home-kicker">02</span>
    <h3>基础组件总览</h3>
    <p>先按“基础 / 录入 / 反馈 / 展示”建立基础层能力地图。</p>
    <a href="/components/overview">查看基础组件</a>
  </section>

  <section class="xy-home-panel">
    <span class="xy-home-kicker">03</span>
    <h3>增强组件总览</h3>
    <p>如果你更关心中后台页面编排，直接进入增强层组件池。</p>
    <a href="/pro-components/overview">查看增强组件</a>
  </section>

  <section class="xy-home-panel">
    <span class="xy-home-kicker">04</span>
    <h3>页面示例</h3>
    <p>如果你更关心真实组合方式，直接看后台闭环示例。</p>
    <a href="/examples/admin">查看页面示例</a>
  </section>
</div>

## 当前推荐入口

<div class="xy-doc-grid">
  <div>
    <h3>基础层接入</h3>
    <p>如果你准备先接基础组件，直接从快速开始和基础组件总览进入。</p>
    <a href="/guide/quick-start">查看基础层接入</a>
  </div>
  <div>
    <h3>增强层接入</h3>
    <p>如果你要直接接中后台筛选、列表、详情、编辑和请求编排，先从增强组件页进入。</p>
    <a href="/pro-components/overview">查看增强层组件</a>
  </div>
  <div>
    <h3>后台闭环示例</h3>
    <p>如果你想直接看基础层和增强层如何放回同一个真实后台页面，直接看旗舰示例。</p>
    <a href="/examples/admin">查看后台闭环示例</a>
  </div>
</div>

## 当前阶段能直接解决什么

<p class="xy-section-lead">
  首页按“基础层 + 增强层”的双产品线组织。先确认自己是要搭基础组件，还是要搭中后台页面编排，再决定进入哪一页查 API。
</p>

<div class="xy-doc-grid">
  <div>
    <h3>基础操作</h3>
    <p>Button、Link、Tag、Tabs、Tooltip、Alert、Space、Empty 这些能力继续留在基础层。</p>
    <a href="/components/button">先看 Button</a>
  </div>
  <div>
    <h3>增强表单</h3>
    <p>SearchForm、ProForm、OverlayForm、RequestForm 和 StepsForm 承接后台表单编排。</p>
    <a href="/pro-components/overview">看增强表单</a>
  </div>
  <div>
    <h3>增强页面</h3>
    <p>ListPage、CrudPage、DetailPage 和 SplitLayoutPage 承接页面级闭环。</p>
    <a href="/examples/admin">看页面闭环</a>
  </div>
</div>

## 推荐阅读顺序

1. 从 [快速开始](/guide/quick-start) 了解基础层与增强层的接入方式。
2. 在 [组件总览](/components/overview) 里先建立基础层能力地图。
3. 如果你在做中后台页面闭环，直接进入 [增强组件总览](/pro-components/overview)。
4. 再进入 [Form 表单](/components/form)、[Table 表格](/components/table) 或增强组件页，按当前任务查具体用法。
5. 最后看 [管理后台闭环示例](/examples/admin)，确认基础层与增强层在真实页面里的组合方式。

## 两分钟感受双产品线组合方式

<HomeProductLineDemo />

## 这份文档怎么写

:::tip 阅读方式
文档会优先采用“示例在前，解释在后，API 摘要放最后”的结构。你可以先判断组件能不能解决当前问题，再决定要不要细看属性表。
:::

:::tip 命名约定
模板中的组件标签统一写成 `xy-button`、`xy-form-item` 这类 kebab-case；在 TypeScript 中导入组件时，仍然使用 `XyButton`、`XyFormItem` 这类 PascalCase 标识符。
:::
