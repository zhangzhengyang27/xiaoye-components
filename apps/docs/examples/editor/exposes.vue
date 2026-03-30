<script setup lang="ts">
import { ref } from "vue";

type EditorExpose = {
  getValue: () => string;
  setValue: (value: string, clearStack?: boolean) => void;
  focus: () => void;
} | null;

const editorRef = ref<EditorExpose>(null);
const content = ref("## 操作手册\n\n点击下方按钮可以通过暴露实例控制编辑器。");
const snapshot = ref(content.value);

function applyTemplate() {
  editorRef.value?.setValue(
    [
      "# 发布检查清单",
      "",
      "- [ ] 核对变更说明",
      "- [ ] 运行文档构建",
      "- [ ] 通知业务方验收"
    ].join("\n"),
    true
  );
}

function readSnapshot() {
  snapshot.value = editorRef.value?.getValue() ?? "";
}

function clearContent() {
  editorRef.value?.setValue("", true);
  readSnapshot();
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="applyTemplate">填入模板</xy-button>
      <xy-button plain @click="editorRef?.focus()">聚焦编辑器</xy-button>
      <xy-button plain @click="readSnapshot">读取当前内容</xy-button>
      <xy-button text @click="clearContent">清空内容</xy-button>
    </xy-space>

    <xy-editor ref="editorRef" v-model="content" :min-height="280" />

    <xy-card header="最近一次读取结果">
      <pre style="margin: 0; white-space: pre-wrap">{{ snapshot }}</pre>
    </xy-card>
  </div>
</template>
