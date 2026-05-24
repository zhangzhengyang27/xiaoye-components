<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | number | null>("finance");

const options = [
  { label: "财务", value: "finance" },
  { label: "运营", value: "ops" },
  { label: "访客", value: "guest", disabled: true, description: "当前不可选择" }
];
</script>

<template>
  <!-- 选择器禁用状态：展示禁用和包含禁用项的用法 -->
  <div class="demo-select-disabled">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-select-disabled__header">
          <strong>禁用状态</strong>
          <xy-tag status="neutral" round>禁用</xy-tag>
        </div>
        <p class="demo-select-disabled__description">
          禁用整个选择器或其中部分选项，表示当前不可操作。
        </p>
      </template>

      <div class="demo-select-disabled__grid">
        <xy-select
          v-model="value"
          :options="options"
          disabled
          placeholder="禁用选择器"
        />
        <xy-select :options="options" placeholder="包含禁用项" />
      </div>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-select-disabled {
  max-width: 640px;
}

.demo-select-disabled__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-select-disabled__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-select-disabled__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 680px) {
  .demo-select-disabled__grid {
    grid-template-columns: 1fr;
  }
}
</style>
