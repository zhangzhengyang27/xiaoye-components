<script setup lang="ts">
import { XyButton, XyCard, XyProgress, XyTag } from "@xiaoye/components";
import type { ExportTaskItem, ExportTaskPanelProps } from "./export-task-panel";

defineOptions({
  name: "XyExportTaskPanel"
});

const props = withDefaults(defineProps<ExportTaskPanelProps>(), {
  title: "导出任务",
  tasks: () => []
});

const emit = defineEmits<{
  download: [task: ExportTaskItem];
  retry: [task: ExportTaskItem];
  remove: [task: ExportTaskItem];
}>();

function resolveStatus(status: ExportTaskItem["status"]) {
  if (status === "success") return "success";
  if (status === "error") return "danger";
  if (status === "processing") return "primary";
  return "warning";
}
</script>

<template>
  <xy-card class="xy-export-task-panel" :header="props.title">
    <div class="xy-export-task-panel__list">
      <div v-for="task in props.tasks" :key="task.id" class="xy-export-task-panel__item">
        <div class="xy-export-task-panel__meta">
          <strong>{{ task.name }}</strong>
          <xy-tag size="sm" :status="resolveStatus(task.status)">{{ task.status }}</xy-tag>
          <span v-if="task.createdAt" class="xy-export-task-panel__time">{{ task.createdAt }}</span>
        </div>
        <xy-progress
          v-if="task.progress !== undefined"
          :percentage="task.progress"
          :stroke-width="8"
        />
        <div class="xy-export-task-panel__actions">
          <xy-button v-if="task.status === 'success'" text @click="emit('download', task)">
            下载
          </xy-button>
          <xy-button v-if="task.status === 'error'" text @click="emit('retry', task)">
            重试
          </xy-button>
          <xy-button text @click="emit('remove', task)">移除</xy-button>
        </div>
      </div>
    </div>
  </xy-card>
</template>
