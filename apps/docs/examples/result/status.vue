<template>
  <div class="result-status-grid">
    <xy-result
      v-for="item in items"
      :key="item.status"
      :status="item.status"
      :title="item.title"
      :description="item.description"
      size="sm"
    />
  </div>
</template>

<script setup lang="ts">
const items = [
  {
    status: "neutral",
    title: "等待补充",
    description: "当前还缺少负责人和发布时间，先补齐再提交审批。"
  },
  {
    status: "primary",
    title: "正在处理中",
    description: "审批流已发起，系统会在节点变化时自动同步状态。"
  },
  {
    status: "success",
    title: "已完成",
    description: "同步任务已经落库，相关成员会收到站内通知。"
  },
  {
    status: "warning",
    title: "需要关注",
    description: "存在 2 项边界配置未确认，建议先回看参数。"
  },
  {
    status: "danger",
    title: "执行失败",
    description: "第三方接口超时，请稍后重试或切换备用通道。"
  },
  {
    status: "403",
    title: "无访问权限",
    description: "当前账号缺少该页面权限，请联系管理员开通。"
  },
  {
    status: "404",
    title: "页面不存在",
    description: "目标资源可能已经移动，建议返回工作台重新进入。"
  }
] as const;
</script>

<style scoped>
.result-status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
</style>
