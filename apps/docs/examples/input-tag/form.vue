<script setup lang="ts">
import { reactive } from "vue";

const model = reactive({
  keywords: undefined as string[] | undefined,
  members: undefined as string[] | undefined
});

const rules = {
  keywords: [{ required: true, message: "请输入关键词标签", trigger: "change" as const }],
  members: [{ required: true, message: "请输入成员标签", trigger: "blur" as const }]
};
</script>

<template>
  <xy-form :model="model" :rules="rules">
    <xy-form-item label="关键词" prop="keywords">
      <xy-input-tag v-model="model.keywords" clearable placeholder="输入后按回车添加" />
    </xy-form-item>
    <xy-form-item label="成员" prop="members">
      <xy-input-tag
        v-model="model.members"
        delimiter=","
        placeholder="支持逗号批量录入"
        tag-status="primary"
        tag-round
      />
    </xy-form-item>
  </xy-form>
</template>
