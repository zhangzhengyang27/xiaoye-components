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
        <span></span><span></span><span></span>
      </div>
      <span class="split-demo__title">Terminal — pnpm build</span>
    </div>

    <xy-splitter layout="vertical">
      <xy-splitter-panel size="45%" :min="120">
        <div class="split-demo__tasks">
          <div v-for="task in tasks" :key="task.id" class="split-demo__task" :class="`is-${task.status}`">
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
  background: #0f172a;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.25);
}

.split-demo__header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
}

.split-demo__dots {
  display: flex;
  gap: 6px;
}

.split-demo__dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #475569;
}

.split-demo__dots span:first-child { background: #ef4444; }
.split-demo__dots span:nth-child(2) { background: #eab308; }
.split-demo__dots span:last-child { background: #22c55e; }

.split-demo__title {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
}

.split-demo__tasks {
  height: 100%;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
}

.split-demo__task {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
}

.split-demo__task.is-running {
  background: rgba(59, 130, 246, 0.1);
}

.split-demo__check {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 12px;
  color: #475569;
}

.split-demo__task.is-done .split-demo__check {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.split-demo__task.is-running .split-demo__check {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.split-demo__task-info {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.split-demo__task-name {
  color: #e2e8f0;
  font-size: 13px;
}

.split-demo__task-time {
  color: #64748b;
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
  background: #0f172a;
}

.split-demo__log {
  font-family: "SF Mono", "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.6;
}

.split-demo__log.is-success { color: #22c55e; }
.split-demo__log.is-warn { color: #eab308; }
.split-demo__log.is-error { color: #ef4444; }

@media (max-width: 640px) {
  .split-demo--terminal {
    height: 420px;
  }
}
</style>
