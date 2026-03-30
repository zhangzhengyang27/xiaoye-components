<template>
  <div>
    <p class="xy-section-lead">
      如果你正在搭一个真实后台页面，不需要先通读所有组件。先定位自己处在“操作、录入、反馈还是展示”哪条链路里，阅读效率会更高。
    </p>

    <div class="xy-overview-grid">
      <section class="xy-overview-card">
        <span class="xy-overview-kicker">01</span>
        <h3>基础操作</h3>
        <p>
          Button、Link、Breadcrumb、Text、Badge、Avatar、Image、Watermark、Card、Carousel、Affix、Anchor、Menu、Tag、Divider、Space、Icon、Tabs、Row、Col、Scrollbar、Splitter
          负责主操作、弱跳转、路径导航、正文强调、角标提醒、身份展示、图片承接、水印标识、卡片分区、轮播展示、页内定位、导航骨架、轻量分组、固钉辅助和布局骨架。
        </p>
        <a href="/components/button">进入基础组件</a>
        <a href="/components/breadcrumb">查看 Breadcrumb API</a>
        <a href="/components/divider">查看 Divider API</a>
        <a href="/components/anchor">查看 Anchor API</a>
      </section>

      <section class="xy-overview-card">
        <span class="xy-overview-kicker">02</span>
        <h3>表单录入</h3>
        <p>
          Input、Radio、Checkbox、Switch、InputTag、Input Number、Rate、Slider、DatePicker、TimePicker、TimeSelect、Select、Form、Upload、Config
          Provider 负责筛选栏、录入表单和字段校验。
        </p>
        <a href="/components/form">进入表单组件</a>
      </section>

      <section class="xy-overview-card">
        <span class="xy-overview-kicker">03</span>
        <h3>反馈与浮层</h3>
        <p>
          Alert、Message、Notification、Tooltip、Popover、Popconfirm、Dropdown、Backtop、Collapse、Collapse
          Transition、Empty、Loading、Skeleton、Result、Dialog、Drawer
          负责页面提示、全局反馈、菜单、轻量确认、回顶辅助、折叠收纳、过渡衔接、容器与全屏加载遮罩、空态、结果承接和上下文切换。
        </p>
        <a href="/components/empty">进入反馈组件</a>
        <a href="/examples/skeleton">查看 Skeleton 场景示例</a>
      </section>

      <section class="xy-overview-card">
        <span class="xy-overview-kicker">04</span>
        <h3>数据展示</h3>
        <p>
          Statistic、Countdown、Progress、Steps、Timeline、Scheduler、Tree、Table、Pagination
          先覆盖后台列表页、时间轴记录、排期面板、资源树和状态面板里最常见的指标读数、倒计时、完成度展示、阶段流转、时间编排、层级配置、行交互和分页切换。Timeline
          默认是左侧单线布局，涉及 Timeline、Scheduler 和 Tree 时，建议同时看组件页与场景示例。
        </p>
        <a href="/components/statistic">查看 Statistic API</a>
        <a href="/components/countdown">查看 Countdown API</a>
        <a href="/components/progress">查看 Progress API</a>
        <a href="/components/steps">查看 Steps API</a>
        <a href="/components/timeline">查看 Timeline API</a>
        <a href="/examples/timeline">查看 Timeline 场景示例</a>
        <a href="/components/scheduler">查看 Scheduler API</a>
        <a href="/examples/scheduler">查看 Scheduler 场景示例</a>
        <a href="/components/tree">查看 Tree API</a>
      </section>
    </div>

    <p class="xy-section-lead">如果你已经知道自己要查哪个组件，直接从下面的分类索引进入会更快。</p>

    <div class="xy-overview-sections">
      <section class="xy-overview-section">
        <div class="xy-overview-section__head">
          <h3>基础组件</h3>
          <p>建立页面骨架、主次操作和轻量状态表达。</p>
        </div>
        <div class="xy-overview-links">
          <a href="/components/button">Button 按钮</a>
          <a href="/components/link">Link 文字链接</a>
          <a href="/components/breadcrumb">Breadcrumb 面包屑</a>
          <a href="/components/text">Text 文本</a>
          <a href="/components/badge">Badge 徽章</a>
          <a href="/components/avatar">Avatar 头像</a>
          <a href="/components/image">Image 图片</a>
          <a href="/components/watermark">Watermark 水印</a>
          <a href="/components/card">Card 卡片</a>
          <a href="/components/carousel">Carousel 走马灯</a>
          <a href="/components/affix">Affix 固钉</a>
          <a href="/components/anchor">Anchor 锚点</a>
          <a href="/components/menu">Menu 菜单</a>
          <a href="/components/row">Row 栅格行</a>
          <a href="/components/col">Col 栅格列</a>
          <a href="/components/scrollbar">Scrollbar 滚动条</a>
          <a href="/components/splitter">Splitter 分隔面板</a>
          <a href="/components/divider">Divider 分割线</a>
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
        </div>
      </section>

      <section class="xy-overview-section">
        <div class="xy-overview-section__head">
          <h3>反馈与浮层</h3>
          <p>用于解释按钮、收纳轻操作、承接空结果和切换编辑上下文。</p>
        </div>
        <div class="xy-overview-links">
          <a href="/components/alert">Alert 提示</a>
          <a href="/components/message">Message 消息提示</a>
          <a href="/components/notification">Notification 通知</a>
          <a href="/components/collapse">Collapse 折叠面板</a>
          <a href="/components/collapse-transition">Collapse Transition 折叠过渡</a>
          <a href="/components/empty">Empty 空状态</a>
          <a href="/components/loading">Loading 加载</a>
          <a href="/components/skeleton">Skeleton 骨架屏</a>
          <a href="/examples/skeleton">Skeleton 场景示例</a>
          <a href="/components/result">Result 结果</a>
          <a href="/components/backtop">Backtop 回到顶部</a>
          <a href="/components/tooltip">Tooltip 文字提示</a>
          <a href="/components/popover">Popover 气泡卡片</a>
          <a href="/components/popconfirm">Popconfirm 气泡确认框</a>
          <a href="/components/dropdown">Dropdown 下拉菜单</a>
          <a href="/components/dialog">Dialog 对话框</a>
          <a href="/components/drawer">Drawer 抽屉</a>
        </div>
      </section>

      <section class="xy-overview-section">
        <div class="xy-overview-section__head">
          <h3>数据展示</h3>
          <p>
            用于状态面板、时间线、排期面板、资源目录、列表页主干和分页联动。Timeline 默认是左侧单线布局，需要双侧对照时再切到
            alternate。
          </p>
        </div>
        <div class="xy-overview-links">
          <a href="/components/progress">Progress 进度条</a>
          <a href="/components/steps">Steps 步骤条</a>
          <a href="/components/statistic">Statistic 统计数值</a>
          <a href="/components/countdown">Countdown 倒计时</a>
          <a href="/components/timeline">Timeline 时间线</a>
          <a href="/examples/timeline">Timeline 场景示例</a>
          <a href="/components/scheduler">Scheduler 排期日历</a>
          <a href="/examples/scheduler">Scheduler 场景示例</a>
          <a href="/components/tree">Tree 树形控件</a>
          <a href="/components/table">Table 表格</a>
          <a href="/components/pagination">Pagination 分页</a>
        </div>
      </section>
    </div>
  </div>
</template>
