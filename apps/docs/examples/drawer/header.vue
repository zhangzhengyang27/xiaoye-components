<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <!-- 抽屉自定义头部：展示完全自定义的抽屉头部区域 -->
  <div class="demo-drawer-header">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-drawer-header__header">
          <strong>自定义头部</strong>
          <xy-tag status="neutral" round>Header Slot</xy-tag>
        </div>
        <p class="demo-drawer-header__description">
          通过 header slot 可以完全自定义抽屉头部区域。
        </p>
      </template>

      <xy-button type="primary" @click="open = true">自定义头部</xy-button>
    </xy-card>

    <xy-drawer
      v-model="open"
      title="审阅工作台"
      header-class="demo-drawer-header-drawer"
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

      <div class="demo-drawer-header__form">
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
.demo-drawer-header {
  max-width: 640px;
}

.demo-drawer-header__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-drawer-header__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}

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

.demo-drawer-header__form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-drawer-header__form p {
  margin: 0;
  color: var(--xy-text-color-secondary);
  line-height: 1.6;
}
</style>
