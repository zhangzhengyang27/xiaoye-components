<script setup lang="ts">
import { ref } from "vue";

const title = ref("四月版本发布公告");
const category = ref("产品更新");
const content = ref(
  [
    "# 四月版本更新",
    "",
    "## 本次重点",
    "",
    "- 新增图表、编辑器与播放器封装",
    "- 完成 OverlayForm 关闭生命周期补齐",
    "- 增强中后台页面壳层组件"
  ].join("\n")
);
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-card header="公告编辑页">
      <div
        style="
          display: grid;
          grid-template-columns: minmax(0, 1.8fr) minmax(260px, 0.8fr);
          gap: 16px;
        "
      >
        <div class="xy-doc-stack">
          <xy-input v-model="title" placeholder="请输入公告标题" />
          <xy-space wrap>
            <xy-tag status="primary">{{ category }}</xy-tag>
            <xy-tag status="warning">待发布</xy-tag>
            <xy-button type="primary">提交审核</xy-button>
            <xy-button plain>保存草稿</xy-button>
          </xy-space>
          <xy-editor
            v-model="content"
            :min-height="340"
            placeholder="请输入公告正文"
          />
        </div>

        <div class="xy-doc-stack">
          <xy-card header="发布信息">
            <xy-descriptions :column="1" border>
              <xy-descriptions-item label="栏目">{{ category }}</xy-descriptions-item>
              <xy-descriptions-item label="创建人">小叶</xy-descriptions-item>
              <xy-descriptions-item label="面向范围">全员可见</xy-descriptions-item>
            </xy-descriptions>
          </xy-card>

          <xy-card header="当前摘要">
            <pre style="margin: 0; white-space: pre-wrap">{{ content.slice(0, 160) }}...</pre>
          </xy-card>
        </div>
      </div>
    </xy-card>
  </div>
</template>
