<template>
  <xyu-input-tag v-model="tags" clearable />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tags = ref(['标签一', '标签二']);
</script>
