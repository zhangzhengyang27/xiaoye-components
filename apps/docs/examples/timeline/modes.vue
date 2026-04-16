<script setup lang="ts">
import { ref } from "vue";

type TimelineMode = "start" | "alternate" | "alternate-reverse" | "end";

const mode = ref<TimelineMode>("alternate");
const reverse = ref(false);

const modeOptions: Array<{ label: string; value: TimelineMode }> = [
  { label: "start", value: "start" },
  { label: "alternate", value: "alternate" },
  { label: "alternate-reverse", value: "alternate-reverse" },
  { label: "end", value: "end" }
];

const steps = [
  {
    title: "需求冻结",
    description: "冻结范围、接口和上线窗口。"
  },
  {
    title: "开发联调",
    description: "补齐边界测试和字段映射。"
  },
  {
    title: "回归验收",
    description: "按灰度名单和场景清单完成验证。"
  },
  {
    title: "正式发布",
    description: "观察指标并准备回滚预案。"
  }
];
</script>

<template>
  <div class="demo-timeline-modes">
    <div class="demo-timeline-modes__toolbar">
      <xy-space wrap>
        <xy-select v-model="mode" :options="modeOptions" style="min-width: 180px" />
        <xy-checkbox v-model="reverse">reverse</xy-checkbox>
      </xy-space>
    </div>

    <xy-timeline :mode="mode" :reverse="reverse">
      <xy-timeline-item
        v-for="(step, index) in steps"
        :key="step.title"
        :timestamp="`阶段 ${index + 1}`"
        :type="index === 3 ? 'success' : index === 2 ? 'primary' : 'neutral'"
      >
        <xy-card class="demo-timeline-modes__card" shadow="hover">
          <strong class="demo-timeline-modes__card-title">{{ step.title }}</strong>
          <p class="demo-timeline-modes__description">{{ step.description }}</p>
        </xy-card>
      </xy-timeline-item>
    </xy-timeline>
  </div>
</template>

<style scoped>
.demo-timeline-modes {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-timeline-modes__toolbar {
  padding: 12px 14px;
  border: 1px solid var(--xy-border-color-subtle);
  border-radius: var(--xy-radius-md);
  background: color-mix(in srgb, var(--xy-bg-color-subtle) 86%, white);
}

.demo-timeline-modes__card {
  background: color-mix(in srgb, var(--xy-surface-raised) 94%, white);
}

.demo-timeline-modes__card-title {
  display: block;
  margin-bottom: 6px;
  color: var(--xy-text-color-heading);
}

.demo-timeline-modes__description {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .demo-timeline-modes__toolbar {
    padding: 10px 12px;
  }
}
</style>
