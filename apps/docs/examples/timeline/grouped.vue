<script setup lang="ts">
import { ref } from "vue";

type TimelineMode = "start" | "alternate" | "alternate-reverse" | "end";

const mode = ref<TimelineMode>("start");
const reverse = ref(false);

const groups = [
  {
    title: "2026-03-24",
    description: "发布日动作流",
    extra: "3 条记录",
    items: [
      {
        title: "灰度批次 1 完成",
        meta: "17:20 / 发布系统",
        description: "按租户白名单完成首批切流。",
        state: "done" as const
      },
      {
        title: "监控指标回稳",
        meta: "18:10 / 可观测平台",
        description: "错误率和接口耗时回到基线范围。",
        state: "current" as const
      }
    ]
  },
  {
    title: "2026-03-25",
    description: "收尾与复盘",
    extra: "2 条记录",
    items: [
      {
        title: "二次放量待确认",
        meta: "09:30 / 运营值班",
        description: "等待客服确认热线压力是否可控。",
        state: "pending" as const
      },
      {
        title: "复盘会议延期",
        meta: "11:00 / 项目经理",
        description: "外部依赖尚未回收，复盘顺延到下午。",
        state: "blocked" as const
      }
    ]
  }
];
</script>

<template>
  <div class="demo-timeline-grouped">
    <div class="demo-timeline-grouped__toolbar">
      <label>
        布局模式
        <select v-model="mode">
          <option value="start">start</option>
          <option value="alternate">alternate</option>
          <option value="alternate-reverse">alternate-reverse</option>
          <option value="end">end</option>
        </select>
      </label>

      <label class="demo-timeline-grouped__reverse">
        <input v-model="reverse" type="checkbox" />
        reverse
      </label>
    </div>

    <p class="demo-timeline-grouped__tip">
      当前模式：
      <strong>{{ mode }}</strong>
      <span v-if="mode === 'start'">默认左侧单线布局</span>
      <span v-else-if="mode === 'end'">右侧镜像单线布局</span>
      <span v-else>中轴双侧布局</span>
    </p>

    <xy-timeline :mode="mode" :reverse="reverse">
      <xy-timeline-group
        v-for="group in groups"
        :key="group.title"
        :title="group.title"
        :description="group.description"
      >
        <template #extra>
          <span class="demo-timeline-grouped__extra">{{ group.extra }}</span>
        </template>

        <xy-timeline-item
          v-for="item in group.items"
          :key="item.title"
          :state="item.state"
          :timestamp="item.meta"
          placement="top"
        >
          <template #title>
            {{ item.title }}
          </template>

          {{ item.description }}
        </xy-timeline-item>
      </xy-timeline-group>
    </xy-timeline>
  </div>
</template>

<style scoped>
.demo-timeline-grouped {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-timeline-grouped__toolbar {
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

.demo-timeline-grouped__toolbar label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.demo-timeline-grouped__toolbar select {
  min-width: 180px;
  padding: 6px 10px;
  border: 1px solid var(--xy-border-color-strong);
  border-radius: 8px;
  background: var(--xy-bg-color);
  color: var(--xy-text-color);
}

.demo-timeline-grouped__extra {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: var(--xy-radius-pill);
  background: color-mix(in srgb, var(--xy-color-primary) 10%, white);
  color: var(--xy-color-primary);
  font-size: 12px;
}

.demo-timeline-grouped__tip {
  margin: 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.demo-timeline-grouped__tip strong {
  margin-inline: 4px;
  color: var(--xy-text-color);
}

@media (max-width: 768px) {
  .demo-timeline-grouped__toolbar label {
    width: 100%;
  }

  .demo-timeline-grouped__toolbar select {
    width: 100%;
  }
}
</style>
