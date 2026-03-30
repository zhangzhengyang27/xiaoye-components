<script setup lang="ts">
import { ref } from "vue";

const content = ref("# 版本说明\n\n- 新增图表与播放器封装\n- 补齐消息中心与页签能力");
</script>

<template>
  <xy-editor v-model="content" :min-height="320" />
</template>
