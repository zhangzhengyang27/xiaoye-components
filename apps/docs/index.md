---
layout: home
title: xiaoye-components
titleTemplate: false
hero:
  name: xiaoye-components
  text: 中后台优先的 Vue 3 组件库
  tagline: 把后台页面里最常见的按钮、表单、弹层和表格，整理成一套低心智负担、中文优先、示例可直接复制的组件文档。
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: 组件总览
      link: /components/overview
    - theme: alt
      text: 页面示例
      link: /examples/admin
features:
  - title: 先覆盖高频页面
    details: 从按钮、输入、选择器、表单、弹层、表格和分页出发，优先解决后台系统里最常出现的交互路径。
  - title: 文档先服务落地
    details: 页面先给可运行示例，再解释适用场景和常用属性，减少“看懂 API 但拼不出页面”的落差。
  - title: 中文语境统一
    details: 不做国际化分流，把术语、提示、示例和页面语境都收敛在中文文档里，降低团队沟通成本。
---

## 从哪里开始读

<div class="xy-home-grid">
  <section class="xy-home-panel">
    <span class="xy-home-kicker">01</span>
    <h3>快速开始</h3>
    <p>先用最短路径完成安装、注册和第一个页面，明确模板标签与 TypeScript 导入的命名约定。</p>
    <a href="/guide/quick-start">进入快速开始</a>
  </section>

  <section class="xy-home-panel">
    <span class="xy-home-kicker">02</span>
    <h3>组件总览</h3>
    <p>先按“基础 / 表单 / 反馈 / 数据展示”的任务模型浏览，再决定深入哪一页看示例和 API。</p>
    <a href="/components/overview">查看组件总览</a>
  </section>

  <section class="xy-home-panel">
    <span class="xy-home-kicker">03</span>
    <h3>页面示例</h3>
    <p>如果你更关心真实页面组合方式，直接看管理后台闭环示例，会比单个组件更快建立整体感觉。</p>
    <a href="/examples/admin">查看页面示例</a>
  </section>
</div>

## 当前阶段能直接解决什么

<div class="xy-doc-grid">
  <div>
    <h3>基础操作</h3>
    <p>Button、Tag、Tabs、Tooltip、Space、Empty 负责页面里的主操作、状态呈现和信息提示。</p>
  </div>
  <div>
    <h3>表单录入</h3>
    <p>Input、Select、Form、Modal 已经可以串成完整的筛选栏和弹窗录入流程。</p>
  </div>
  <div>
    <h3>数据视图</h3>
    <p>Table、Pagination 先覆盖列表页最常见的行点击、空态、加载态和翻页需求。</p>
  </div>
</div>

## 推荐阅读顺序

1. 从 [快速开始](/guide/quick-start) 了解安装、注册和模板命名约定。
2. 在 [组件总览](/components/overview) 里先建立组件能力地图。
3. 再进入 [基础与表单组件](/components/basic-form) 或 [反馈与数据展示](/components/feedback-data)，按页面任务阅读具体用法。
4. 最后看 [管理后台闭环示例](/examples/admin)，确认这些组件在真实页面里的组合方式。

## 两分钟感受组件组合方式

<div class="xy-home-demo">
  <div class="xy-home-demo__intro">
    <xy-tag status="primary">页面片段</xy-tag>
    <h3>把筛选、操作和反馈放在同一套语义里</h3>
    <p>
      这不是单个组件的视觉陈列，而是更接近真实后台页面的最小片段。你可以先感受操作条、筛选控件和按钮风格，再进入具体组件页看 API。
    </p>
  </div>

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
</div>

## 这份文档怎么写

:::tip 阅读方式
文档会优先采用“示例在前，解释在后，API 摘要放最后”的结构。你可以先判断组件能不能解决当前问题，再决定要不要细看属性表。
:::

:::tip 命名约定
模板中的组件标签统一写成 `xy-button`、`xy-form-item` 这类 kebab-case；在 TypeScript 中导入组件时，仍然使用 `XyButton`、`XyFormItem` 这类 PascalCase 标识符。
:::
