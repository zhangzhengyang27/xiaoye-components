<template>
  <xyu-space direction="vertical">
    <xyu-checkbox disabled>禁用选项</xyu-checkbox>
    <xyu-checkbox v-model="checked" disabled>禁用已选中</xyu-checkbox>
  </xyu-space>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const checked = ref(true);
</script>
