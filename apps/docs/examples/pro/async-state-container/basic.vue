<script setup lang="ts">
import { ref } from "vue";

const stage = ref<"loading" | "error" | "empty" | "content">("loading");
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space>
      <xy-button @click="stage = 'loading'">Loading</xy-button>
      <xy-button @click="stage = 'error'">Error</xy-button>
      <xy-button @click="stage = 'empty'">Empty</xy-button>
      <xy-button @click="stage = 'content'">Content</xy-button>
    </xy-space>

    <xy-async-state-container
      :loading="stage === 'loading'"
      :error="stage === 'error' ? '网络超时，请重试' : null"
      :empty="stage === 'empty'"
    >
      <xy-card header="异步内容区">这里展示真正的内容主体。</xy-card>
    </xy-async-state-container>
  </div>
</template>
