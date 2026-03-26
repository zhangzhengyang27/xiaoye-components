<script setup lang="ts">
import { ref } from "vue";

const active = ref(2);
</script>

<template>
  <xy-space direction="vertical" style="width: 100%">
    <xy-steps :active="active" finish-status="success" process-status="error" align-center>
      <xy-step title="提报需求" description="业务方提交活动配置与预算。" />
      <xy-step title="风控校验" description="命中规则后要求补充材料。" status="error" />
      <xy-step title="人工复核" description="运营补充说明并二次提交。" icon="mdi:file-document-edit-outline" />
      <xy-step title="发布上线" description="确认完成后推送正式环境。" />
    </xy-steps>

    <xy-space>
      <xy-button @click="active = 1">回到异常节点</xy-button>
      <xy-button type="primary" @click="active = 3">模拟处理完成</xy-button>
    </xy-space>
  </xy-space>
</template>
