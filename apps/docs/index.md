# xiaoye-components

面向中后台系统的 Vue 3 组件库。目标不是重复做一个更大的通用库，而是把高频场景做得更顺手。

<div class="hero-layout">
  <section class="hero-card">
    <h2>低心智负担的 API</h2>
    <p>
      统一的命名语义、清晰的状态系统和直接可用的文档示例，让组件更像稳定的业务基础设施，而不是需要反复猜测的黑盒。
    </p>
    <div class="hero-meta">
      <span>Vue 3</span>
      <span>TypeScript</span>
      <span>中后台优先</span>
      <span>文档驱动</span>
    </div>
    <xy-space>
      <xy-button>开始使用</xy-button>
      <xy-button variant="outline">查看组件</xy-button>
    </xy-space>
  </section>

  <aside class="demo-card">
    <h3>首期定位</h3>
    <ul>
      <li>高频基础组件 + 表单交互组件</li>
      <li>可发布、可验证、可持续迭代的 v0</li>
      <li>强调易用性、类型体验、文档体验</li>
    </ul>
  </aside>
</div>

## 现在就能看到什么

<div class="xy-doc-grid">
  <div>
    <h3>基础组件</h3>
    <p>Button、Tag、Tabs、Tooltip、Space、Empty。</p>
  </div>
  <div>
    <h3>表单链路</h3>
    <p>Input、Select、Form、Modal 已经可以串成最小录入流程。</p>
  </div>
  <div>
    <h3>数据展示</h3>
    <p>Table、Pagination 先覆盖后台列表页最常见的路径。</p>
  </div>
</div>

## 当前版本亮点

<div class="xy-doc-grid">
  <div>
    <h3>Select</h3>
    <p>支持搜索、清空、空态文案、键盘导航与基础 aria 语义。</p>
  </div>
  <div>
    <h3>Form</h3>
    <p>支持字段级 `validateField / resetFields / clearValidate`，更适合局部交互。</p>
  </div>
  <div>
    <h3>Table</h3>
    <p>支持 `rowKey`、`rowClick`、`rowClassName` 以及自定义空态和加载态。</p>
  </div>
  <div>
    <h3>Overlay</h3>
    <p>Tabs、Tooltip、Modal 已经开始覆盖方向键、Escape、focus 恢复等细节。</p>
  </div>
</div>
