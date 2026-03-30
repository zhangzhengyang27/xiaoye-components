<script setup lang="ts">
const steps = [
  { key: "upload", title: "上传文件", description: "选择待导入文件" },
  { key: "check", title: "校验数据", description: "确认错误与警告" },
  { key: "done", title: "完成导入", description: "查看最终结果" }
];
</script>

<template>
  <xy-import-wizard title="成员导入" :steps="steps">
    <template #default="{ active }">
      <xy-card :header="`当前步骤 ${active + 1}`">
        <span v-if="active === 0">上传成员模板并确认文件格式。</span>
        <span v-else-if="active === 1">校验字段映射与必填项。</span>
        <span v-else>导入完成后可继续查看结果表格。</span>
      </xy-card>
    </template>
  </xy-import-wizard>
</template>
