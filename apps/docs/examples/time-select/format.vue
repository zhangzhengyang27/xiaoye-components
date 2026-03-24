<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | null>("09:00 AM");
</script>

<template>
  <div class="xy-doc-stack">
    <div style="width: 320px; max-width: 100%">
      <xy-time-select
        v-model="value"
        start="08:00"
        end="12:00"
        step="00:45"
        include-end-time
        format="hh:mm A"
        clearable
      />
    </div>

    <xy-space>
      <xy-tag status="success">展示与回传：{{ value ?? "未选择" }}</xy-tag>
    </xy-space>
  </div>
</template>
