<script setup lang="ts">
import { ref } from "vue";

const enabled = ref(true);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-switch v-model="enabled" active-text="已启用" inactive-text="已停用" />
    <xy-tag :status="enabled ? 'success' : 'warning'">
      {{ enabled ? "当前为启用状态" : "当前为停用状态" }}
    </xy-tag>
  </div>
</template>
