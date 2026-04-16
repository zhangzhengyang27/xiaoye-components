<script setup lang="ts">
import { ref } from "vue";

const email = ref("");
</script>

<template>
  <div class="frontline-input-demo">
    <xy-front-input
      v-model="email"
      type="email"
      placeholder="输入邮箱，获取实验线更新"
      leading-icon="mdi:email-fast-outline"
      clearable
      variant="soft"
    />
  </div>
</template>

<style scoped>
.frontline-input-demo {
  max-width: 420px;
}
</style>
