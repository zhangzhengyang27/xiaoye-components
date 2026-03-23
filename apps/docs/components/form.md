---
title: Form 表单
---

<script setup lang="ts">
import { reactive, ref } from "vue";

const model = reactive({
  name: "",
  role: null as string | null
});

const rules = {
  name: [{ required: true, message: "请输入成员名称", trigger: "blur" as const }],
  role: [{ required: true, message: "请选择角色", trigger: "change" as const }]
};

const formRef = ref<{
  validate: () => Promise<boolean>;
  validateField: (props?: string | string[]) => Promise<boolean>;
  clearValidate: (props?: string | string[]) => void;
  resetFields: (props?: string | string[]) => void;
} | null>(null);
const feedback = ref("尚未触发校验");

async function handleValidateName() {
  const valid = await formRef.value?.validateField("name");
  feedback.value = valid ? "名称字段校验通过" : "名称字段校验未通过";
}

function handleResetRole() {
  formRef.value?.resetFields("role");
  feedback.value = "角色字段已重置";
}
</script>

# Form 表单

用于组织录入结构和字段级校验，重点不是大而全，而是让中后台常见录入链路更顺手。

## 基础用法

<div class="xy-doc-stack">
  <xy-form ref="formRef" :model="model" :rules="rules">
    <xy-form-item label="成员名称" prop="name" help="失焦时触发校验">
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
    <xy-button plain @click="handleValidateName">校验名称字段</xy-button>
    <xy-button plain @click="handleResetRole">重置角色字段</xy-button>
  </xy-space>

  <xy-tag :status="feedback.includes('通过') ? 'success' : 'warning'">
    {{ feedback }}
  </xy-tag>
</div>

## 为什么它适合中后台表单

- 支持 `validateField`，适合局部保存和向导式步骤。
- 支持 `clearValidate`，适合切换数据源后清掉旧错误。
- 支持 `resetFields`，适合分区回滚而不是整表单重置。

## Form 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `model` | 表单数据对象 | `Record<string, unknown>` | — |
| `rules` | 校验规则集合 | `FormRules` | `{}` |
| `label-width` | 标签宽度 | `string \| number` | `'112px'` |
| `label-position` | 标签布局方式 | `'left' \| 'top'` | `'left'` |
| `size` | 表单默认尺寸 | `ComponentSize` | `'md'` |

## FormItem 属性

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `label` | 字段标签 | `string` | `''` |
| `prop` | 对应的模型字段名 | `string` | `''` |
| `rules` | 当前项额外规则 | `XyFormRule[]` | `[]` |
| `required` | 是否必填 | `boolean` | `false` |
| `help` | 帮助或占位提示文案 | `string` | `''` |

## 暴露方法

| 方法 | 说明 |
| --- | --- |
| `validate()` | 校验整个表单 |
| `validateField(props, trigger?)` | 校验指定字段 |
| `resetFields(props?)` | 重置指定字段或整表单 |
| `clearValidate(props?)` | 清空指定字段或整表单的校验信息 |
