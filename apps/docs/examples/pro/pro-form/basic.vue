<script setup lang="ts">
import { reactive, ref } from "vue";

const formModel = reactive({
  name: "",
  owner: "",
  enabled: true
});

const message = ref("还没有提交。");

function handleSubmit(payload: Record<string, unknown>) {
  message.value = `已提交「${String(payload.name ?? "未命名方案")}」`;
}
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-pro-form
      title="方案配置"
      description="先统一头部、字段区和底部动作，再逐步补齐字段细节。"
      :model="formModel"
      @submit="handleSubmit"
    >
      <xy-form-item label="方案名称" prop="name">
        <xy-input v-model="formModel.name" placeholder="请输入方案名称" />
      </xy-form-item>
      <xy-form-item label="负责人" prop="owner">
        <xy-input v-model="formModel.owner" placeholder="请输入负责人" />
      </xy-form-item>
      <xy-form-item label="启用状态" prop="enabled">
        <xy-switch v-model="formModel.enabled" />
      </xy-form-item>
    </xy-pro-form>

    <xy-card header="最近一次动作">
      {{ message }}
    </xy-card>
  </div>
</template>
