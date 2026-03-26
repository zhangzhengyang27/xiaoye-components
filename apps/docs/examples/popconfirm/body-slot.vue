<template>
  <xy-popconfirm title="确认切换到生产配置吗？" width="320px">
    <template #reference>
      <xy-button plain>切换配置</xy-button>
    </template>

    <template #default="{ close }">
      <div class="demo-popconfirm-body">
        <p>生产配置会覆盖当前预发布变量，请先确认灰度环境已经完成验证。</p>
        <xy-button text @click="close">先关闭再看一眼</xy-button>
      </div>
    </template>
  </xy-popconfirm>
</template>

<style scoped>
.demo-popconfirm-body {
  display: grid;
  gap: 10px;
}

.demo-popconfirm-body p {
  margin: 0;
}
</style>
