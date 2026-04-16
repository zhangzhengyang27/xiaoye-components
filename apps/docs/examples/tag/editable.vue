<script setup lang="ts">
import { computed, nextTick, ref } from "vue";

const draft = ref("");
const inputVisible = ref(false);
const inputRef = ref<{ focus?: () => void } | null>(null);
const tags = ref([
  { label: "Vue 3", status: "primary" },
  { label: "TypeScript", status: "success" },
  { label: "Playground", status: "warning" }
]);

const canCreate = computed(() => draft.value.trim().length > 0);

function handleClose(label: string) {
  tags.value = tags.value.filter((item) => item.label !== label);
}

async function showInput() {
  inputVisible.value = true;
  await nextTick();
  inputRef.value?.focus?.();
}

function confirmInput() {
  const value = draft.value.trim();

  if (value) {
    tags.value.push({
      label: value,
      status: "neutral"
    });
  }

  draft.value = "";
  inputVisible.value = false;
}
</script>

<template>
  <div class="demo-tag-editable">
    <xy-space wrap>
      <xy-tag
        v-for="tag in tags"
        :key="tag.label"
        :status="tag.status"
        closable
        round
        @close="handleClose(tag.label)"
      >
        {{ tag.label }}
      </xy-tag>
    </xy-space>
    <div class="demo-tag-editable__actions">
      <xy-input
        v-if="inputVisible"
        ref="inputRef"
        v-model="draft"
        class="demo-tag-editable__input"
        placeholder="输入新标签"
        @keydown.enter="confirmInput"
        @blur="confirmInput"
      />
      <xy-button v-else text bg @click="showInput">+ 新建标签</xy-button>
      <xy-button
        v-if="inputVisible"
        type="primary"
        size="sm"
        :disabled="!canCreate"
        @click="confirmInput"
      >
        添加
      </xy-button>
    </div>
  </div>
</template>

<style scoped>
.demo-tag-editable {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.demo-tag-editable__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 360px;
}

.demo-tag-editable__input {
  max-width: 220px;
}
</style>
