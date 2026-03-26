<script setup lang="ts">
import { ref } from "vue";

const open = ref(false);
const modal = ref(true);
const penetrable = ref(false);
</script>

<template>
  <div class="xy-doc-stack">
    <xy-space wrap>
      <xy-button type="primary" @click="open = true">打开 modal 模式演示</xy-button>
      <xy-switch v-model="modal" />
      <xy-tag :status="modal ? 'primary' : 'warning'">
        {{ modal ? "显示遮罩" : "无遮罩" }}
      </xy-tag>
      <xy-switch v-model="penetrable" :disabled="modal" />
      <xy-tag :status="penetrable ? 'success' : 'info'">
        {{ penetrable ? "允许背景穿透" : "拦截背景点击" }}
      </xy-tag>
    </xy-space>

    <xy-dialog
      v-model="open"
      title="遮罩策略"
      :modal="modal"
      :modal-penetrable="penetrable"
      :append-to-body="!modal"
      width="520px"
    >
      <p>当 `modal=false` 时，dialog 仍然存在，只是不渲染遮罩层；`modal-penetrable` 适合做非阻断工作台。</p>
    </xy-dialog>
  </div>
</template>

