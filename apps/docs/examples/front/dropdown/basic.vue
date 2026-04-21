<template>
  <xyu-dropdown
    :items="items"
    trigger="hover"
    @select="handleSelect"
  >
    <xyu-button>悬停显示菜单</xyu-button>
  </xyu-dropdown>
</template>

<script setup lang="ts">
const items = [
  { key: '1', label: '选项一' },
  { key: '2', label: '选项二' },
  { key: '3', label: '选项三', disabled: true },
];

function handleSelect(key: string) {
  console.log('selected:', key);
}
</script>
