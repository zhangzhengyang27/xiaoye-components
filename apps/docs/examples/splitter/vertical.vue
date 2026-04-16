<script setup lang="ts">
const tasks = [
  { id: 1, name: "Build production bundle", status: "done", time: "2.4s" },
  { id: 2, name: "Run type checking", status: "running", time: "..." },
  { id: 3, name: "Execute unit tests", status: "pending", time: "-" }
];

const logs = [
  { type: "info", text: "[10:42:18] Starting build process..." },
  { type: "success", text: "[10:42:20] Compiled successfully in 2.4s" },
  { type: "info", text: "[10:42:21] Running type checker..." },
  { type: "warn", text: "[10:42:23] Found 2 minor warnings" }
];
</script>

<template>
  <div class="split-demo split-demo--terminal">
    <div class="split-demo__header">
      <div class="split-demo__dots">
        <span class="split-demo__dot split-demo__dot--danger"></span>
        <span class="split-demo__dot split-demo__dot--warning"></span>
        <span class="split-demo__dot split-demo__dot--success"></span>
      </div>
      <span class="split-demo__title">Terminal — pnpm build</span>
    </div>

    <xy-splitter layout="vertical">
      <xy-splitter-panel size="45%" :min="120">
        <div class="split-demo__tasks">
          <div
            v-for="task in tasks"
            :key="task.id"
            class="split-demo__task"
            :class="`is-${task.status}`"
          >
            <div class="split-demo__check">
              <template v-if="task.status === 'done'">✓</template>
              <template v-else-if="task.status === 'running'">◐</template>
              <template v-else>○</template>
            </div>
            <div class="split-demo__task-info">
              <span class="split-demo__task-name">{{ task.name }}</span>
              <span class="split-demo__task-time">{{ task.time }}</span>
            </div>
          </div>
        </div>
      </xy-splitter-panel>

      <xy-splitter-panel :min="140">
        <div class="split-demo__output">
          <div
            v-for="(log, idx) in logs"
            :key="idx"
            class="split-demo__log"
            :class="`is-${log.type}`"
          >
            {{ log.text }}
          </div>
        </div>
      </xy-splitter-panel>
    </xy-splitter>
  </div>
</template>

<style scoped>
.split-demo--terminal {
  height: 340px;
  margin: -24px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--xy-border-color-subtle);
  background: var(--xy-surface-raised);
  box-shadow: var(--xy-shadow-xs);
}

.split-demo__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 92%, white);
  border-bottom: 1px solid var(--xy-border-color-subtle);
}

.split-demo__dots {
  display: flex;
  gap: 6px;
}

.split-demo__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--xy-border-color);
}

.split-demo__dot--danger {
  background: var(--xy-color-danger);
}

.split-demo__dot--warning {
  background: var(--xy-color-warning);
}

.split-demo__dot--success {
  background: var(--xy-color-success);
}

.split-demo__title {
  color: var(--xy-text-color-secondary);
  font-size: 12px;
  font-weight: 500;
}

.split-demo__tasks {
  height: 100%;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 88%, white);
}

.split-demo__task {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: var(--xy-surface-raised);
  border: 1px solid var(--xy-border-color-subtle);
}

.split-demo__task.is-running {
  background: color-mix(in srgb, var(--xy-color-primary-soft) 48%, white);
}

.split-demo__check {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 12px;
  color: var(--xy-text-color-subtle);
}

.split-demo__task.is-done .split-demo__check {
  background: color-mix(in srgb, var(--xy-color-success-soft) 68%, white);
  color: var(--xy-color-success);
}

.split-demo__task.is-running .split-demo__check {
  background: color-mix(in srgb, var(--xy-color-primary-soft) 76%, white);
  color: var(--xy-color-primary);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.split-demo__task-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.split-demo__task-name {
  color: var(--xy-text-color-heading);
  font-size: 13px;
}

.split-demo__task-time {
  color: var(--xy-text-color-subtle);
  font-family: "SF Mono", monospace;
  font-size: 11px;
}

.split-demo__output {
  height: 100%;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: auto;
  background: var(--xy-surface-raised);
  border-top: 1px solid var(--xy-border-color-subtle);
}

.split-demo__log {
  font-family: "SF Mono", "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  color: var(--xy-text-color-secondary);
  line-height: 1.6;
}

.split-demo__log.is-success {
  color: var(--xy-color-success);
}
.split-demo__log.is-warn {
  color: var(--xy-color-warning);
}
.split-demo__log.is-error {
  color: var(--xy-color-danger);
}

@media (max-width: 640px) {
  .split-demo--terminal {
    height: 420px;
  }
}
</style>
