<script setup lang="ts">
import { reactive, ref } from "vue";

const steps = [
  {
    key: "base",
    title: "发布信息",
    description: "确认方案名称与负责人",
    schema: [
      {
        prop: "name",
        label: "发布名称"
      },
      {
        prop: "owner",
        label: "发布负责人"
      }
    ]
  },
  {
    key: "config",
    title: "上线配置",
    description: "补齐启用范围和说明",
    schema: [
      {
        prop: "enabled",
        label: "是否立即启用",
        valueType: "tag",
        options: [
          {
            label: "立即启用",
            value: true,
            status: "success"
          },
          {
            label: "暂不启用",
            value: false,
            status: "warning"
          }
        ]
      },
      {
        prop: "remark",
        label: "上线说明"
      }
    ]
  }
];

const active = ref(0);
const latestSubmit = ref("尚未完成提交流程。");
const reviewMode = ref(false);
const formModel = reactive({
  name: "",
  owner: "",
  enabled: true,
  remark: ""
});

function handleSubmit(payload: Record<string, unknown>) {
  latestSubmit.value = `已提交发布申请：${String(payload.name ?? "未命名方案")}`;
}
</script>

<template>
  <div class="xy-pro-demo-stack">
    <xy-card header="当前模式">
      <xy-space>
        <xy-button @click="reviewMode = !reviewMode">
          {{ reviewMode ? "切回编辑态" : "切到复核查看" }}
        </xy-button>
        <xy-tag :status="reviewMode ? 'warning' : 'primary'">
          {{ reviewMode ? "复核查看" : "编辑录入" }}
        </xy-tag>
      </xy-space>
    </xy-card>

    <xy-steps-form
      v-model:active="active"
      :model="formModel"
      :steps="steps"
      :readonly="reviewMode"
      @submit="handleSubmit"
    >
      <template #default="{ active: currentActive }">
        <xy-form-item v-if="!reviewMode && currentActive === 0" label="发布名称" prop="name">
          <xy-input v-model="formModel.name" placeholder="请输入发布名称" />
        </xy-form-item>
        <xy-form-item v-if="!reviewMode && currentActive === 0" label="发布负责人" prop="owner">
          <xy-input v-model="formModel.owner" placeholder="请输入发布负责人" />
        </xy-form-item>
        <xy-form-item v-if="!reviewMode && currentActive === 1" label="是否立即启用" prop="enabled">
          <xy-switch v-model="formModel.enabled" />
        </xy-form-item>
        <xy-form-item v-if="!reviewMode && currentActive === 1" label="上线说明" prop="remark">
          <xy-input v-model="formModel.remark" type="textarea" placeholder="补充上线说明" />
        </xy-form-item>
      </template>
    </xy-steps-form>

    <xy-card header="发布反馈">
      {{ latestSubmit }}
    </xy-card>
  </div>
</template>
