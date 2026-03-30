<script setup lang="ts">
import { ref } from "vue";
import type { EditorInstance } from "@xiaoye/components";

const editorRef = ref<EditorInstance | null>(null);
const content = ref("## 运营周报\n\n点击上方按钮可以快速插入模板内容。");
const latestValue = ref(content.value);

function fillTemplate() {
  const nextValue = `## 本周复盘

- 新增组件文档完善
- 修复 overlay-form 关闭生命周期
- 准备下一阶段迁移计划`;

  editorRef.value?.setValue(nextValue, true);
  content.value = nextValue;
  latestValue.value = nextValue;
}

function syncValue() {
  latestValue.value = editorRef.value?.getValue() ?? "";
}
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-space>
      <xy-button type="primary" @click="fillTemplate">插入模板</xy-button>
      <xy-button plain @click="editorRef?.focus()">聚焦编辑器</xy-button>
      <xy-button plain @click="syncValue">读取当前内容</xy-button>
    </xy-space>

    <xy-editor
      ref="editorRef"
      v-model="content"
      :min-height="300"
      placeholder="请输入公告或文档内容"
    />

    <xy-card header="当前读取到的 Markdown">
      <pre style="white-space: pre-wrap; margin: 0">{{ latestValue }}</pre>
    </xy-card>
  </div>
</template>
