<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button type="primary" @click="open = true">打开对话框</xy-button>

    <xy-dialog v-model="open" title="新建成员">
      <p>这里可以放表单、说明文本或二次确认内容。</p>

      <template #footer>
        <xy-space>
          <xy-button plain @click="open = false">取消</xy-button>
          <xy-button type="primary" @click="open = false">确认</xy-button>
        </xy-space>
      </template>
    </xy-dialog>
  </div>
</template>
