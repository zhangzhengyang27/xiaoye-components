<template>
  <div class="demo-tooltip-controlled">
    <xy-space wrap>
      <xy-tooltip
        v-model="visible"
        trigger="manual"
        effect="light"
        placement="bottom-start"
        content="当前由外部状态控制，可用在表单校验、异步反馈或引导流程里。"
      >
        <xy-button type="primary">手动 Tooltip</xy-button>
      </xy-tooltip>

      <xy-button @click="visible = !visible">
        {{ visible ? "隐藏提示" : "显示提示" }}
      </xy-button>
      <xy-button plain @click="visible = false">重置</xy-button>
    </xy-space>

    <p class="demo-tooltip-controlled__status">
      当前状态：<strong>{{ visible ? "已打开" : "已关闭" }}</strong>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const visible = ref(false);
</script>

<style scoped>
.demo-tooltip-controlled {
  display: grid;
  gap: 14px;
}

.demo-tooltip-controlled__status {
  margin: 0;
  color: var(--xy-text-color-secondary);
}

.demo-tooltip-controlled__status strong {
  color: var(--xy-text-color);
}
</style>
