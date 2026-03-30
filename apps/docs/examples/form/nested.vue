<script setup lang="ts">
import { reactive, ref } from "vue";
import { XyForm } from "xiaoye-components";
import type { FormRules } from "xiaoye-components";

const formRef = ref<InstanceType<typeof XyForm> | null>(null);
const form = reactive({
  profile: {
    name: ""
  }
});

const rules: FormRules = {
  "profile.name": [{ required: true, message: "请输入姓名", trigger: "change" }]
};

function submit() {
  void formRef.value?.validate();
}
</script>

<template>
  <xy-form ref="formRef" :model="form" :rules="rules" scroll-to-error label-width="96px">
    <xy-form-item label="姓名" :prop="['profile', 'name']">
      <xy-input v-model="form.profile.name" placeholder="请输入姓名" />
    </xy-form-item>
    <xy-button type="primary" @click="submit">提交</xy-button>
  </xy-form>
</template>
