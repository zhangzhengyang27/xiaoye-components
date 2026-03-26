<script setup lang="ts">
import { computed, ref } from "vue";
import { XyNotificationService } from "xiaoye-components";

const snapshot = ref("");

function openSamples() {
  XyNotificationService.warning({
    title: "底部风险提醒",
    duration: 0,
    position: "bottom-left",
    groupKey: "warn"
  });
  XyNotificationService.success({
    title: "顶部成功通知",
    duration: 0,
    position: "top-right"
  });
  refreshSnapshot();
}

function closeFiltered() {
  XyNotificationService.closeAll({
    position: "bottom-left",
    groupKey: "warn"
  });
  refreshSnapshot();
}

function refreshSnapshot() {
  snapshot.value = JSON.stringify(
    XyNotificationService.getState({
      position: "bottom-left"
    }),
    null,
    2
  );
}

const snapshotLines = computed(() => snapshot.value || "点击按钮后查看当前快照");
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="openSamples">生成示例通知</xy-button>
      <xy-button plain @click="closeFiltered">closeAll(filter)</xy-button>
      <xy-button plain @click="refreshSnapshot">getState(filter)</xy-button>
    </xy-space>

    <pre class="notification-code">{{ snapshotLines }}</pre>
  </div>
</template>

<style scoped>
.notification-code {
  margin: 0;
  padding: 14px 16px;
  overflow: auto;
  border-radius: 14px;
  background: rgb(15 23 42);
  color: rgb(226 232 240);
  font-size: 13px;
  line-height: 1.65;
}
</style>
