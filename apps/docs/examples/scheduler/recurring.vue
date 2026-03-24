<script setup lang="ts">
const events = [
  {
    id: "standup",
    title: "工作日站会",
    start: "2026-03-23T09:30:00",
    rrule: {
      freq: "weekly",
      byweekday: ["mo", "tu", "we", "th", "fr"],
      dtstart: "2026-03-23T09:30:00"
    },
    duration: "00:15"
  },
  {
    id: "review",
    title: "周三复盘",
    start: "2026-03-25T16:00:00",
    rrule: {
      freq: "weekly",
      byweekday: ["we"],
      dtstart: "2026-03-25T16:00:00"
    },
    duration: "01:00"
  }
];
</script>

<template>
  <div class="xy-doc-stack">
    <xy-scheduler model-value="2026-03-24" :events="events" />
  </div>
</template>
