<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-button @click="open = true">打开居中确认</xy-button>

    <xy-dialog v-model="open" title="确认同步" center width="480px">
      <p>头部和底部会水平居中，适合更强调确认动作的场景。</p>

      <template #footer>
        <xy-space>
          <xy-button plain @click="open = false">稍后处理</xy-button>
          <xy-button type="primary" @click="open = false">立即同步</xy-button>
        </xy-space>
      </template>
    </xy-dialog>
  </div>
</template>

