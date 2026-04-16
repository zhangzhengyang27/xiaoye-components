<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | number | null>(null);
const options = ref([
  { label: "Billing Console", value: "billing", description: "账单中心" },
  { label: "Review Center", value: "review", description: "审批中心" }
]);
const loading = ref(false);

async function refresh() {
  loading.value = true;

  await new Promise((resolve) => {
    setTimeout(resolve, 300);
  });

  options.value = [
    { label: "Billing Console", value: "billing", description: "账单中心" },
    { label: "Review Center", value: "review", description: "审批中心" },
    { label: "Admin Flow", value: "admin", description: "后台流程引擎" }
  ];
  loading.value = false;
}
</script>

<template>
  <div class="xy-doc-stack">
    <div class="xy-doc-field xy-doc-field--popper-demo">
      <xy-select
        v-model="value"
        :options="options"
        :loading="loading"
        searchable
        clearable
        placeholder="选择项目"
      >
        <template #header>
          <xy-text size="sm" type="info">项目列表会在这里承接筛选说明或快捷操作。</xy-text>
        </template>

        <template #option="{ option, selected }">
          <span class="demo-select-option">
            <strong class="demo-select-option__title">{{ option.label }}</strong>
            <small class="demo-select-option__caption">{{ selected ? "已选中" : option.description }}</small>
          </span>
        </template>

        <template #empty>
          <xy-empty title="没有匹配项目" description="可以尝试切换关键词或刷新数据" />
        </template>

        <template #footer>
          <xy-button text bg @click.stop="refresh">刷新项目列表</xy-button>
        </template>
      </xy-select>
    </div>
  </div>
</template>

<style scoped>
.demo-select-option {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.demo-select-option__title {
  font-weight: 600;
}

.demo-select-option__caption {
  color: var(--xy-text-color-secondary);
}
</style>
