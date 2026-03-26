<script setup lang="ts">
import { ref } from "vue";
import { XyMessage } from "xiaoye-components";

let currentHandle: ReturnType<typeof XyMessage> | null = null;
const logs = ref<string[]>([]);

function openHandleMessage() {
  currentHandle = XyMessage({
    message: "审批流正在同步",
    groupKey: "approval-sync",
    placement: "bottom-right",
    duration: 0,
    showClose: true
  });

  logs.value.unshift(`open: id=${currentHandle.id}`);
}

function updateHandleMessage() {
  currentHandle?.update({
    message: "审批流已同步完成",
    type: "success",
    icon: "mdi:check-decagram-outline"
  });

  const snapshot = XyMessage.getState({
    placement: "bottom-right"
  });

  logs.value.unshift(`getState: total=${snapshot.total}`);
}

function closeBottomRight() {
  XyMessage.closeAll({
    placement: "bottom-right"
  });

  logs.value.unshift("closeAll: placement=bottom-right");
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="openHandleMessage">open()</xy-button>
      <xy-button plain @click="updateHandleMessage">handle.update()</xy-button>
      <xy-button plain @click="closeBottomRight">closeAll(filter)</xy-button>
    </xy-space>

    <div class="xy-doc-stack">
      <div v-for="log in logs" :key="log" class="xy-doc-note">{{ log }}</div>
    </div>
  </div>
</template>
