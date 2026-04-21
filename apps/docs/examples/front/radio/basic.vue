<template>
  <xyu-radio v-model="value">同意协议</xyu-radio>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref(false);
</script>
