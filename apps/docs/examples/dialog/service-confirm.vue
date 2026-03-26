<script setup lang="ts">
import { ref } from "vue";
import { XyDialogService } from "xiaoye-components";

const latest = ref("最近一次 confirm()：尚未调用");

async function handleConfirm() {
  latest.value = "等待用户在 service confirm 中确认...";
  const confirmed = await XyDialogService.confirm({
    title: "删除成员",
    message: "删除后不可恢复，是否继续？",
    dialogProps: {
      width: 420,
      closeOnClickModal: false
    }
  });

  latest.value = confirmed ? "confirm() 返回 true，继续执行删除" : "confirm() 返回 false，已取消";
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="danger" @click="handleConfirm">打开 confirm()</xy-button>
      <xy-tag :status="latest.includes('true') ? 'danger' : 'info'">{{ latest }}</xy-tag>
    </xy-space>
  </div>
</template>
