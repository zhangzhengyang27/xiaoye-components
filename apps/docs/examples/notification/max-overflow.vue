<script setup lang="ts">
import { ref } from "vue";
import { XyNotificationService } from "xiaoye-components";

type OverflowStrategy = "drop-oldest" | "drop-newest";

const strategy = ref<OverflowStrategy>("drop-oldest");
const seed = ref(0);
const logs = ref<string[]>(["点击按钮后会在右上角以 max=2 的规则堆叠通知。"]);

function openWithLimit() {
  seed.value += 1;

  XyNotificationService.open({
    title: `批量任务 #${seed.value}`,
    message: `当前 overflowStrategy = ${strategy.value}`,
    max: 2,
    overflowStrategy: strategy.value,
    duration: 0,
    onClosed(reason) {
      if (reason === "overflow") {
        logs.value.unshift(`批量任务 #${seed.value} 命中了 overflow 处理。`);
      }
    }
  });
}

function resetLogs() {
  logs.value = ["已重置演示日志。"];
  seed.value = 0;
  XyNotificationService.closeAll();
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="openWithLimit">继续加入通知</xy-button>
      <xy-button plain @click="strategy = 'drop-oldest'">drop-oldest</xy-button>
      <xy-button plain @click="strategy = 'drop-newest'">drop-newest</xy-button>
      <xy-button type="danger" plain @click="resetLogs">重置</xy-button>
    </xy-space>

    <xy-space wrap>
      <xy-tag round status="primary">max：2</xy-tag>
      <xy-tag round status="warning">策略：{{ strategy }}</xy-tag>
      <xy-tag round status="success">累计触发：{{ seed }}</xy-tag>
    </xy-space>

    <div class="overflow-log-board">
      <div v-for="log in logs" :key="log" class="xy-doc-note">{{ log }}</div>
    </div>
  </div>
</template>

<style scoped>
.overflow-log-board {
  display: grid;
  gap: 8px;
}
</style>
