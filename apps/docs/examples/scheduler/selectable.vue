<script setup lang="ts">
import { ref } from "vue";
import type { SchedulerDateSelectPayload, SchedulerEvent } from "xiaoye-components";

const focusDate = ref("2026-03-24");
const selection = ref("还没有选择区间");
const events = ref<SchedulerEvent[]>([
  {
    id: "kickoff",
    title: "项目 Kickoff",
    start: "2026-03-24T10:00:00",
    end: "2026-03-24T11:00:00"
  }
]);

function handleDateSelect(payload: SchedulerDateSelectPayload) {
  selection.value = `${payload.start} -> ${payload.end}（${payload.view} 视图）`;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-scheduler
      v-model="focusDate"
      :events="events"
      selectable
      height="620px"
      @date-select="handleDateSelect"
    />
    <xy-tag status="primary">{{ selection }}</xy-tag>
  </div>
</template>
