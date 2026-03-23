<script setup lang="ts">
import { reactive, ref } from "vue";

const formRef = ref<{
  validateField: (props?: string | string[]) => Promise<boolean>;
  clearValidate: (props?: string | string[]) => void;
  resetFields: (props?: string | string[]) => void;
} | null>(null);

const model = reactive({
  name: "",
  role: null as string | null,
  joinedAt: null as string | null
});

const rules = {
  name: [{ required: true, message: "请输入成员名称", trigger: "blur" as const }],
  role: [{ required: true, message: "请选择角色", trigger: "change" as const }]
};

const feedback = ref("尚未触发字段级操作");

async function validateName() {
  const valid = await formRef.value?.validateField("name");
  feedback.value = valid ? "名称字段校验通过" : "名称字段校验未通过";
}

function clearNameValidate() {
  formRef.value?.clearValidate("name");
  feedback.value = "已清空名称字段校验";
}

function resetRoleField() {
  formRef.value?.resetFields("role");
  feedback.value = "已重置角色字段";
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-form ref="formRef" :model="model" :rules="rules">
      <xy-form-item label="成员名称" prop="name" help="失焦时会触发名称校验">
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
      <xy-form-item label="入职日期" prop="joinedAt">
        <xy-date-picker v-model="model.joinedAt" clearable />
      </xy-form-item>
    </xy-form>

    <xy-space wrap>
      <xy-button plain @click="validateName">只校验名称</xy-button>
      <xy-button plain @click="clearNameValidate">清空名称校验</xy-button>
      <xy-button plain @click="resetRoleField">重置角色字段</xy-button>
    </xy-space>

    <xy-tag :status="feedback.includes('通过') ? 'success' : 'warning'">{{ feedback }}</xy-tag>
  </div>
</template>
