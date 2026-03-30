<script setup lang="ts">
const nodes = [
  {
    key: "submit",
    title: "提交账单差异说明",
    status: "finish" as const,
    assignee: "小叶",
    time: "2026-03-29 09:00",
    description: "已提交供应商差异说明和原始附件。"
  },
  {
    key: "review",
    title: "财务复核",
    status: "process" as const,
    assignee: "小星",
    time: "2026-03-29 11:00",
    description: "正在核对金额差异和税率说明。"
  },
  {
    key: "publish",
    title: "工作台生效",
    status: "wait" as const,
    assignee: "系统",
    description: "复核通过后会同步到结算工作台。"
  }
];
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-card header="供应商账单差异审批">
      <p>当前这条差异单已经补齐附件和金额说明，正在等待财务复核通过后自动推送到结算工作台。</p>
    </xy-card>
    <xy-approval-flow-panel
      title="审批流程"
      :nodes="nodes"
      :actions="[
        { key: 'urge', label: '提醒审批', type: 'primary' },
        { key: 'transfer', label: '转交复核', plain: true }
      ]"
    />
  </div>
</template>
