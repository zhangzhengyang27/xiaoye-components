<template>
  <div class="frontline-demo-row">
    <xy-front-popover
      title="年度版包含什么"
      surface="highlight"
    >
      <template #trigger>
        <xy-front-button variant="outline">查看方案说明</xy-front-button>
      </template>
      <template #content>
        <p>适合已经确定要把设计系统跑进业务主线的团队，包含多主题、组件审阅和专属维护窗口。</p>
      </template>
    </xy-front-popover>

    <xy-front-popover
      title="为什么先做实验线"
      trigger="hover"
      content="先在实验区验证主题、组件 API 和文档表达，能避免主线在定位没定清之前就被拖进大重构。"
    >
      <template #trigger>
        <xy-front-button variant="ghost" tone="neutral">为什么不直接改主线</xy-front-button>
      </template>
    </xy-front-popover>
  </div>
</template>

<style scoped>
.frontline-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
