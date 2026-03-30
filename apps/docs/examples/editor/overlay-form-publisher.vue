<script setup lang="ts">
import { reactive, ref } from "vue";

const open = ref(false);
const model = reactive({
  title: "四月版本发布公告",
  content: [
    "# 版本发布说明",
    "",
    "## 本次重点",
    "- 新增页面壳层组件",
    "- 补齐图表与播放器文档",
    "",
    "## 发布提醒",
    "- 今晚 22:00 灰度发布"
  ].join("\n")
});

function fillTemplate() {
  model.content = [
    "# 帮助中心公告",
    "",
    "## 影响范围",
    "- ",
    "",
    "## 处理建议",
    "- "
  ].join("\n");
}
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-card header="公告编辑动作">
      <xy-space wrap>
        <xy-button type="primary" @click="open = true">打开公告编辑器</xy-button>
        <xy-tag status="neutral">这个场景展示 `OverlayForm + Editor` 的组合方式</xy-tag>
      </xy-space>
    </xy-card>

    <xy-overlay-form
      v-model:open="open"
      container="drawer"
      title="编辑公告"
      :model="model"
      destroy-on-close
      :drawer-props="{ size: 820 }"
    >
      <xy-form-item label="公告标题" prop="title">
        <xy-input v-model="model.title" placeholder="请输入公告标题" />
      </xy-form-item>

      <xy-form-item label="公告正文" prop="content">
        <xy-editor v-model="model.content" :min-height="320" placeholder="请输入公告正文" />
      </xy-form-item>

      <template #actions="{ cancel, close }">
        <xy-button plain @click="fillTemplate">插入模板</xy-button>
        <xy-button @click="cancel()">取消</xy-button>
        <xy-button type="primary" @click="close()">保存并关闭</xy-button>
      </template>
    </xy-overlay-form>
  </div>
</template>
