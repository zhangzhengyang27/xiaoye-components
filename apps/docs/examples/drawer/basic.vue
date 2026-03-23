<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button type="primary" @click="open = true">打开抽屉</xy-button>

    <xy-drawer v-model="open" title="编辑成员资料">
      <div class="xy-doc-stack">
        <xy-input placeholder="成员名称" />
        <xy-select
          :options="[
            { label: '管理员', value: 'admin' },
            { label: '成员', value: 'member' }
          ]"
          placeholder="角色"
        />
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
