<script setup lang="ts">
const illustration = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="160" height="96" viewBox="0 0 160 96" fill="none">
    <rect x="18" y="16" width="124" height="64" rx="18" fill="#E2E8F0" />
    <rect x="36" y="34" width="72" height="10" rx="5" fill="#94A3B8" />
    <rect x="36" y="52" width="48" height="10" rx="5" fill="#CBD5E1" />
    <circle cx="116" cy="48" r="12" fill="#2563EB" />
  </svg>
`)}`;
</script>

<template>
  <xy-empty
    :image="illustration"
    image-alt="排期任务空状态插画"
    style="
      --xy-empty-image-width: 176px;
      --xy-empty-footer-margin-top: 12px;
    "
  >
    <template #title>
      <strong>暂无排期任务</strong>
    </template>

    <template #description>
      <div class="xy-doc-stack">
        <span>你可以先创建第一个排期，或者从模板快速导入。</span>
        <xy-tag status="primary">支持自定义 image / image-alt / title / description</xy-tag>
      </div>
    </template>

    <xy-space wrap>
      <xy-button type="primary">新建任务</xy-button>
      <xy-button plain>导入模板</xy-button>
    </xy-space>
  </xy-empty>
</template>
