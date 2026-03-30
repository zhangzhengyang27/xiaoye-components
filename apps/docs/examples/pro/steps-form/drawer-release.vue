<script setup lang="ts">
import { reactive, ref } from "vue";

const open = ref(false);
const formModel = reactive({
  template: "标准账单模板",
  reviewers: "财务复核, 运营负责人",
  remark: ""
});

const steps = [
  {
    key: "template",
    title: "确认模板",
    description: "选择导入模板和适用范围"
  },
  {
    key: "review",
    title: "确认审批链",
    description: "补齐复核人和风险说明"
  }
];
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-card header="批量导入发布">
      <p>账单模板已经校验完成，接下来需要补齐审批链后才能正式下发到工作台。</p>
      <xy-button type="primary" @click="open = true">打开抽屉步骤流</xy-button>
    </xy-card>

    <xy-steps-form
      v-model:open="open"
      placement="drawer"
      title="发布账单导入流程"
      :model="formModel"
      :steps="steps"
    >
      <template #default="{ active }">
        <xy-form-item v-if="active === 0" label="导入模板" prop="template">
          <xy-input v-model="formModel.template" placeholder="请输入模板名称" />
        </xy-form-item>
        <xy-form-item v-if="active === 0" label="适用范围">
          <xy-input value="华东供应商工作台" disabled />
        </xy-form-item>
        <xy-form-item v-if="active === 1" label="审批链" prop="reviewers">
          <xy-input v-model="formModel.reviewers" placeholder="请输入审批链" />
        </xy-form-item>
        <xy-form-item v-if="active === 1" label="风险说明" prop="remark">
          <xy-input
            v-model="formModel.remark"
            type="textarea"
            placeholder="请输入上线前风险说明"
          />
        </xy-form-item>
      </template>
    </xy-steps-form>
  </div>
</template>
