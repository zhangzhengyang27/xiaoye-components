<script setup lang="ts">
import { ref } from "vue";
import type { SchedulerEvent } from "xiaoye-components";

const focusDate = ref("2026-03-24");

const events: SchedulerEvent[] = [
  {
    id: "all-day",
    title: "全天事项",
    start: "2026-03-01",
    allDay: true
  },
  {
    id: "long-event",
    title: "跨天项目排期",
    start: "2026-03-10",
    end: "2026-03-13",
    allDay: true
  },
  {
    id: "google",
    title: "外部跳转事项",
    start: "2026-03-14",
    allDay: true
  },
  {
    id: "conference",
    title: "大会日程",
    start: "2026-03-18",
    end: "2026-03-20",
    allDay: true
  },
  {
    id: "meeting-1",
    title: "10:30 会议",
    start: "2026-03-24T10:30:00",
    end: "2026-03-24T11:30:00"
  },
  {
    id: "lunch",
    title: "12:00 午餐",
    start: "2026-03-24T12:00:00",
    end: "2026-03-24T13:00:00"
  },
  {
    id: "meeting-2",
    title: "14:30 复盘",
    start: "2026-03-24T14:30:00",
    end: "2026-03-24T15:30:00"
  },
  {
    id: "happy-hour",
    title: "17:30 团建",
    start: "2026-03-24T17:30:00",
    end: "2026-03-24T18:30:00"
  },
  {
    id: "birthday",
    title: "07:00 生日会",
    start: "2026-03-25T07:00:00",
    end: "2026-03-25T08:00:00"
  }
];
</script>

<template>
  <div class="xy-doc-stack">
    <xy-scheduler v-model="focusDate" view="month" :views="['month']" :events="events" />
    <xy-tag status="primary">当前焦点日期：{{ focusDate }}</xy-tag>
  </div>
</template>
