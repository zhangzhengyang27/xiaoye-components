<script setup lang="ts">
import { reactive, ref } from "vue";

const open = ref(false);
const files = ref([]);
const model = reactive({
  name: "",
  role: null as string | null
});
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="open = true">打开侧边编辑</xy-button>
      <xy-tag status="warning">适合大表单、详情侧滑编辑和保留列表上下文</xy-tag>
    </xy-space>

    <xy-drawer v-model="open" title="编辑成员资料">
      <div class="xy-doc-stack">
        <xy-form :model="model">
          <xy-form-item label="成员名称" prop="name">
            <xy-input v-model="model.name" placeholder="请输入成员名称" />
          </xy-form-item>
          <xy-form-item label="角色" prop="role">
            <xy-select
              v-model="model.role"
              searchable
              :options="[
                { label: '管理员', value: 'admin' },
                { label: '成员', value: 'member' },
                { label: '访客', value: 'guest' }
              ]"
            />
          </xy-form-item>
          <xy-form-item label="补充材料">
            <xy-upload v-model="files" tip="支持附件补充上传" />
          </xy-form-item>
        </xy-form>
      </div>

      <template #footer>
        <xy-space>
          <xy-button plain @click="open = false">取消</xy-button>
          <xy-button type="primary" @click="open = false">保存</xy-button>
        </xy-space>
      </template>
    </xy-drawer>
  </div>
</template>
