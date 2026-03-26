<script setup lang="ts">
import { computed, ref } from "vue";

type ReviewScene = "reviewing" | "rejected" | "resubmitted";

const scene = ref<ReviewScene>("reviewing");

const sceneConfig: Record<
  ReviewScene,
  {
    active: number;
    status: "primary" | "warning" | "success";
    label: string;
    summary: string;
  }
> = {
  reviewing: {
    active: 1,
    status: "primary",
    label: "风控校验中",
    summary: "当前还在风控校验阶段，流程正常推进。"
  },
  rejected: {
    active: 2,
    status: "warning",
    label: "命中规则已打回",
    summary: "第二步命中规则后被打回，当前转到“补充材料”节点。"
  },
  resubmitted: {
    active: 3,
    status: "success",
    label: "补充后已重提",
    summary: "材料补齐后重新提交，流程已经回到主干并继续推进。"
  }
};

const currentConfig = computed(() => sceneConfig[scene.value]);
const riskStatus = computed(() => (scene.value === "rejected" ? "error" : ""));
</script>

<template>
  <xy-card class="demo-steps-rollback" shadow="always">
    <template #header>
      <div class="demo-steps-rollback__header">
        <div>
          <strong>审批打回与重提</strong>
          <p>把“命中规则 -> 补充材料 -> 重新提交”的真实流转放进同一条步骤链路里看。</p>
        </div>
        <xy-tag :status="currentConfig.status" round>{{ currentConfig.label }}</xy-tag>
      </div>
    </template>

    <xy-steps
      :active="currentConfig.active"
      finish-status="success"
      process-status="process"
      space="25%"
    >
      <xy-step title="提交申请" description="上传基础信息和业务说明。" />
      <xy-step
        title="风控校验"
        description="自动规则命中后需要补充说明。"
        :status="riskStatus"
      />
      <xy-step title="补充材料" description="补传附件、修正文案并重新提交。" />
      <xy-step title="恢复发布" description="校验通过后继续回到正常链路。" />
    </xy-steps>

    <div class="demo-steps-rollback__toolbar">
      <xy-button
        plain
        :type="scene === 'reviewing' ? 'primary' : 'default'"
        @click="scene = 'reviewing'"
      >
        正常校验
      </xy-button>
      <xy-button
        plain
        :type="scene === 'rejected' ? 'warning' : 'default'"
        @click="scene = 'rejected'"
      >
        模拟打回
      </xy-button>
      <xy-button
        plain
        :type="scene === 'resubmitted' ? 'success' : 'default'"
        @click="scene = 'resubmitted'"
      >
        补充后重提
      </xy-button>
    </div>

    <template #footer>
      <xy-text size="sm" type="info">
        {{ currentConfig.summary }} 这个示例顺带演示了 `space=\"25%\"` 这类百分比步距的接法。
      </xy-text>
    </template>
  </xy-card>
</template>

<style scoped>
.demo-steps-rollback {
  max-width: 860px;
}

.demo-steps-rollback__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.demo-steps-rollback__header p {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.demo-steps-rollback__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}

@media (max-width: 640px) {
  .demo-steps-rollback__header {
    flex-direction: column;
  }
}
</style>
