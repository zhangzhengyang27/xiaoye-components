<script setup lang="ts">
import { ref } from "vue";

const tags = ref(["Vue", "React", "Svelte", "Solid"]);
const lastDrag = ref("暂未发生排序");

function handleDragTag(oldIndex: number, newIndex: number, value: string) {
  lastDrag.value = `${value}：${oldIndex} -> ${newIndex}`;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-input-tag
      v-model="tags"
      draggable
      clearable
      tag-status="primary"
      placeholder="可直接拖动标签调整顺序"
      @drag-tag="handleDragTag"
    />
    <xy-text size="sm">当前顺序：{{ tags.join(" / ") }}</xy-text>
    <xy-text size="sm">最近一次拖拽：{{ lastDrag }}</xy-text>
  </div>
</template>
