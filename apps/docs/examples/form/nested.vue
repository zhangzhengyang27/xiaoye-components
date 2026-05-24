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
  <!-- 表单嵌套字段：展示嵌套结构的数据绑定 -->
  <div class="demo-form-nested">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-form-nested__header">
          <strong>嵌套字段</strong>
          <xy-tag status="neutral" round>Nested</xy-tag>
        </div>
        <p class="demo-form-nested__description">
          表单支持嵌套结构的数据绑定，使用路径字符串作为 prop。
        </p>
      </template>

      <xy-form ref="formRef" :model="form" :rules="rules" scroll-to-error label-width="96px">
        <xy-form-item label="姓名" :prop="['profile', 'name']">
          <xy-input v-model="form.profile.name" placeholder="请输入姓名" />
        </xy-form-item>
        <xy-button type="primary" @click="submit">提交</xy-button>
      </xy-form>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-form-nested {
  max-width: 560px;
}

.demo-form-nested__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-form-nested__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
