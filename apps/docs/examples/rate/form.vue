<script setup lang="ts">
import { reactive } from "vue";

const model = reactive({
  score: 0
});

const rules = {
  score: [{ required: true, type: "number", min: 1, message: "请至少选择 1 星", trigger: "change" as const }]
};
</script>

<template>
  <xy-form :model="model" :rules="rules" label-width="88px">
    <xy-form-item label="服务评分" prop="score">
      <xy-rate v-model="model.score" allow-half show-score score-template="{value} 分" />
    </xy-form-item>
  </xy-form>
</template>
