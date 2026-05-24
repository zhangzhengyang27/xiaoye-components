<script setup lang="ts">
import { reactive, ref } from "vue";

const formRef = ref<{
  validateField: (props?: string | string[]) => Promise<boolean>;
  clearValidate: (props?: string | string[]) => void;
  resetFields: (props?: string | string[]) => void;
} | null>(null);

const model = reactive({
  name: "",
  role: null as string | null
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
  <!-- 表单方法：展示字段级别的校验、清空和重置方法 -->
  <div class="demo-form-methods">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-form-methods__header">
          <strong>字段级方法</strong>
          <xy-tag status="neutral" round>Methods</xy-tag>
        </div>
        <p class="demo-form-methods__description">
          表单支持字段级别的校验、清空和重置操作。
        </p>
      </template>

      <xy-form ref="formRef" :model="model" :rules="rules">
        <xy-form-item label="成员名称" prop="name">
          <xy-input v-model="model.name" placeholder="请输入成员名称" />
        </xy-form-item>
        <xy-form-item label="角色" prop="role">
          <xy-select
            v-model="model.role"
            :options="[
              { label: '管理员', value: 'admin' },
              { label: '成员', value: 'member' }
            ]"
          />
        </xy-form-item>
      </xy-form>

      <template #footer>
        <xy-space wrap>
          <xy-button plain @click="validateName">只校验名称</xy-button>
          <xy-button plain @click="clearNameValidate">清空名称校验</xy-button>
          <xy-button plain @click="resetRoleField">重置角色字段</xy-button>
        </xy-space>
        <xy-tag :status="feedback.includes('通过') ? 'success' : 'warning'" round>{{ feedback }}</xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-form-methods {
  max-width: 640px;
}

.demo-form-methods__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-form-methods__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
