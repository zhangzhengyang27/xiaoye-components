<script setup lang="ts">
import { ref } from "vue";

const latestDrop = ref("拖动节点查看 dropType");

const data = ref([
  {
    id: 1,
    label: "首页模块"
  },
  {
    id: 2,
    label: "结算模块"
  },
  {
    id: 3,
    label: "审批模块"
  }
]);

function handleDrop(
  draggingNode: { label: string },
  dropNode: { label: string },
  dropType: "before" | "after" | "inner",
  _event: DragEvent,
  detail: { oldIndex: number; newIndex: number }
) {
  latestDrop.value = `${draggingNode.label} -> ${dropNode.label} (${dropType})，${detail.oldIndex} → ${detail.newIndex}`;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-text size="sm" type="info">{{ latestDrop }}</xy-text>

    <div class="xy-doc-field">
      <xy-tree
        :data="data"
        node-key="id"
        draggable
        @node-drop="handleDrop"
      />
    </div>
  </div>
</template>
