<script setup lang="ts">
import { reactive, ref } from "vue";

const formModel = reactive({
  name: "默认审批流",
  owner: "小叶",
  enabled: true
});

const latestMessage = ref("尚未提交。");

function handleSubmitSuccess() {
  latestMessage.value = "提交成功，当前示例只演示表单请求边界。";
}
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-request-form
      title="审批流设置"
      description="当前示例关闭即时请求，只演示加载/提交边界。"
      :model="formModel"
      :immediate="false"
      @submit-success="handleSubmitSuccess"
    >
      <xy-form-item label="流程名称" prop="name">
        <xy-input v-model="formModel.name" placeholder="请输入流程名称" />
      </xy-form-item>
      <xy-form-item label="负责人" prop="owner">
        <xy-input v-model="formModel.owner" placeholder="请输入负责人" />
      </xy-form-item>
      <xy-form-item label="启用状态" prop="enabled">
        <xy-switch v-model="formModel.enabled" />
      </xy-form-item>
    </xy-request-form>

    <xy-card header="说明">
      {{ latestMessage }}
    </xy-card>
  </div>
</template>
