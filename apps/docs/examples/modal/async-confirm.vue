<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const submitting = ref(false);
const lastResult = ref("最近一次归档：尚未执行");

async function confirmArchive() {
  submitting.value = true;

  await new Promise((resolve) => {
    window.setTimeout(resolve, 800);
  });

  submitting.value = false;
  open.value = false;
  lastResult.value = "最近一次归档：已归档 2026 Q2 账单模板";
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button type="danger" @click="open = true">归档账单模板</xy-button>
    <xy-tag status="warning">{{ lastResult }}</xy-tag>

    <xy-modal v-model="open" width="560px" title="确认归档">
      <p>归档后模板会从默认列表中移除，但历史账单仍然可追溯。</p>

      <template #footer>
        <xy-space>
          <xy-button plain :disabled="submitting" @click="open = false">取消</xy-button>
          <xy-button type="danger" :loading="submitting" @click="confirmArchive">
            {{ submitting ? "归档中..." : "确认归档" }}
          </xy-button>
        </xy-space>
      </template>
    </xy-modal>
  </div>
</template>
