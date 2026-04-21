<template>
  <xyu-checkbox v-model="checked" :indeterminate="true">不确定状态</xyu-checkbox>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const checked = ref(false);
</script>
