<script setup lang="ts">
import { reactive } from "vue";

const form = reactive({
  keyword: "",
  role: 1
});

const options = [
  { label: "管理员", value: 1 },
  { label: "成员", value: 2 }
];
</script>

<template>
  <xy-form :model="form" inline>
    <xy-form-item label="关键词" prop="keyword">
      <xy-input v-model="form.keyword" placeholder="请输入关键词" />
    </xy-form-item>
    <xy-form-item label="角色" prop="role">
      <xy-select v-model="form.role" :options="options" />
    </xy-form-item>
  </xy-form>
</template>
