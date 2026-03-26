<script setup lang="ts">
import { ref } from "vue";

const message = ref("根节点不可拖动，且“系统设置”前方与内部不可放置。");

const data = ref([
  {
    id: 1,
    label: "系统设置"
  },
  {
    id: 2,
    label: "业务中心"
  },
  {
    id: 3,
    label: "审计中心"
  }
]);

function allowDrag(node: { key: number }) {
  return node.key !== 1;
}

function allowDrop(
  _draggingNode: { key: number },
  dropNode: { key: number },
  type: "prev" | "inner" | "next"
) {
  if (dropNode.key === 1) {
    return type === "next";
  }

  return type !== "inner";
}

function handleDragEnd(
  draggingNode: { label: string },
  dropNode: { label: string } | null,
  dropType: "before" | "after" | "inner" | "none"
) {
  message.value = dropNode
    ? `${draggingNode.label} 结束于 ${dropNode.label} (${dropType})`
    : `${draggingNode.label} 未完成放置`;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-text size="sm" type="info">{{ message }}</xy-text>

    <div class="xy-doc-field">
      <xy-tree
        :data="data"
        node-key="id"
        draggable
        :allow-drag="allowDrag"
        :allow-drop="allowDrop"
        @node-drag-end="handleDragEnd"
      />
    </div>
  </div>
</template>
