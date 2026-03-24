<script setup lang="ts">
import { ref } from "vue";

const checked = ref(false);
const published = ref<"on" | "off">("off");
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-checkbox v-model="checked">接收通知</xy-checkbox>
      <xy-checkbox v-model="published" true-value="on" false-value="off" border>
        发布到首页
      </xy-checkbox>
    </xy-space>
    <xy-text size="sm">布尔值：{{ checked ? "true" : "false" }}，枚举值：{{ published }}</xy-text>
  </div>
</template>
