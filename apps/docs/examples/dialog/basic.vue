<script setup lang="ts">
import { ref } from "vue";

// 对话框显示状态
const isDialogVisible = ref(false);
</script>

<template>
  <!-- 对话框基础用法：展示弹窗的打开/关闭、标题、内容和底部操作按钮 -->
  <div class="xy-doc-stack">
    <xy-button type="primary" @click="isDialogVisible = true">新建成员</xy-button>

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
