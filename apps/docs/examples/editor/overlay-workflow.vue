<script setup lang="ts">
import { reactive, ref } from "vue";

const open = ref(false);
const submitting = ref(false);
const publishNote = ref("尚未提交");

const formModel = reactive({
  title: "四月版本公告",
  channel: "站内公告",
  content: [
    "# 四月版本更新",
    "",
    "## 本次重点",
    "- 页面展示壳层接入完成",
    "- 覆盖层表单补齐 destroyOnClose"
  ].join("\n")
});

async function handleSubmit() {
  submitting.value = true;

  window.setTimeout(() => {
    publishNote.value = `已保存《${formModel.title}》到 ${formModel.channel}`;
    submitting.value = false;
    open.value = false;
  }, 400);
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-card header="公告管理列表">
      <xy-space wrap>
        <xy-tag status="primary">当前文档：{{ formModel.title }}</xy-tag>
        <xy-tag status="neutral">{{ publishNote }}</xy-tag>
        <xy-button type="primary" @click="open = true">打开覆盖层编辑</xy-button>
      </xy-space>
    </xy-card>

    <xy-overlay-form
      v-model:open="open"
      container="drawer"
      title="覆盖层编辑公告"
      :model="formModel"
      :submitting="submitting"
      destroy-on-close
      @submit="handleSubmit"
    >
      <div class="xy-doc-stack" style="width: 100%">
        <xy-input v-model="formModel.title" placeholder="请输入公告标题" />
        <xy-select
          v-model="formModel.channel"
          :options="[
            { label: '站内公告', value: '站内公告' },
            { label: '帮助中心', value: '帮助中心' },
            { label: '版本日志', value: '版本日志' }
          ]"
        />
        <xy-editor
          v-model="formModel.content"
          :min-height="320"
          placeholder="请输入公告正文"
        />
      </div>
    </xy-overlay-form>
  </div>
</template>
