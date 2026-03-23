<script setup lang="ts">
import { ref } from "vue";

const security = ref(true);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-switch v-model="security" width="72px">
      <template #active>
        <xy-space :size="4">
          <xy-icon icon="mdi:shield-check-outline" :size="12" />
          <span>安全</span>
        </xy-space>
      </template>

      <template #inactive>
        <xy-space :size="4">
          <xy-icon icon="mdi:shield-off-outline" :size="12" />
          <span>开放</span>
        </xy-space>
      </template>

      <template #active-action>
        <xy-icon icon="mdi:check" :size="12" />
      </template>

      <template #inactive-action>
        <xy-icon icon="mdi:close" :size="12" />
      </template>
    </xy-switch>

    <xy-tag :status="security ? 'success' : 'warning'">
      {{ security ? "当前处于安全模式" : "当前处于开放模式" }}
    </xy-tag>
  </div>
</template>
