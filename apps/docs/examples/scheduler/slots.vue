<script setup lang="ts">
const events = [
  {
    id: "release",
    title: "灰度发布",
    start: "2026-03-24T20:00:00",
    end: "2026-03-24T22:00:00",
    className: ["doc-scheduler-release"]
  },
  {
    id: "focus-day",
    title: "专注开发",
    start: "2026-03-25",
    allDay: true
  }
];
</script>

<template>
  <div class="xy-doc-stack">
    <xy-scheduler model-value="2026-03-24" :events="events">
      <template #event-content="{ timeText, event }">
        <div class="doc-scheduler-event">
          <strong>{{ event.title }}</strong>
          <span class="doc-scheduler-event__time">{{ timeText || "全天" }}</span>
        </div>
      </template>

      <template #day-cell-content="{ dayNumberText, isToday }">
        <div class="doc-scheduler-day" :class="isToday ? 'is-today' : ''">
          <span>{{ dayNumberText }}</span>
          <xy-tag v-if="isToday" size="sm" status="primary">今天</xy-tag>
        </div>
      </template>
    </xy-scheduler>
  </div>
</template>

<style scoped>
.doc-scheduler-event {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.doc-scheduler-event__time {
  font-size: 12px;
}

.doc-scheduler-day {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.doc-scheduler-day.is-today {
  color: var(--xy-color-primary);
}
</style>
