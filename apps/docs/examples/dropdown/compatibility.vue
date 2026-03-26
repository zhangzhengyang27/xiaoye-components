<script setup lang="ts">
import { ref } from "vue";

const feedback = ref("兼容模式：等待触发");

function handleSelect(item: { label: string }) {
  feedback.value = `兼容模式已触发：${item.label}`;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-dropdown
      trigger="click"
      :items="[
        { key: 'edit', label: '编辑成员' },
        { key: 'disable', label: '停用账号', disabled: true, description: '当前状态不可操作' },
        { key: 'delete', label: '删除成员', danger: true, divided: true, icon: 'mdi:delete-outline' }
      ]"
      @select="handleSelect"
    >
      <xy-button plain>items 兼容模式</xy-button>
    </xy-dropdown>

    <xy-tag status="neutral">{{ feedback }}</xy-tag>
  </div>
</template>
