<script setup lang="ts">
import { reactive } from "vue";

const model = reactive({
  time: null as string | null
});

const rules = {
  time: [{ required: true, message: "请选择提醒时间", trigger: "change" as const }]
};
</script>

<template>
  <xy-form :model="model" :rules="rules" label-width="96px">
    <xy-form-item label="提醒时间" prop="time">
      <xy-time-picker v-model="model.time" clearable />
    </xy-form-item>
  </xy-form>
</template>
