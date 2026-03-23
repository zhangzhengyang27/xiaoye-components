<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | number | null>(null);
const loading = ref(false);
const options = ref([
  { label: "Billing Console", value: "billing", description: "账单中心" },
  { label: "Review Center", value: "review", description: "审批中心" }
]);

async function reload() {
  loading.value = true;

  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

  options.value = [
    { label: "Billing Console", value: "billing", description: "账单中心" },
    { label: "Review Center", value: "review", description: "审批中心" },
    { label: "Admin Flow", value: "admin", description: "流程引擎" }
  ];
  loading.value = false;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="reload">刷新选项</xy-button>
      <xy-tag :status="loading ? 'warning' : 'success'">
        {{ loading ? "加载中" : "已加载" }}
      </xy-tag>
    </xy-space>

    <xy-select
      v-model="value"
      :options="options"
      :loading="loading"
      loading-text="正在同步项目列表"
      clearable
      placeholder="选择项目"
    />
  </div>
</template>
