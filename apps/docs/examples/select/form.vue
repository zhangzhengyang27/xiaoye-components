<script setup lang="ts">
import { reactive } from "vue";

const model = reactive({
  role: null as string | null
});

const rules = {
  role: [{ required: true, message: "请选择角色", trigger: "change" as const }]
};
</script>

<template>
  <xy-form :model="model" :rules="rules">
    <xy-form-item label="角色" prop="role">
      <div class="xy-doc-field xy-doc-field--popper-demo">
        <xy-select
          v-model="model.role"
          :options="[
            { label: '管理员', value: 'admin' },
            { label: '成员', value: 'member' },
            { label: '访客', value: 'guest' }
          ]"
          placeholder="请选择角色"
        />
      </div>
    </xy-form-item>
  </xy-form>
</template>
