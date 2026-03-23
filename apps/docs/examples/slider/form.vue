<script setup lang="ts">
import { reactive } from "vue";

const model = reactive({
  score: 65
});

const rules = {
  score: [{ type: "number", min: 60, message: "请至少设置到 60 分", trigger: "change" as const }]
};
</script>

<template>
  <xy-form :model="model" :rules="rules" label-width="96px">
    <xy-form-item label="质检分数" prop="score">
      <xy-slider
        v-model="model.score"
        show-input
        :step="5"
        style="max-width: 460px;"
        :format-tooltip="(value: number) => `${value} 分`"
      />
    </xy-form-item>
  </xy-form>
</template>
