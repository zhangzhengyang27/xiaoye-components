<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | number | boolean>("stable");
const options = [
  {
    label: "稳定版",
    value: "stable",
    description: "适合大多数正式环境"
  },
  {
    label: "预览版",
    value: "preview",
    description: "包含最新交互和实验特性"
  },
  {
    label: "内部版",
    value: "internal",
    description: "仅对内部成员开放",
    disabled: true
  }
];
</script>

<template>
  <div class="xy-doc-stack">
    <div class="xy-doc-field">
      <xy-radio-group v-model="value" :options="options" direction="vertical">
        <template #option="{ option, checked, disabled }">
          <div
            class="demo-radio-custom__option"
            :class="{
              'is-checked': checked,
              'is-disabled': disabled
            }"
          >
            <div>
              <strong class="demo-radio-custom__option-title">{{ option.label }}</strong>
              <p class="demo-radio-custom__option-description">{{ option.description }}</p>
            </div>
            <xy-tag size="sm" :status="checked ? 'primary' : 'neutral'" round>
              {{ checked ? "当前" : "可选" }}
            </xy-tag>
          </div>
        </template>
      </xy-radio-group>
    </div>
  </div>
</template>

<style scoped>
.demo-radio-custom__option {
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.demo-radio-custom__option-title {
  display: block;
  color: var(--xy-text-color);
  line-height: 1.4;
}

.demo-radio-custom__option-description {
  margin: 4px 0 0;
  color: var(--xy-text-color-muted);
  font-size: 12px;
  line-height: 1.5;
}

.demo-radio-custom__option.is-disabled .demo-radio-custom__option-title,
.demo-radio-custom__option.is-disabled .demo-radio-custom__option-description {
  color: var(--xy-text-color-muted);
}
</style>
