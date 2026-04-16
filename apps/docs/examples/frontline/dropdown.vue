<script setup lang="ts">
const items = [
  { key: "guide", label: "查看接入指南", command: "guide", description: "先了解实验线目标" },
  { key: "showcase", label: "打开页面样板", command: "showcase", description: "直接看整体页面语言" },
  { key: "notes", label: "记录评审结论", command: "notes", description: "把当前判断收口成文档" }
];
</script>

<template>
  <xy-front-dropdown :items="items">
    <template #trigger>
      <xy-front-button variant="outline" trailing-icon="mdi:chevron-down">
        打开资源菜单
      </xy-front-button>
    </template>
  </xy-front-dropdown>
</template>
