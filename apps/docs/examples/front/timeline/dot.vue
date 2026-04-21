<template>
  <xyu-timeline>
    <xyu-timeline-item title="节点 1">
      <template #dot>
        <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--xyu-primary)"></div>
      </template>
    </xyu-timeline-item>
    <xyu-timeline-item title="节点 2">
      <template #dot>
        <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--xyu-success)"></div>
      </template>
    </xyu-timeline-item>
    <xyu-timeline-item title="节点 3">
      <template #dot>
        <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--xyu-warning)"></div>
      </template>
    </xyu-timeline-item>
  </xyu-timeline>
</template>
