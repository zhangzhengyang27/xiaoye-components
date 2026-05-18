<script setup lang="ts">
import { reactive, ref } from "vue";

// 表单引用：用于调用表单校验方法
const formRef = ref<{
  validate: () => Promise<boolean>;
} | null>(null);

// 表单数据模型：成员信息
const memberForm = reactive({
  name: "",
  role: null as string | null
});

// 校验规则：必填项校验
const rules = {
  name: [{ required: true, message: "请输入成员名称", trigger: "blur" as const }],
  role: [{ required: true, message: "请选择角色", trigger: "change" as const }]
};

// 校验结果反馈文案
const validationFeedback = ref("尚未提交");

// 触发表单校验并展示结果
async function submitFormValidation() {
  const isValid = await formRef.value?.validate();
  validationFeedback.value = isValid ? "✅ 表单校验通过" : "⚠️ 表单校验未通过";
}
</script>

<template>
  <!-- 表单基础用法：展示数据绑定、校验规则、校验结果反馈 -->
  <div class="xy-doc-stack">
    <xy-form ref="formRef" :model="memberForm" :rules="rules">
      <xy-form-item label="成员名称" prop="name">
        <xy-input v-model="memberForm.name" placeholder="请输入成员名称" />
      </xy-form-item>
      <xy-form-item label="角色" prop="role">
        <xy-select
          v-model="memberForm.role"
          :options="[
            { label: '管理员', value: 'admin' },
            { label: '成员', value: 'member' },
            { label: '访客', value: 'guest' }
          ]"
        />
      </xy-form-item>
    </xy-form>

    <xy-space wrap>
      <xy-button type="primary" @click="submitFormValidation">提交并校验</xy-button>
      <xy-tag :status="validationFeedback.includes('通过') ? 'success' : 'warning'">{{ validationFeedback }}</xy-tag>
    </xy-space>
  </div>
</template>
