<script setup lang="ts">
import { reactive, ref } from "vue";

const formRef = ref<{
  validate: () => Promise<boolean>;
} | null>(null);

const model = reactive({
  name: "",
  role: null as string | null
});

const rules = {
  name: [{ required: true, message: "请输入成员名称", trigger: "blur" as const }],
  role: [{ required: true, message: "请选择角色", trigger: "change" as const }]
};

const feedback = ref("尚未提交");

async function handleValidate() {
  const valid = await formRef.value?.validate();
  feedback.value = valid ? "表单校验通过" : "表单校验未通过";
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-form ref="formRef" :model="model" :rules="rules">
      <xy-form-item label="成员名称" prop="name">
        <xy-input v-model="model.name" placeholder="请输入成员名称" />
      </xy-form-item>
      <xy-form-item label="角色" prop="role">
        <xy-select
          v-model="model.role"
          :options="[
            { label: '管理员', value: 'admin' },
            { label: '成员', value: 'member' },
            { label: '访客', value: 'guest' }
          ]"
        />
      </xy-form-item>
    </xy-form>

    <xy-space wrap>
      <xy-button type="primary" @click="handleValidate">提交校验</xy-button>
      <xy-tag :status="feedback.includes('通过') ? 'success' : 'warning'">{{ feedback }}</xy-tag>
    </xy-space>
  </div>
</template>
