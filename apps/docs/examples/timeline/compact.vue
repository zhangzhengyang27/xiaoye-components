<script setup lang="ts">
const records = [
  {
    title: "客户补充备注",
    timestamp: "5 分钟前",
    meta: "法务复核 / 附件已上传",
    description: "补充了线下合同扫描件，等待法务复核。",
    state: "current" as const,
    type: "primary" as const
  },
  {
    title: "处理人已变更",
    timestamp: "20 分钟前",
    meta: "售前支持 -> 交付经理",
    description: "由售前支持转交给交付经理继续跟进。",
    state: "pending" as const,
    type: "warning" as const
  }
];
</script>

<template>
  <div class="demo-timeline-compact">
    <p class="demo-timeline-compact__tip">
      同一份数据下，`default` 更适合常规详情页，`compact` 更适合抽屉、侧栏和窄面板。
    </p>

    <div class="demo-timeline-compact__grid">
      <xy-card class="demo-timeline-compact__card" shadow="hover">
        <template #header>
          <div class="demo-timeline-compact__header">
            <strong class="demo-timeline-compact__header-title">default</strong>
            <span class="demo-timeline-compact__header-description">标准密度</span>
          </div>
        </template>

        <xy-timeline>
          <xy-timeline-group title="今天" description="最近 2 条">
            <xy-timeline-item
              v-for="record in records"
              :key="record.title"
              :timestamp="record.timestamp"
              :state="record.state"
              :type="record.type"
            >
              <template #title>{{ record.title }}</template>
              <template #meta>{{ record.meta }}</template>
              {{ record.description }}
            </xy-timeline-item>
          </xy-timeline-group>
        </xy-timeline>
      </xy-card>

      <xy-card class="demo-timeline-compact__card" shadow="hover">
        <template #header>
          <div class="demo-timeline-compact__header">
            <strong class="demo-timeline-compact__header-title">侧栏详情页 / 最近动态</strong>
            <span class="demo-timeline-compact__header-description">compact 模式</span>
          </div>
        </template>

        <xy-timeline density="compact">
          <xy-timeline-group title="今天" description="最近 2 条" :divider="false">
            <xy-timeline-item
              v-for="record in records"
              :key="record.title"
              :timestamp="record.timestamp"
              :state="record.state"
              :type="record.type"
            >
              <template #title>{{ record.title }}</template>
              <template #meta>{{ record.meta }}</template>
              <template #actions>
                <button class="demo-timeline-compact__action" type="button">查看</button>
              </template>
              {{ record.description }}
            </xy-timeline-item>
          </xy-timeline-group>
        </xy-timeline>
      </xy-card>
    </div>
  </div>
</template>

<style scoped>
.demo-timeline-compact {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-timeline-compact__tip {
  margin: 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.6;
}

.demo-timeline-compact__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.demo-timeline-compact__card {
  min-width: 0;
}

.demo-timeline-compact__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-timeline-compact__header-description {
  color: var(--xy-text-color-secondary);
  font-size: 12px;
}

.demo-timeline-compact__action {
  border: 0;
  border-radius: 999px;
  padding: 4px 10px;
  background: color-mix(in srgb, var(--xy-color-primary) 10%, white);
  color: var(--xy-color-primary);
  font-size: 12px;
  cursor: pointer;
}

@media (max-width: 960px) {
  .demo-timeline-compact__grid {
    grid-template-columns: 1fr;
  }
}
</style>
