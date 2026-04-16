<script setup lang="ts">
import { computed, ref } from "vue";

const active = ref(0);

const panels = [
  {
    title: "基础信息",
    hint: "先把租户名、环境和可见范围这些不会频繁变的字段确认下来。",
    bullets: ["租户简称与标识符", "部署环境与地域", "默认负责人和通知组"]
  },
  {
    title: "成员与权限",
    hint: "再把访问角色、审批链路和告警订阅补齐，避免发布后临时补权限。",
    bullets: ["管理员与只读角色", "审批人和抄送对象", "告警渠道与接收范围"]
  },
  {
    title: "确认发布",
    hint: "最后统一检查风险提示、变更摘要和回滚策略，再进入正式发布。",
    bullets: ["环境差异检查", "回滚预案与责任人", "最终确认与提交"]
  }
] as const;

const currentPanel = computed(() => panels[active.value]);
const isLast = computed(() => active.value === panels.length - 1);
</script>

<template>
  <div class="demo-steps-wizard">
    <xy-steps :active="active" align-center finish-status="success">
      <xy-step
        v-for="panel in panels"
        :key="panel.title"
        :title="panel.title"
        :description="panel.hint"
      />
    </xy-steps>

    <xy-card class="demo-steps-wizard__panel" shadow="always">
      <template #header>
        <div class="demo-steps-wizard__header">
          <div>
            <strong>{{ currentPanel.title }}</strong>
            <p class="demo-steps-wizard__header-description">{{ currentPanel.hint }}</p>
          </div>
          <xy-tag status="primary" round>第 {{ active + 1 }} / {{ panels.length }} 步</xy-tag>
        </div>
      </template>

      <ul class="demo-steps-wizard__list">
        <li v-for="item in currentPanel.bullets" :key="item" class="demo-steps-wizard__item">{{ item }}</li>
      </ul>

      <template #footer>
        <div class="demo-steps-wizard__actions">
          <xy-button plain @click="active = Math.max(active - 1, 0)">上一步</xy-button>
          <xy-button plain>保存草稿</xy-button>
          <xy-button type="primary" @click="active = isLast ? 0 : active + 1">
            {{ isLast ? "重新开始" : "下一步" }}
          </xy-button>
        </div>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-steps-wizard {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.demo-steps-wizard__panel {
  max-width: 820px;
}

.demo-steps-wizard__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.demo-steps-wizard__header-description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.demo-steps-wizard__list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding-left: 20px;
  color: var(--xy-text-color);
}

.demo-steps-wizard__item {
  line-height: 1.7;
}

.demo-steps-wizard__actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 640px) {
  .demo-steps-wizard__header {
    flex-direction: column;
  }

  .demo-steps-wizard__actions {
    justify-content: stretch;
  }
}
</style>
