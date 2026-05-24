<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <!-- 抽屉基础用法：展示侧边滑出的面板 -->
  <div class="demo-drawer-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-drawer-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>侧边面板</xy-tag>
        </div>
        <p class="demo-drawer-basic__description">
          抽屉用于从侧边滑出的面板，适合编辑表单、详情查看等场景。
        </p>
      </template>

      <xy-button type="primary" @click="open = true">打开抽屉</xy-button>
    </xy-card>

    <xy-drawer v-model="open" title="编辑成员资料">
      <div class="demo-drawer-basic__form">
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

<style scoped>
.demo-drawer-basic {
  max-width: 640px;
}

.demo-drawer-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-drawer-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.demo-drawer-basic__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
