<template>
  <xyu-button type="primary" @click="visible = true">打开抽屉</xyu-button>
  <xyu-drawer v-model="visible">
    <template #header>
      <div style="font-weight: 600; color: var(--xyu-primary)">自定义头部</div>
    </template>
    <p>自定义抽屉头部内容。</p>
    <template #footer>
      <xyu-button @click="visible = false">取消</xyu-button>
      <xyu-button type="primary" @click="visible = false">确定</xyu-button>
    </template>
  </xyu-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
const visible = ref(false);
</script>
