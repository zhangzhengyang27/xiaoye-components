---
title: 组件总览
description: 按页面任务和组件类别浏览当前能力。
outline: deep
---

# 组件总览

这页先帮你建立一张“能力地图”。建议先按页面任务找入口，再按组件类别进入单组件页查完整 API，而不是从头逐页扫过去。

## 先按任务进入

<p class="xy-section-lead">
  如果你正在搭一个真实后台页面，不需要先通读所有组件。先定位自己处在“操作、录入、反馈还是展示”哪条链路里，阅读效率会更高。
</p>

<div class="xy-overview-grid">
  <section class="xy-overview-card">
    <span class="xy-overview-kicker">01</span>
    <h3>基础操作</h3>
    <p>Button、Link、Text、Badge、Avatar、Tag、Space、Icon、Tabs、Row、Col、Scrollbar、Splitter 负责主操作、弱跳转、正文强调、角标提醒、身份展示、状态标记和布局骨架。</p>
    <a href="/components/button">进入基础组件</a>
  </section>

  <section class="xy-overview-card">
    <span class="xy-overview-kicker">02</span>
    <h3>表单录入</h3>
    <p>Input、Radio、Checkbox、Switch、InputTag、Input Number、Rate、Slider、DatePicker、TimePicker、TimeSelect、Select、Form、Upload、Config Provider 负责筛选栏、录入表单和字段校验。</p>
    <a href="/components/form">进入表单组件</a>
  </section>

  <section class="xy-overview-card">
    <span class="xy-overview-kicker">03</span>
    <h3>反馈与浮层</h3>
    <p>Tooltip、Popover、Dropdown、Empty、Modal、Drawer 负责提示、菜单、空态和上下文切换。</p>
    <a href="/components/empty">进入反馈组件</a>
  </section>

  <section class="xy-overview-card">
    <span class="xy-overview-kicker">04</span>
    <h3>数据展示</h3>
    <p>Table、Pagination 先覆盖后台列表页最常见的行交互、空态、加载态和分页切换。</p>
    <a href="/components/table">进入数据组件</a>
  </section>
</div>

## 再按组件类别进入

<p class="xy-section-lead">
  如果你已经知道自己要查哪个组件，直接从下面的分类索引进入会更快。
</p>

<div class="xy-overview-sections">
  <section class="xy-overview-section">
    <div class="xy-overview-section__head">
      <h3>基础组件</h3>
      <p>建立页面骨架、主次操作和轻量状态表达。</p>
    </div>
    <div class="xy-overview-links">
      <a href="/components/button">Button 按钮</a>
      <a href="/components/link">Link 文字链接</a>
      <a href="/components/text">Text 文本</a>
      <a href="/components/badge">Badge 徽章</a>
      <a href="/components/avatar">Avatar 头像</a>
      <a href="/components/row">Row 栅格行</a>
      <a href="/components/col">Col 栅格列</a>
      <a href="/components/scrollbar">Scrollbar 滚动条</a>
      <a href="/components/splitter">Splitter 分隔面板</a>
      <a href="/components/icon">Icon 图标</a>
      <a href="/components/tag">Tag 标签</a>
      <a href="/components/space">Space 间距</a>
      <a href="/components/tabs">Tabs 标签页</a>
    </div>
  </section>

  <section class="xy-overview-section">
    <div class="xy-overview-section__head">
      <h3>表单与录入</h3>
      <p>用于筛选栏、录入弹窗、字段校验和文件补充上传。</p>
    </div>
    <div class="xy-overview-links">
      <a href="/components/config-provider">Config Provider 全局配置</a>
      <a href="/components/input">Input 输入框</a>
      <a href="/components/radio">Radio 单选框</a>
      <a href="/components/checkbox">Checkbox 复选框</a>
      <a href="/components/switch">Switch 开关</a>
      <a href="/components/input-tag">InputTag 标签输入框</a>
      <a href="/components/input-number">Input Number 数字输入框</a>
      <a href="/components/rate">Rate 评分</a>
      <a href="/components/slider">Slider 滑块</a>
      <a href="/components/date-picker">DatePicker 日期选择器</a>
      <a href="/components/time-picker">TimePicker 时间选择器</a>
      <a href="/components/time-select">TimeSelect 时间选择</a>
      <a href="/components/select">Select 选择器</a>
      <a href="/components/form">Form 表单</a>
      <a href="/components/upload">Upload 上传</a>
      <a href="/components/pagination">Pagination 分页</a>
    </div>
  </section>

  <section class="xy-overview-section">
    <div class="xy-overview-section__head">
      <h3>反馈与浮层</h3>
      <p>用于解释按钮、收纳轻操作、承接空结果和切换编辑上下文。</p>
    </div>
    <div class="xy-overview-links">
      <a href="/components/empty">Empty 空状态</a>
      <a href="/components/tooltip">Tooltip 文字提示</a>
      <a href="/components/popover">Popover 气泡卡片</a>
      <a href="/components/dropdown">Dropdown 下拉菜单</a>
      <a href="/components/modal">Modal 弹窗</a>
      <a href="/components/drawer">Drawer 抽屉</a>
    </div>
  </section>

  <section class="xy-overview-section">
    <div class="xy-overview-section__head">
      <h3>数据展示</h3>
      <p>用于列表页主干和分页联动。</p>
    </div>
    <div class="xy-overview-links">
      <a href="/components/table">Table 表格</a>
      <a href="/components/pagination">Pagination 分页</a>
    </div>
  </section>
</div>

## 推荐阅读顺序

:::tip 阅读建议
如果你正在搭筛选栏或录入弹窗，优先阅读 [Form 表单](/components/form) 和 [Select 选择器](/components/select)。  
如果你正在搭列表页或空态页，优先阅读 [Table 表格](/components/table) 和 [Empty 空状态](/components/empty)。  
如果你已经明确要查某个组件的完整 API，直接进入对应的单组件页会更快。
:::

## 当前最值得先看的页面

1. [Button 按钮](/components/button)：先建立主次操作和视觉层级。
2. [Link 文字链接](/components/link)：补齐正文跳转和弱操作语义。
3. [Text 文本](/components/text)：补齐正文强调、截断和语义标签能力。
4. [Form 表单](/components/form)：把录入链路串起来理解。
5. [Table 表格](/components/table)：把列表页主干串起来理解。
6. [管理后台闭环示例](/examples/admin)：把这些组件放回一个真实页面片段里看。
