<script setup lang="ts">
import { ref } from "vue";

const feedback = ref("尚未触发操作");

function handleCommand(command: string | number | Record<string, unknown> | undefined) {
  feedback.value = `已触发命令：${String(command ?? "undefined")}`;
}
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
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

      <xy-tag status="primary">{{ feedback }}</xy-tag>
    </xy-space>
  </div>
</template>
