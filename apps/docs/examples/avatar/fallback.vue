<script setup lang="ts">
import { ref } from "vue";

const errorCount = ref(0);

function handleError() {
  errorCount.value += 1;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap align="center">
      <xy-avatar
        src="https://example.com/not-found-avatar.png"
        icon="mdi:account-outline"
        @error="handleError"
      />
      <xy-avatar src="https://example.com/not-found-avatar.png" @error="handleError">
        访客
      </xy-avatar>
    </xy-space>

    <xy-space>
      <xy-tag status="warning">图片加载失败次数：{{ errorCount }}</xy-tag>
    </xy-space>
  </div>
</template>
