<script setup lang="ts">
import { reactive } from "vue";

const form = reactive({
  module: ""
});

const rules = {
  module: [{ required: true, message: "请选择模块", trigger: "change" }]
};

const options = [
  { label: "控制台", value: 1 },
  { label: "账单中心", value: 2 }
];
</script>

<template>
  <xy-form :model="form" :rules="rules" label-width="96px">
    <xy-form-item label="模块" prop="module">
      <xy-auto-complete v-model="form.module" :options="options" placeholder="请输入或选择模块" />
    </xy-form-item>
  </xy-form>
</template>
