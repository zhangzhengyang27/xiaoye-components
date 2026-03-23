<script setup lang="ts">
import { reactive } from "vue";

const model = reactive({
  quantity: null as number | null,
  ratio: 0.2
});

const rules = {
  quantity: [{ required: true, message: "请输入采购数量", trigger: "change" as const }],
  ratio: [{ required: true, message: "请输入分润比例", trigger: "blur" as const }]
};
</script>

<template>
  <xy-form :model="model" :rules="rules">
    <xy-form-item label="采购数量" prop="quantity" help="变更后会触发 change 校验">
      <xy-input-number v-model="model.quantity" :min="1" :max="999" />
    </xy-form-item>
    <xy-form-item label="分润比例" prop="ratio" help="失焦后会触发 blur 校验">
      <xy-input-number
        v-model="model.ratio"
        :step="0.05"
        :precision="2"
        step-strictly
        :min="0"
        :max="1"
        controls-position="right"
      />
    </xy-form-item>
  </xy-form>
</template>
