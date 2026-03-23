<script setup lang="ts">
import { reactive } from "vue";

const model = reactive({
  name: ""
});

const rules = {
  name: [{ required: true, message: "请输入成员名称", trigger: "blur" as const }]
};
</script>

<template>
  <xy-form :model="model" :rules="rules">
    <xy-form-item label="成员名称" prop="name" help="失焦后会触发 blur 校验">
      <xy-input v-model="model.name" clearable placeholder="请输入成员名称" />
    </xy-form-item>
  </xy-form>
</template>
