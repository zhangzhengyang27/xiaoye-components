<script setup lang="ts">
import { reactive } from "vue";

const model = reactive({
  date: null as string | null
});

const rules = {
  date: [{ required: true, message: "请选择日期", trigger: "change" as const }]
};
</script>

<template>
  <xy-form :model="model" :rules="rules">
    <xy-form-item label="生效日期" prop="date">
      <xy-date-picker v-model="model.date" clearable />
    </xy-form-item>
  </xy-form>
</template>
