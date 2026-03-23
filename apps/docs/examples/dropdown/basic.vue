<script setup lang="ts">
import { ref } from "vue";

const feedback = ref("尚未触发操作");

function handleSelect(item: { label: string }) {
  feedback.value = `已触发操作：${item.label}`;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-dropdown
        :items="[
          { key: 'edit', label: '编辑成员' },
          { key: 'disable', label: '停用账号', disabled: true, description: '当前状态不可操作' },
          { key: 'delete', label: '删除成员', danger: true }
        ]"
        @select="handleSelect"
      >
        <xy-button plain>更多操作</xy-button>
      </xy-dropdown>
      <xy-tag status="primary">{{ feedback }}</xy-tag>
    </xy-space>
  </div>
</template>
