<script setup lang="ts">
import { ref } from "vue";

const active = ref(0);
</script>

<template>
  <!-- 步骤条基础用法：展示多步骤流程的进度 -->
  <div class="demo-steps-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-steps-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>流程导航</xy-tag>
        </div>
        <p class="demo-steps-basic__description">
          步骤条用于引导用户完成多步骤任务，展示当前进度和步骤间的逻辑关系。
        </p>
      </template>

      <div class="demo-steps-basic__content">
        <xy-steps :active="active">
          <xy-step title="提交申请" description="录入基础信息并选择审批模板。" />
          <xy-step title="主管审批" description="负责人确认预算、优先级和排期。" />
          <xy-step title="财务复核" description="核对成本中心与付款节点。" />
          <xy-step title="完成归档" description="结果同步到台账系统并通知申请人。" />
        </xy-steps>
      </div>

      <template #footer>
        <xy-space>
          <xy-button @click="active = Math.max(active - 1, 0)">上一步</xy-button>
          <xy-button type="primary" @click="active = Math.min(active + 1, 3)">下一步</xy-button>
        </xy-space>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-steps-basic {
  max-width: 720px;
}

.demo-steps-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-steps-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-steps-basic__content {
  padding: 8px 0;
}
</style>