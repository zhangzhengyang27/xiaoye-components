<script setup lang="ts">
import { ref } from "vue";

const visible = ref(true);

function reopen() {
  visible.value = false;

  requestAnimationFrame(() => {
    visible.value = true;
  });
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="reopen">重新显示插槽通知</xy-button>
      <xy-tag round status="primary">title / actions slots</xy-tag>
    </xy-space>

    <xy-notification v-model="visible" type="primary" :duration="0">
      <template #title>发布窗口已开启</template>
      当前审批窗口将在 10 分钟后关闭，请尽快确认上线影响范围。
      <template #actions>
        <xy-button size="sm" type="primary">立即查看</xy-button>
        <xy-button size="sm" plain @click="visible = false">稍后处理</xy-button>
      </template>
    </xy-notification>
  </div>
</template>
