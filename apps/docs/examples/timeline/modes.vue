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
      <label>
        布局模式
        <select v-model="mode">
          <option v-for="option in modeOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="demo-timeline-modes__reverse">
        <input v-model="reverse" type="checkbox" />
        reverse
      </label>
    </div>

    <xy-timeline :mode="mode" :reverse="reverse">
      <xy-timeline-item
        v-for="(step, index) in steps"
        :key="step.title"
        :timestamp="`阶段 ${index + 1}`"
        :type="index === 3 ? 'success' : index === 2 ? 'primary' : 'neutral'"
      >
        <div class="demo-timeline-modes__card">
          <strong>{{ step.title }}</strong>
          <p>{{ step.description }}</p>
        </div>
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
  display: flex;
  flex-wrap: wrap;
  gap: 12px 18px;
  align-items: center;
  padding: 12px 14px;
  border: 1px solid var(--xy-border-color);
  border-radius: var(--xy-radius-md);
  background: var(--xy-bg-color-muted);
  color: var(--xy-text-color-secondary);
}

.demo-timeline-modes__toolbar label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.demo-timeline-modes__toolbar select {
  min-width: 180px;
  padding: 6px 10px;
  border: 1px solid var(--xy-border-color-strong);
  border-radius: 8px;
  background: var(--xy-bg-color);
  color: var(--xy-text-color);
}

.demo-timeline-modes__reverse {
  font-variant-numeric: tabular-nums;
}

.demo-timeline-modes__card {
  padding: 14px 16px;
  border-radius: var(--xy-radius-md);
  background: linear-gradient(180deg, white, var(--xy-bg-color-muted));
  border: 1px solid color-mix(in srgb, var(--xy-border-color) 84%, white);
}

.demo-timeline-modes__card strong {
  display: block;
  margin-bottom: 6px;
  color: var(--xy-text-color);
}

.demo-timeline-modes__card p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .demo-timeline-modes__toolbar {
    align-items: flex-start;
  }

  .demo-timeline-modes__toolbar label {
    width: 100%;
  }

  .demo-timeline-modes__toolbar select {
    width: 100%;
  }
}
</style>
