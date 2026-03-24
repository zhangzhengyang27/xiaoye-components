<script setup lang="ts">
import { ref } from "vue";
import type { SchedulerEvent, SchedulerEventChangePayload } from "xiaoye-components";

const latestChange = ref("还没有拖拽调整");
const events = ref<SchedulerEvent[]>([
  {
    id: "handover",
    title: "交付排期",
    start: "2026-03-24T13:00:00",
    end: "2026-03-24T15:00:00"
  }
]);

function handleEventChange(payload: SchedulerEventChangePayload) {
  latestChange.value = `${payload.event.title} -> ${payload.event.start}`;
  events.value = events.value.map((item) => (item.id === payload.event.id ? payload.event : item));
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-scheduler
      model-value="2026-03-24"
      view="day"
      editable
      :events="events"
      @event-change="handleEventChange"
    />
    <xy-tag status="warning">{{ latestChange }}</xy-tag>
  </div>
</template>
