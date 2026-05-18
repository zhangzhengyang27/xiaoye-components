<template>
  <!-- 警告提示基础用法：展示 5 种语义类型（主要/成功/信息/警告/错误），用于页面内反馈 -->
  <div class="alert-demo-stack">
    <xy-alert title="系统公告" type="primary" />
    <xy-alert title="操作成功" type="success" />
    <xy-alert title="使用提示" type="info" />
    <xy-alert title="注意事项" type="warning" />
    <xy-alert title="操作失败" type="error" />
  </div>
</template>

<style scoped>
.alert-demo-stack {
  display: grid;
  gap: 12px;
}
</style>
