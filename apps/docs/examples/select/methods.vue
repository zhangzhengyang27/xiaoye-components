<script setup lang="ts">
import { ref } from "vue";

const value = ref<string | number | null>(null);
const visible = ref("关闭");
const selectRef = ref<{
  focus: () => void;
  blur: () => Promise<void>;
  open: () => Promise<void>;
  close: () => Promise<void>;
} | null>(null);

async function openDropdown() {
  await selectRef.value?.open();
  visible.value = "打开";
}

async function closeDropdown() {
  await selectRef.value?.close();
  visible.value = "关闭";
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button plain @click="selectRef?.focus()">focus()</xy-button>
      <xy-button plain @click="selectRef?.blur()">blur()</xy-button>
      <xy-button type="primary" @click="openDropdown">open()</xy-button>
      <xy-button plain @click="closeDropdown">close()</xy-button>
    </xy-space>

    <xy-select
      ref="selectRef"
      v-model="value"
      :options="[
        { label: '管理员', value: 'admin' },
        { label: '成员', value: 'member' },
        { label: '访客', value: 'guest' }
      ]"
      clearable
      placeholder="方法控制下拉面板"
      @visible-change="visible = $event ? '打开' : '关闭'"
    />

    <xy-space wrap>
      <xy-tag status="primary">当前值：{{ value ?? "未选择" }}</xy-tag>
      <xy-tag :status="visible === '打开' ? 'success' : 'neutral'">面板：{{ visible }}</xy-tag>
    </xy-space>
  </div>
</template>
