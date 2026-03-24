<script setup lang="ts">
import { ref } from "vue";
import type { SchedulerView } from "xiaoye-components";

const focusDate = ref("2026-03-24");
const view = ref<SchedulerView>("week");

const events = [
  {
    id: "daily-sync",
    title: "日常同步",
    start: "2026-03-24T09:30:00",
    end: "2026-03-24T10:00:00"
  },
  {
    id: "demo",
    title: "客户演示",
    start: "2026-03-24T15:00:00",
    end: "2026-03-24T16:00:00"
  }
];
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button
        v-for="item in ['month', 'week', 'day']"
        :key="item"
        :type="view === item ? 'primary' : 'default'"
        @click="view = item as SchedulerView"
      >
        {{ item }}
      </xy-button>
    </xy-space>

    <xy-scheduler v-model="focusDate" v-model:view="view" :events="events" />

    <xy-tag status="success">当前视图：{{ view }}</xy-tag>
  </div>
</template>
