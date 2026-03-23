<script setup lang="ts">
import { ref } from "vue";

const whitelist = ref(["10.0.0.1"]);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-input-tag
      v-model="whitelist"
      delimiter=","
      clearable
      :max="5"
      placeholder="支持逗号分隔，最多 5 项"
      tag-status="success"
    />
    <xy-text size="sm">当前白名单：{{ whitelist.join("，") }}</xy-text>
  </div>
</template>
