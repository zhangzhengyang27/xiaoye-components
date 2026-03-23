<template>
  <div class="demo-text-column">
    <xy-text tag="del" type="danger">已下线功能</xy-text>
    <xy-text tag="strong" type="primary">本周重点发布</xy-text>
    <xy-text tag="p" type="info" class="demo-text-paragraph">
      自定义 tag 适合在不打断排版语义的前提下接入 Text 的颜色、尺寸和截断能力。
    </xy-text>
  </div>
</template>

<style scoped>
.demo-text-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.demo-text-paragraph {
  margin: 0;
}
</style>
