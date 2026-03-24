<script setup lang="ts">
import { reactive } from "vue";

const model = reactive({
  visitAt: null as string | null
});

const rules = {
  visitAt: [{ required: true, message: "请选择拜访时间", trigger: "change" as const }]
};
</script>

<template>
  <xy-form :model="model" :rules="rules">
    <xy-form-item label="拜访时间" prop="visitAt">
      <xy-time-select
        v-model="model.visitAt"
        clearable
        start="09:00"
        end="20:00"
        step="00:30"
      />
    </xy-form-item>
  </xy-form>
</template>
