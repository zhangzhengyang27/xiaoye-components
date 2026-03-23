<script setup lang="ts">
import { computed, reactive } from "vue";

const model = reactive({
  summary: "用于演示自动高度和字数统计的默认内容。"
});

const rules = {
  summary: [{ required: true, message: "请输入项目摘要", trigger: "blur" as const }]
};

const summaryStatus = computed(() => {
  const length = model.summary.trim().length;

  if (length === 0) {
    return "danger";
  }

  if (length < 20) {
    return "warning";
  }

  return "success";
});
</script>

<template>
  <div class="xy-doc-stack">
    <xy-form :model="model" :rules="rules">
      <xy-form-item
        label="项目摘要"
        prop="summary"
        help="失焦后会触发 blur 校验；内容变长时高度会自动扩展。"
      >
        <xy-input
          v-model="model.summary"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6 }"
          maxlength="120"
          show-word-limit
          clearable
          placeholder="请输入项目摘要"
        />
      </xy-form-item>
    </xy-form>

    <xy-tag :status="summaryStatus"> 当前摘要长度：{{ model.summary.trim().length }} / 120 </xy-tag>
  </div>
</template>
