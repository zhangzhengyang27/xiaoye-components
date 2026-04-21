<script setup lang="ts">
import { reactive, ref } from "vue";

const open = ref(false);
const formModel = reactive({
  name: "成员台账",
  owner: "小叶"
});
const feedback = ref("尚未提交");

function handleSubmit() {
  feedback.value = `已通过弹窗提交：${formModel.name} / ${formModel.owner}`;
  open.value = false;
}
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-button type="primary" @click="open = true">打开弹窗编辑</xy-button>

    <xy-dialog-form
      v-model:open="open"
      title="编辑成员"
      :model="formModel"
      :dialog-props="{ width: 640 }"
      @submit="handleSubmit"
    >
      <xy-form-item label="名称" prop="name">
        <xy-input v-model="formModel.name" placeholder="请输入名称" />
      </xy-form-item>
      <xy-form-item label="负责人" prop="owner">
        <xy-input v-model="formModel.owner" placeholder="请输入负责人" />
      </xy-form-item>
    </xy-dialog-form>

    <xy-card header="最近结果">
      {{ feedback }}
    </xy-card>
  </div>
</template>
