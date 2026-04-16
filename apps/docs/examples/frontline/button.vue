<template>
  <div class="frontline-demo-stack">
    <div class="frontline-demo-row">
      <xy-front-button>开始体验</xy-front-button>
      <xy-front-button variant="soft">预约演示</xy-front-button>
      <xy-front-button variant="outline">查看定价</xy-front-button>
      <xy-front-button variant="ghost">阅读文档</xy-front-button>
    </div>
    <div class="frontline-demo-row">
      <xy-front-button tone="neutral" leading-icon="mdi:arrow-top-right">
        品牌首页 CTA
      </xy-front-button>
      <xy-front-button tone="success" variant="soft">上线成功</xy-front-button>
      <xy-front-button tone="warning" variant="outline">候补名单</xy-front-button>
    </div>
  </div>
</template>

<style scoped>
.frontline-demo-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.frontline-demo-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
