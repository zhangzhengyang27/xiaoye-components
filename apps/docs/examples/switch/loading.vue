<script setup lang="ts">
import { ref } from "vue";

const loading = ref(false);
const checked = ref(false);

function beforeChange() {
  loading.value = true;

  return new Promise<boolean>((resolve) => {
    window.setTimeout(() => {
      loading.value = false;
      resolve(true);
    }, 800);
  });
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-switch
        v-model="checked"
        :loading="loading"
        active-text="同步中"
        inactive-text="待开启"
        :before-change="beforeChange"
      />
      <xy-switch disabled active-text="锁定" inactive-text="锁定" />
    </xy-space>
    <xy-text size="sm">异步开关：{{ checked ? "已开启" : "已关闭" }}</xy-text>
  </div>
</template>
