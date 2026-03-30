<script setup lang="ts">
import { XyButton, XyCard, XySteps, XyText } from "@xiaoye/components";
import type { ApprovalFlowAction, ApprovalFlowPanelProps } from "./approval-flow-panel";

defineOptions({
  name: "XyApprovalFlowPanel"
});

const props = withDefaults(defineProps<ApprovalFlowPanelProps>(), {
  title: "审批流程",
  nodes: () => [],
  actions: () => []
});

const emit = defineEmits<{
  action: [action: ApprovalFlowAction];
  "node-click": [node: { key: string }];
}>();

function activeIndex() {
  const index = props.nodes.findIndex((node) => node.status === "process");
  return index >= 0 ? index : Math.max(props.nodes.length - 1, 0);
}
</script>

<template>
  <xy-card class="xy-approval-flow-panel" :header="props.title">
    <xy-steps
      :active="activeIndex()"
      :items="
        props.nodes.map((node) => ({
          key: node.key,
          title: node.title,
          description: node.description,
          status: node.status
        }))
      "
    />
    <div class="xy-approval-flow-panel__nodes">
      <button
        v-for="node in props.nodes"
        :key="node.key"
        type="button"
        class="xy-approval-flow-panel__node"
        @click="emit('node-click', node)"
      >
        <strong>{{ node.title }}</strong>
        <xy-text v-if="node.assignee" type="default">{{ node.assignee }}</xy-text>
        <xy-text v-if="node.time" size="sm">{{ node.time }}</xy-text>
      </button>
    </div>
    <div v-if="props.actions.length > 0 || $slots.actions" class="xy-approval-flow-panel__actions">
      <slot name="actions">
        <xy-button
          v-for="action in props.actions"
          :key="action.key"
          :type="action.type"
          @click="emit('action', action)"
        >
          {{ action.label }}
        </xy-button>
      </slot>
    </div>
  </xy-card>
</template>
