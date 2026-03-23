<script setup lang="ts">
import { reactive } from "vue";

const model = reactive({
  published: false
});

const rules = {
  published: [
    {
      validator: (_rule: unknown, value: boolean) =>
        value ? Promise.resolve() : Promise.reject(new Error("请开启发布开关")),
      trigger: "change" as const
    }
  ]
};
</script>

<template>
  <xy-form :model="model" :rules="rules">
    <xy-form-item label="发布状态" prop="published" help="切换后会参与 change 校验">
      <xy-switch v-model="model.published" active-text="公开" inactive-text="草稿" />
    </xy-form-item>
  </xy-form>
</template>
