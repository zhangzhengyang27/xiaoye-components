<script setup lang="ts">
import { ref } from "vue";

const visible = ref(true);
</script>

<template>
  <div class="alert-demo-stack">
    <xy-space>
      <xy-button type="primary" @click="visible = true">重新打开提示</xy-button>
      <xy-button plain @click="visible = !visible">
        {{ visible ? "外部隐藏" : "外部显示" }}
      </xy-button>
    </xy-space>

    <xy-alert
      v-model="visible"
      title="当前提示由父组件控制显示状态"
      type="primary"
      description="点击关闭按钮或外部按钮时，都会通过 v-model 同步到同一份状态。"
      show-icon
    />
  </div>
</template>

<style scoped>
.alert-demo-stack {
  display: grid;
  gap: 12px;
}
</style>
