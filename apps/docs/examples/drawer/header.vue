<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button type="primary" @click="open = true">自定义头部</xy-button>

    <xy-drawer
      v-model="open"
      title="审阅工作台"
      header-class="demo-drawer-header"
      body-class="demo-drawer-body"
      footer-class="demo-drawer-footer"
    >
      <template #header="{ close, titleId, titleClass }">
        <div class="demo-drawer-header__content">
          <div class="demo-drawer-header__meta">
            <span :id="titleId" :class="titleClass">审阅工作台</span>
            <small class="demo-drawer-header__caption">通过 slot props 保持可访问标题与关闭句柄。</small>
          </div>
          <xy-space>
            <xy-tag status="warning">待确认</xy-tag>
            <xy-button plain @click="close()">关闭</xy-button>
          </xy-space>
        </div>
      </template>

      <div class="xy-doc-stack">
        <p>头部区域可以完全自定义，默认关闭按钮仍然保留。</p>
        <xy-input placeholder="审批备注" />
        <xy-select
          placeholder="审批动作"
          :options="[
            { label: '通过', value: 'approved' },
            { label: '驳回', value: 'rejected' },
            { label: '转交', value: 'handover' }
          ]"
        />
      </div>

      <template #footer>
        <xy-space>
          <xy-button plain @click="open = false">暂存</xy-button>
          <xy-button type="primary" @click="open = false">提交审阅</xy-button>
        </xy-space>
      </template>
    </xy-drawer>
  </div>
</template>

<style scoped>
.demo-drawer-header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.demo-drawer-header__meta {
  display: grid;
  gap: 4px;
}

.demo-drawer-header__caption {
  color: var(--xy-text-color-secondary);
}
</style>
