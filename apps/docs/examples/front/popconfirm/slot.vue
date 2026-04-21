<template>
  <xyu-popconfirm title="自定义内容">
    <template #content>
      <div style="padding: 8px 0">
        <p style="margin: 0 0 8px; font-size: 14px">确认要继续操作吗？</p>
        <xyu-button size="small" type="primary" @click="handleConfirm">确认</xyu-button>
      </div>
    </template>
    <xyu-button>自定义内容</xyu-button>
  </xyu-popconfirm>
</template>

<script setup lang="ts">
function handleConfirm() {
  console.log("confirmed");
}
</script>
