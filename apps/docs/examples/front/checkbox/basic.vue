<template>
  <xyu-checkbox v-model="checked">同意协议</xyu-checkbox>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const checked = ref(false);
</script>
