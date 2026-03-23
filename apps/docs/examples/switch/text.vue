<script setup lang="ts">
import { ref } from "vue";

const mode = ref<"auto" | "manual">("auto");
const visible = ref(false);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-switch
        v-model="mode"
        active-value="auto"
        inactive-value="manual"
        active-text="自动"
        inactive-text="手动"
      />
      <xy-switch
        v-model="visible"
        inline-prompt
        active-icon="mdi:eye-outline"
        inactive-icon="mdi:eye-off-outline"
        width="56px"
      />
    </xy-space>
    <xy-text size="sm">模式值：{{ mode }}</xy-text>
  </div>
</template>
