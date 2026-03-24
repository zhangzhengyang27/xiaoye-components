<script setup lang="ts">
import { reactive } from "vue";

const model = reactive({
  roles: [] as string[]
});

const rules = {
  roles: [
    {
      validator: (_rule: unknown, value: string[]) =>
        value.length ? Promise.resolve() : Promise.reject(new Error("请至少选择一个角色")),
      trigger: "change" as const
    }
  ]
};
</script>

<template>
  <xy-form :model="model" :rules="rules">
    <xy-form-item label="角色范围" prop="roles">
      <xy-checkbox-group v-model="model.roles">
        <xy-checkbox value="owner">Owner</xy-checkbox>
        <xy-checkbox value="viewer">Viewer</xy-checkbox>
        <xy-checkbox value="guest">Guest</xy-checkbox>
      </xy-checkbox-group>
    </xy-form-item>
  </xy-form>
</template>
