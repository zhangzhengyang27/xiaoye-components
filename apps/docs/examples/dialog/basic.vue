<script setup lang="ts">
import { ref } from "vue";

// 对话框显示状态
const isDialogVisible = ref(false);
</script>

<template>
  <!-- 对话框基础用法：展示弹窗的打开/关闭、标题、内容和底部操作按钮 -->
  <div class="demo-dialog-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-dialog-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>模态弹窗</xy-tag>
        </div>
        <p class="demo-dialog-basic__description">
          点击按钮打开对话框，支持自定义标题、内容和底部操作。
        </p>
      </template>

      <xy-button type="primary" @click="isDialogVisible = true">新建成员</xy-button>

      <template #footer>
        <xy-space>
          <xy-button plain @click="isDialogVisible = false">取消</xy-button>
          <xy-button type="primary" @click="isDialogVisible = false">确认创建</xy-button>
        </xy-space>
      </template>
    </xy-card>

    <xy-dialog v-model="isDialogVisible" title="新建成员">
      <p>请填写成员基本信息，带 * 号的字段为必填项。</p>

      <template #footer>
        <xy-space>
          <xy-button plain @click="isDialogVisible = false">取消</xy-button>
          <xy-button type="primary" @click="isDialogVisible = false">确认创建</xy-button>
        </xy-space>
      </template>
    </xy-dialog>
  </div>
</template>

<style scoped>
.demo-dialog-basic {
  max-width: 640px;
}

.demo-dialog-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-dialog-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
