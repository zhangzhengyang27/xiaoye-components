<script setup lang="ts">
import { ref } from "vue";

const feedback = ref("尚未触发操作");

function handleCommand(command: string | number | Record<string, unknown> | undefined) {
  feedback.value = `已触发命令：${String(command ?? "undefined")}`;
}
</script>

<template>
  <!-- 下拉菜单基础用法：展示点击触发的操作菜单 -->
  <div class="demo-dropdown-basic">
    <xy-card shadow="never">
      <template #header>
        <div class="demo-dropdown-basic__header">
          <strong>基础用法</strong>
          <xy-tag status="neutral" round>操作菜单</xy-tag>
        </div>
        <p class="demo-dropdown-basic__description">
          下拉菜单用于收纳操作选项，支持禁用、分隔线和危险操作。
        </p>
      </template>

      <xy-dropdown trigger="click" @command="handleCommand">
        <xy-button plain>更多操作</xy-button>

        <template #dropdown>
          <xy-dropdown-menu>
            <xy-dropdown-item command="edit">编辑成员</xy-dropdown-item>
            <xy-dropdown-item disabled description="当前状态不可操作">停用账号</xy-dropdown-item>
            <xy-dropdown-item divided danger command="delete">
              删除成员
              <template #description>会同步移除角色绑定</template>
            </xy-dropdown-item>
          </xy-dropdown-menu>
        </template>
      </xy-dropdown>

      <template #footer>
        <xy-tag status="primary">{{ feedback }}</xy-tag>
      </template>
    </xy-card>
  </div>
</template>

<style scoped>
.demo-dropdown-basic {
  max-width: 480px;
}

.demo-dropdown-basic__header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.demo-dropdown-basic__description {
  margin: 6px 0 0;
  color: var(--xy-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
</style>
