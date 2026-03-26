<script setup lang="ts">
import { ref } from "vue"

const active = ref(0)
</script>

<template>
  <xy-space direction="vertical" style="width: 100%">
    <xy-steps :active="active">
      <xy-step title="提交申请" description="录入基础信息并选择审批模板。" />
      <xy-step title="主管审批" description="负责人确认预算、优先级和排期。" />
      <xy-step title="财务复核" description="核对成本中心与付款节点。" />
      <xy-step title="完成归档" description="结果同步到台账系统并通知申请人。" />
    </xy-steps>

    <xy-space>
      <xy-button @click="active = Math.max(active - 1, 0)">上一步</xy-button>
      <xy-button type="primary" @click="active = Math.min(active + 1, 3)">下一步</xy-button>
    </xy-space>
  </xy-space>
</template>