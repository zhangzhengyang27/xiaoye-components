<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const rows = Array.from({ length: 18 }, (_, index) => `配置项 ${index + 1}`);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button type="primary" @click="open = true">打开长内容对话框</xy-button>

    <xy-dialog
      v-model="open"
      title="长表单审核"
      width="680px"
      sticky-header
      sticky-footer
      body-max-height="360px"
    >
      <div class="xy-doc-stack">
        <p v-for="row in rows" :key="row">{{ row }}：这里演示长内容时 body 区域单独滚动。</p>
      </div>

      <template #footer>
        <xy-space>
          <xy-button plain @click="open = false">取消</xy-button>
          <xy-button type="primary" @click="open = false">提交审核</xy-button>
        </xy-space>
      </template>
    </xy-dialog>
  </div>
</template>

